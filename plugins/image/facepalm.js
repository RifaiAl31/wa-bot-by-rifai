// image/facepalm — dirender LOKAL lewat lib/fakecards.js (tanpa API/template luar)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "facepalm",
  "command": [
    "facepalm"
  ],
  "category": "image",
  "desc": "Bikin gambar facepalm dari fotomu",
  "usage": ".facepalm (kirim/reply foto)",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 2,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/canvas").split('\\').join('/')
module.exports = __vx.plugin("canvas/facepalm", __meta, async function () {
  const fc = require("../../lib/fakecards.js")
  const __vxExports = {}
  const pluginConfig = { name: "facepalm", alias: [], category: "canvas", description: "Bikin gambar facepalm dari fotomu", usage: ".facepalm (kirim/reply foto)", example: ".facepalm (kirim/reply foto)", isOwner: false, isPremium: false, isGroup: false, isPrivate: false, cooldown: 5, energi: 2, isEnabled: true }

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

    const photo = await getPhoto(m)
    if (!photo) return m.reply(`⚠️ Kirim atau reply foto dengan ${m.prefix}${m.command}`)
    await sock.sendMessage(m.chat, { image: await fc.facepalm(photo), caption: '🤦 Facepalm' }, { quoted: m })
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
