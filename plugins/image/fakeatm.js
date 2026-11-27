// image/fakeatm — dirender LOKAL lewat lib/fakecards.js (tanpa API/template luar)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "fakeatm",
  "command": [
    "fakeatm",
    "atmfake",
    "kartuatm",
    "fakecardatm"
  ],
  "category": "image",
  "desc": "Kartu ATM FIKTIF \"VanBank\" (contoh hiburan)",
  "usage": ".fakeatm <nama> | <catatan>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/canvas").split('\\').join('/')
module.exports = __vx.plugin("canvas/fakeatm", __meta, async function () {
  const fc = require("../../lib/fakecards.js")
  const __vxExports = {}
  const pluginConfig = { name: "fakeatm", alias: ["atmfake", "kartuatm", "fakecardatm"], category: "canvas", description: "Kartu ATM FIKTIF \"VanBank\" (contoh hiburan)", usage: ".fakeatm <nama> | <catatan>", example: ".fakeatm <nama> | <catatan>", isOwner: false, isPremium: false, isGroup: false, isPrivate: false, cooldown: 5, energi: 1, isEnabled: true }

  async function fetchBuf(url) {
    const r = await require("axios").get(url, { responseType: "arraybuffer", timeout: 15000 })
    return Buffer.from(r.data)
  }
  async function getPhoto(m) {
    try {
      if (m.quoted && m.quoted.isImage) return await m.quoted.download()
      if (m.isImage) return await m.download()
    } catch {}
    return null
  }

  async function handler(m, { sock }) {
    try {
      m.react("🕕")

    const t = String(m.text||'').trim()
    if (!t) return m.reply(`Cara pakai: ${m.prefix}${m.command} <nama> | <catatan>\nContoh: ${m.prefix}${m.command} Kepin | gold`)
    const [nama, note] = t.split('|').map(s=>s.trim())
    const buf = await fc.atmCard({ nama: nama || 'NAMA', note })
    await sock.sendMessage(m.chat, { image: buf, caption: '💳 Kartu contoh FIKTIF (merek VanBank, bukan kartu bank asli)' }, { quoted: m })
      m.react("✅")
    } catch (err) {
      globalThis.__vanxoneCatch?.(err)
      m.react("☢")
      m.reply(`❌ Gagal membuat gambar: ${String(err && err.message || err).slice(0, 150)}`)
    }
  }

  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig })
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler })
  return __vxExports
})
