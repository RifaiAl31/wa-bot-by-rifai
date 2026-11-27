// lib/adapter/e9.js — jembatan fitur tambahan (runtime ESM di lib/kernel) ke sistem plugin WhatsApp Bot.
// plugin(rel, meta) membuat plugin WhatsApp Bot biasa; eksekusinya dilempar ke lib/kernel/bridge.js.
'use strict'
const path = require('path')
const { pathToFileURL } = require('url')

let mod = null
let loading = null
function setup() {
  if (global.__vxKernelReady) return
  global.__vxKernelReady = true
  global.__vxOwners = () => { try { return require('../owners.js').all() } catch { return [] } }
  global.__vxGetUser = (id) => { try { return require('../db.js').getUser(id) } catch { return null } }
  global.__vxSaveUsers = () => { try { require('../db.js').save() } catch {} }
}
function load() {
  if (!loading) {
    setup()
    loading = import(pathToFileURL(path.join(__dirname, '..', 'kernel', 'bridge.js')).href)
      .then((m) => { mod = m; return m })
      .catch((e) => { loading = null; throw e })
  }
  return loading
}

function plugin(rel, meta) {
  const base = rel.split('/').pop()
  return Object.assign({
    name: base,
    __ported: 9,
    override: true,
    kernel: true,
    async run(ctx) {
      if (meta.private && ctx.isGroup) return ctx.reply((global.mess && global.mess.private) || 'Fitur ini hanya untuk chat pribadi.')
      const m = await load()
      await m.runCommand(ctx.sock, ctx.msg, {
        rel, command: ctx.command, text: ctx.text, prefix: ctx.prefix, body: ctx.body,
        isOwner: ctx.isOwner, isAdmin: ctx.isAdmin
      })
    }
  }, meta)
}

// dipanggil hook pasif: pesan biasa (game menunggu jawaban, afk, auto-download, dll)
async function passive(ctx) {
  const m = await load()
  await m.runPassive(ctx.sock, ctx.msg, { prefix: ctx.prefix, body: ctx.body, isOwner: ctx.isOwner, isAdmin: false })
}

// ---- media sekali-lihat: disimpan saat pesan masuk (dipanggil dari bot.js untuk setiap pesan 'notify') ----
// Pra-filter sinkron dulu: modul kernel yang berat baru dimuat kalau memang ada pesan sekali-lihat.
const VO_WRAP = ['viewOnceMessage', 'viewOnceMessageV2', 'viewOnceMessageV2Extension']
const VO_MEDIA = ['imageMessage', 'videoMessage', 'audioMessage']
function looksViewOnce(message) {
  let c = message
  for (let i = 0; c && typeof c === 'object' && i < 5; i++) {
    if (VO_WRAP.some((k) => c[k])) return true
    if (VO_MEDIA.some((k) => c[k] && c[k].viewOnce)) return true
    c = (c.ephemeralMessage && c.ephemeralMessage.message) || (c.documentWithCaptionMessage && c.documentWithCaptionMessage.message) || (c.editedMessage && c.editedMessage.message) || null
  }
  return false
}
function captureViewOnce(sock, msg) {
  try {
    if (!msg || !msg.message || !msg.key || msg.key.fromMe || msg.key.remoteJid === 'status@broadcast') return
    if (!looksViewOnce(msg.message)) return
    load().then((m) => m.captureVO && m.captureVO(sock, msg)).catch((e) => console.log('[VIEWONCE]', e.message))
  } catch {}
}

module.exports = { plugin, passive, load, captureViewOnce, looksViewOnce }
