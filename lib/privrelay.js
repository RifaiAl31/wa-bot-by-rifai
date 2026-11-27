// lib/privrelay.js — kirim pesan private di dalam grup (batch private relay)
// Tiap target menerima pesan aslinya lewat enkripsi sesi pribadinya; anggota lain hanya melihat teks pengganti.
'use strict'
const crypto = require('node:crypto')
const { encodeWAMessage, generateMessageIDV2, encodeSignedDeviceIdentity } = require('@whiskeysockets/baileys')

const ENC_TIMEOUT = 30000
const SESSION_DELAY = 1500
const ASSERT_RETRY = 3
const CHUNK = 500

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const phoneOf = (jid) => String(jid || '').split('@')[0].split(':')[0].replace(/[^0-9]/g, '')
const validJid = (j) => typeof j === 'string' && (j.includes('@s.whatsapp.net') || j.includes('@lid'))

function newId(sock) {
  try {
    const id = sock?.user?.id || sock?.authState?.creds?.me?.id
    if (!id) throw new Error('no id')
    return generateMessageIDV2(id)
  } catch { return crypto.randomBytes(16).toString('hex').toUpperCase() }
}

async function matchParticipant(sock, participants, target) {
  const phones = new Set([phoneOf(target)])
  try { const lid = await sock.signalRepository?.lidMapping?.getLIDForPN(target); if (lid) phones.add(phoneOf(lid)) } catch {}
  try { const pn = await sock.signalRepository?.lidMapping?.getPNForLID(target); if (pn) phones.add(phoneOf(pn)) } catch {}
  phones.delete('')
  return participants.find((p) => [p.id, p.jid, p.phoneNumber].map(phoneOf).some((x) => x && phones.has(x)))
}

async function ensureSessions(sock, jids) {
  for (let i = 0; i < ASSERT_RETRY; i++) {
    const res = await Promise.allSettled(jids.map((j) => sock.assertSessions([j], true)))
    if (!res.some((r) => r.status === 'rejected')) return true
    await sleep(500)
  }
  return false
}

const withTimeout = (p) => Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error('timeout enkripsi')), ENC_TIMEOUT))])

/**
 * @param sock        koneksi Baileys
 * @param groupJid    grup tempat pesan "dititipkan"
 * @param targets     [{ target: jid, message: <proto message> }]
 * @param opts        { msgForOthers | placeholder, mentions, additionalNodes, chunkSize }
 * @returns           array id pesan yang terkirim
 */
async function sendBatchPrivateRelay(sock, groupJid, targets = [], opts = {}) {
  const placeholder = opts.msgForOthers ?? opts.placeholder ?? null
  const { mentions = null, additionalNodes = [], chunkSize = CHUNK } = opts
  if (!String(groupJid).endsWith('@g.us')) throw new Error('JID grup tidak valid')
  const valid = (targets || []).filter((t) => t?.target && t?.message)
  if (!valid.length) throw new Error('tidak ada target valid')

  const meta = await sock.groupMetadata(groupJid)
  const participants = meta.participants || []
  if (!participants.length) throw new Error('grup tidak punya member')
  const selfId = sock?.authState?.creds?.me?.lid || sock?.user?.id
  if (!selfId) throw new Error('tidak bisa mendapat id sendiri')
  const lidGroup = (meta.addressingMode || 'lid') === 'lid'

  const resolved = []
  for (const t of valid) {
    const p = await matchParticipant(sock, participants, t.target)
    if (p) resolved.push({ jid: p.id, message: t.message })
    else if (validJid(t.target)) resolved.push({ jid: t.target, message: t.message })
  }
  if (!resolved.length) throw new Error('tidak ada target yang cocok')

  const ids = []
  for (let i = 0; i < resolved.length; i += chunkSize) {
    const chunk = resolved.slice(i, i + chunkSize)
    await ensureSessions(sock, chunk.map((c) => c.jid))
    await sleep(SESSION_DELAY)

    // teks pengganti yang dilihat anggota lain (dienkripsi dengan sender key grup)
    let skmsg = null
    try {
      const payload = placeholder
        ? { extendedTextMessage: { text: placeholder, contextInfo: mentions?.length ? { mentionedJid: mentions } : {} } }
        : { protocolMessage: { type: 0 } }
      skmsg = (await sock.signalRepository.encryptGroupMessage({ group: groupJid, data: encodeWAMessage(payload), meId: selfId })).ciphertext
    } catch (e) { console.log('[privrelay] enkripsi grup gagal:', e.message) }

    let needIdentity = false
    const nodes = (await Promise.all(chunk.map(async ({ jid, message }) => {
      try {
        const { type, ciphertext } = await withTimeout(sock.signalRepository.encryptMessage({ jid, data: encodeWAMessage(message) }))
        if (type === 'pkmsg') needIdentity = true
        return { tag: 'to', attrs: { jid }, content: [{ tag: 'enc', attrs: { v: '2', type }, content: ciphertext }] }
      } catch { return null }
    }))).filter(Boolean)
    if (!skmsg && !nodes.length) continue

    const content = []
    if (skmsg) content.push({ tag: 'enc', attrs: { v: '2', type: 'skmsg' }, content: skmsg })
    if (nodes.length) content.push({ tag: 'participants', attrs: {}, content: nodes })
    if (needIdentity && sock?.authState?.creds?.account) content.push({ tag: 'device-identity', attrs: {}, content: encodeSignedDeviceIdentity(sock.authState.creds.account, true) })
    if (additionalNodes.length) content.push(...additionalNodes)

    const id = newId(sock)
    await sock.query({ tag: 'message', attrs: { id, to: groupJid, type: 'text', ...(lidGroup ? { addressing_mode: 'lid' } : {}) }, content })
    ids.push(id)
    if (i + chunkSize < resolved.length) await sleep(500)
  }
  if (!ids.length) throw new Error('gagal mengirim semua batch')
  return ids
}

// satu pesan yang sama untuk beberapa target
function sendBatchPrivateRelayUnified(sock, groupJid, jids = [], message, opts = {}) {
  return sendBatchPrivateRelay(sock, groupJid, (jids || []).map((target) => ({ target, message })), opts)
}

module.exports = { sendBatchPrivateRelay, sendBatchPrivateRelayUnified }
