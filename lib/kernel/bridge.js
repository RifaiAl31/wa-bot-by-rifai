// lib/kernel/bridge.js — jembatan antara bot WhatsApp Bot (CommonJS) dan runtime fitur tambahan (ESM).
// Dimuat lewat import() oleh lib/adapter/e9.js. Tidak menyentuh handler pesan milik WhatsApp Bot:
// WhatsApp Bot tetap mengurus prefix, owner, limit/energi (survival), UI rich; bagian ini hanya menjalankan fiturnya.
import './config.js'
import { initDatabase, saveDB } from './lib/core/system.js'
import { initPlugins, routeSub, matchPlugin, matchSub, sendExample, runPassivePlugins, afkCheck } from './lib/engine/plugins.js'
import { serialize, attachHelpers, groupGuard, captureViewOnceRaw } from './lib/platform/wa.js'
import { warmLid } from './lib/core/lid.js'
import { credCtx } from './lib/core/usercreds.js'
import { recordCommand, isUserBanned, isChatBanned } from './lib/core/data.js'

let booting = null
const kcache = new WeakMap()

export function boot() {
  if (!booting) {
    booting = (async () => {
      global.handledMsgs = global.handledMsgs || new Set()
      initDatabase()
      await initPlugins()
      return true
    })()
  }
  return booting
}

function kSock(sock) {
  let k = kcache.get(sock)
  if (k) return k
  // turunan dari sock WhatsApp Bot: method WhatsApp Bot tetap terpakai, helper tambahan hanya menempel di turunan ini
  k = Object.create(sock)
  try { attachHelpers(k) } catch (e) { console.log('[KERNEL] helper sock sebagian gagal:', e.message) }
  if (typeof k.decodeJid !== 'function') {
    k.decodeJid = (jid) => {
      if (!jid) return jid
      if (/:\d+@/.test(jid)) { const [u, s] = jid.split('@'); return u.split(':')[0] + '@' + s }
      return jid
    }
  }
  global.sock = k
  kcache.set(sock, k)
  return k
}

const keyOf = (k) => String(k).replace(/^\//, '').replace(/\.js$/, '')

function findPlugin(rel) {
  for (const [k, fn] of Object.entries(global.plugins || {})) if (keyOf(k) === rel) return fn
  return null
}

async function makeM(k, raw) {
  try { await warmLid(k, raw) } catch {}
  return serialize(k, { ...raw })
}

function senderOf(m, jid) {
  return m.isGroup ? (m.sender || m.key.participant) : (m.chatPn || jid)
}

// simpan media sekali-lihat SAAT MASUK supaya .rvo masih bisa membukanya (WhatsApp menghapus filenya dari server setelah dibuka)
export function captureVO(sock, raw) {
  try {
    const prev = global.sock // kSock() menimpa global.sock saat membuat turunan baru; jangan biarkan pesan biasa mengubahnya
    const k = kSock(sock)
    if (prev) global.sock = prev
    captureViewOnceRaw(k, raw)
  } catch (e) { console.log('[VIEWONCE] capture gagal:', e?.message || e) }
}

export async function runCommand(sock, raw, v) {
  await boot()
  const plugin = findPlugin(v.rel)
  if (!plugin) throw new Error('fitur tidak ditemukan: ' + v.rel)
  const k = kSock(sock)
  const m = await makeM(k, raw)
  const jid = m.chat || m.key.remoteJid
  const sender = senderOf(m, jid)
  const command = String(v.command || '').toLowerCase()
  const routed = matchPlugin(plugin, command) ? routeSub(plugin, command, v.text) : (matchSub(plugin, command) ? { command, text: v.text } : { command, text: v.text })
  const ctx = { sock: k, text: routed.text, prefix: v.prefix, command: routed.command, reply: m.reply, sender, jid, isOwner: !!v.isOwner, isAdmin: !!v.isAdmin, body: v.body || m.body || '', isCmd: true }
  ctx.example = (usage) => sendExample(k, m, { prefix: v.prefix, command: ctx.command, usage })
  if (!ctx.isOwner && (await isUserBanned(k, m, sender).catch(() => false))) return
  if (m.isGroup && !ctx.isOwner && isChatBanned(jid)) return
  const involved = syncIn(sender, m)
  try {
    recordCommand(ctx.command, sender, m.pushName)
  } catch {}
  try {
    await credCtx.run({ sender, isOwner: ctx.isOwner }, () => plugin(m, ctx))
  } finally {
    syncOut(involved)
  }
}

// pesan biasa (bukan command): game yang menunggu jawaban, afk, dll
export async function runPassive(sock, raw, v) {
  await boot()
  const k = kSock(sock)
  const m = await makeM(k, raw)
  const jid = m.chat || m.key.remoteJid
  const sender = senderOf(m, jid)
  const body = v.body || m.body || ''
  if (!body) return
  const ctx = { sock: k, text: body, prefix: v.prefix, command: '', reply: m.reply, example: () => {}, sender, jid, isOwner: !!v.isOwner, isAdmin: !!v.isAdmin, body, isCmd: false }
  if (!ctx.isOwner && (await isUserBanned(k, m, sender).catch(() => false))) return
  if (m.isGroup) { try { await groupGuard(k, m, { isOwner: ctx.isOwner }) } catch {} }
  try { await afkCheck(k, m, { skip: false }) } catch {}
  await runPassivePlugins(k, m, ctx)
}

// ---- saldo/exp/level/bank: sumber kebenaran tetap data pemain WhatsApp Bot ----
const FIELDS = ['money', 'exp', 'level', 'bank']
function kUsers() {
  const d = global.kdb || {}
  return [d.users, d.rpg?.users, d.rpgUsers].filter(Boolean)
}
function syncIn(sender, m) {
  const out = []
  try {
    const getUser = global.__vxGetUser
    if (typeof getUser !== 'function') return out
    const ids = new Set([sender, ...(m.mentionedJid || []), m.quoted?.sender].filter(Boolean))
    for (const id of ids) {
      const pn = String(id).split('@')[0].split(':')[0]
      const vu = getUser(id)
      if (!vu) continue
      const snap = {}
      for (const tbl of kUsers()) {
        const ku = tbl[id] || tbl[pn] || tbl[pn + '@s.whatsapp.net']
        if (!ku || typeof ku !== 'object') continue
        for (const f of FIELDS) if (typeof vu[f] === 'number') { ku[f] = vu[f]; snap[f] = vu[f] }
        out.push({ id, ku, vu, snap })
      }
    }
  } catch (e) { console.log('[KERNEL] syncIn:', e.message) }
  return out
}
function syncOut(list) {
  try {
    for (const { ku, vu, snap } of list) {
      for (const f of FIELDS) if (typeof ku[f] === 'number' && ku[f] !== snap[f]) vu[f] = ku[f]
    }
    if (list.length && typeof global.__vxSaveUsers === 'function') global.__vxSaveUsers()
  } catch (e) { console.log('[KERNEL] syncOut:', e.message) }
}

export function flush() { try { saveDB(global.kdb) } catch {} }
