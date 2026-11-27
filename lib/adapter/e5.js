// lib/vanxone.js — adapter plugin gaya "WhatsApp Bot" (ESM: `const handler = async (m, { sock, ... }) => {}; handler.command = [...]; export default handler`)
// untuk bot WhatsApp Bot (CJS). Kode plugin asli TIDAK diubah: tersimpan utuh di engine/plugins/<kategori>/<nama>.js
// dan dimuat lewat import() saat dipakai. Objek m + parameter ke-2 dibangun oleh lib/vanxone.js (S.wrap) yang sudah dipakai
// fitur WhatsApp Bot hasil porting sebelumnya; di sini ditambah: pemuat ESM, admin/private, global tambahan, sock tambahan.
'use strict'

const path = require('path')
const { pathToFileURL } = require('url')
const S = require("./core.js")
const config = require("../../config.js")

const reg = require('./modreg.js')

// ---------------------------------------------------------------- muat modul ESM (di-cache, gagal tidak di-cache)
const cache = new Map()
function loadModule(file) {
  if (!cache.has(file)) {
    const p = Promise.resolve().then(() => require(file))
    p.catch(() => cache.delete(file))
    cache.set(file, p)
  }
  return cache.get(file)
}
const loadPlugin = (rel) => reg.get('engine5', rel)

// ---------------------------------------------------------------- global tambahan yang dipakai plugin WhatsApp Bot
let globalsDone = false
function initZT() {
  if (globalsDone) return
  globalsDone = true
  S.initGlobals()
  global.APIs = Object.assign({ faa: 'https://api-faa.my.id', deline: 'https://api.deline.web.id', kyzz: 'https://api.kyzzz.xyz', azbry: 'https://api.azbry.com', siputzx: 'https://brat.siputzx.my.id' }, global.APIs || {})
  global.APIKeys = global.APIKeys || {}
  global.mess = global.mess || {
    owner: config.mess.only.owner, mainOwner: 'Fitur ini khusus owner utama bot!', admin: config.mess.only.admin, botAdmin: config.mess.only.badmin,
    group: config.mess.only.group, private: 'Gunakan di chat pribadi bot!'
  }
  require("../thumb.js").install()
  if (global.thumbnail === undefined) global.thumbnail = ''
  if (!global.fotoreply) global.fotoreply = global.thumbnail
  global.versi = global.versi || require("../../package.json").version
  global.typeSc = global.typeSc || 'plugins'
  global.library = global.library || 'Baileys'
  global.data = global.data || 'LocalJSON'
  global.rtBot = global.rtBot || 'NodeJS'
  global.ghTokens = global.ghTokens || ''
  global.userGh = global.userGh || ''
  global.tgToken = global.tgToken || ''
  // quote palsu ala qpix (kartu kontak sederhana)
  global.qpix = global.qpix || { key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' }, message: { contactMessage: { displayName: global.namaBot || 'Bot', vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:${global.namaBot || 'Bot'}\nEND:VCARD` } } }
  // helper umum helper-cmd/function.js
  const g = global
  g.sleep = g.sleep || ((ms) => new Promise((r) => setTimeout(r, ms)))
  g.capital = g.capital || ((s) => String(s).charAt(0).toUpperCase() + String(s).slice(1))
  g.getRandom = g.getRandom || ((ext) => `${Math.floor(Math.random() * 10000)}${ext || ''}`)
  g.bytesToSize = g.bytesToSize || ((b, d = 2) => { if (!b) return '0 Bytes'; const k = 1024, u = ['Bytes', 'KB', 'MB', 'GB', 'TB'], i = Math.floor(Math.log(b) / Math.log(k)); return `${parseFloat((b / k ** i).toFixed(d))} ${u[i]}` })
  g.formatp = g.formatp || g.bytesToSize
  g.toRupiah = g.toRupiah || ((x) => `Rp${Number(x).toLocaleString('id-ID')}`)
  g.runtime = g.runtime || ((s) => { s = Number(s); const d = Math.floor(s / 86400), h = Math.floor((s % 86400) / 3600), m = Math.floor((s % 3600) / 60), x = Math.floor(s % 60); return `${d}d ${h}h ${m}m ${x}s` })
  g.ucapan = g.ucapan || (() => { const h = new Date(Date.now() + 7 * 3600e3).getUTCHours(); return h < 11 ? 'Selamat pagi' : h < 15 ? 'Selamat siang' : h < 18 ? 'Selamat sore' : 'Selamat malam' })
  g.fetchJson = g.fetchJson || (async (url, opt) => (await require('axios').get(url, { timeout: 60000, ...(opt || {}) })).data)
  g.font = g.font || ((t) => String(t).toLowerCase().split('').map((c) => ({ a: 'ᴀ', b: 'ʙ', c: 'ᴄ', d: 'ᴅ', e: 'ᴇ', f: 'ꜰ', g: 'ɢ', h: 'ʜ', i: 'ɪ', j: 'ᴊ', k: 'ᴋ', l: 'ʟ', m: 'ᴍ', n: 'ɴ', o: 'ᴏ', p: 'ᴘ', q: 'ǫ', r: 'ʀ', s: 'ꜱ', t: 'ᴛ', u: 'ᴜ', v: 'ᴠ', w: 'ᴡ', y: 'ʏ', z: 'ᴢ' }[c] || c)).join(''))
}

// ---------------------------------------------------------------- tambahan pada sock
function extend(sock) {
  S.extendSock(sock)
  initZT()
  if (sock.__zt) return sock
  sock.__zt = true
  global.mainSock = sock
  if (!sock.downloadMediaMessage) sock.downloadMediaMessage = async (q) => { const x = (q && (q.fakeObj || q.download)) ? q : null; if (x && x.download) return x.download(); return require('@whiskeysockets/baileys').downloadMediaMessage(q, 'buffer', {}) }
  if (!sock.saveMessageToStore) sock.saveMessageToStore = () => {}
  if (!sock.getCachedGroupMetadata) sock.getCachedGroupMetadata = (jid) => sock.groupMetadata(jid)
  if (!sock.normJid) sock.normJid = (j) => String(j || '').split('@')[0].split(':')[0]
  if (!sock.sendPoll) {
    sock.sendPoll = (jid, c = {}, o = {}) => sock.sendMessage(jid, { poll: { name: c.name || c.text || 'Poll', values: (c.values || c.options || []).map((v) => (typeof v === 'string' ? v : v.title || v.name || String(v))), selectableCount: c.selectableCount || 1 } }, o.quoted ? { quoted: o.quoted } : undefined)
  }
  if (!sock.sendLinkPreview) {
    sock.sendLinkPreview = (jid, c = {}, o = {}) => sock.sendMessage(jid, { text: c.text || c.body || '', contextInfo: { externalAdReply: { title: c.title || global.namaBot, body: c.description || c.body || '', sourceUrl: c.url || c.link || global.saluran || '', mediaType: 1, renderLargerThumbnail: !!c.largeThumbnail, ...(Buffer.isBuffer(c.thumbnail) ? { thumbnail: c.thumbnail } : /^https?:/i.test(String(c.thumbnail || c.image || '')) ? { thumbnailUrl: c.thumbnail || c.image } : {}) } } }, o.quoted ? { quoted: o.quoted } : undefined)
  }
  return sock
}

// ---------------------------------------------------------------- pembungkus plugin
// meta: { name, command[], category, desc, usage, tags[], help[], limit, owner, mainOwner, group, admin, botAdmin, private }
function plugin(rel, meta, thunk) {
  reg.register('engine5', rel, thunk)
  const h = async (m, params) => {
    let mod
    try {
      mod = await loadPlugin(rel)
    } catch (err) {
      console.log(`[WhatsApp Bot] gagal memuat ${rel}:`, err.message)
      const pkg = /Cannot find (?:package|module) '([^']+)'/.exec(err.message)
      return params.reply(pkg ? `Dependensi *${pkg[1]}* belum terpasang. Owner: jalankan \`npm install\` lalu restart bot.` : `Fitur gagal dimuat: ${err.message}`)
    }
    const fn = mod.default || mod.handler
    if (typeof fn !== 'function') return params.reply('Fitur ini tidak punya handler.')
    try {
      await fn(m, params)
    } catch (err) {
      console.log(`[WhatsApp Bot:${meta.name}]`, err)
      await params.reply('❌ Terjadi kesalahan saat menjalankan fitur ini. Coba lagi nanti.').catch(() => {})
    }
  }
  Object.assign(h, { command: meta.command, tags: meta.tags || [], help: meta.help || [], limit: meta.limit, owner: meta.owner, mainOwner: meta.mainOwner, group: meta.group })
  const base = S.wrap(h, { name: meta.name, category: meta.category, desc: meta.desc, usage: meta.usage, mainOnly: !!meta.mainOwner })
  base.admin = !!meta.admin
  base.botAdmin = !!meta.botAdmin
  const run = base.run
  base.run = async (ctx) => {
    extend(ctx.sock)
    if (meta.group && !ctx.isGroup) return ctx.sock.sendMessage(ctx.from, { text: global.mess.group }, { quoted: ctx.msg })
    if (meta.admin && ctx.isGroup && !ctx.isAdmin && !ctx.isOwner) return ctx.sock.sendMessage(ctx.from, { text: global.mess.admin }, { quoted: ctx.msg })
    if (meta.botAdmin && ctx.isGroup && !ctx.isBotAdmin) return ctx.sock.sendMessage(ctx.from, { text: global.mess.botAdmin }, { quoted: ctx.msg })
    if (meta.private && ctx.isGroup) return ctx.sock.sendMessage(ctx.from, { text: global.mess.private }, { quoted: ctx.msg })
    return run(ctx)
  }
  return base
}

const tag = require("./rank.js")
module.exports = { plugin: tag(2, plugin), extend, initZT, loadPlugin }
