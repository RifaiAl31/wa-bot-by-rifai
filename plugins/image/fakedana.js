// image/fakedana — dirender LOKAL lewat lib/fakecards.js (tanpa API/template luar)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "fakedana",
  "command": [
    "fakedana",
    "danafake"
  ],
  "category": "image",
  "desc": "Layar saldo dompet FIKTIF \"VanPay\" (contoh hiburan)",
  "usage": ".fakedana <nominal>",
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
module.exports = __vx.plugin("canvas/fakedana", __meta, async function () {
  const fc = require("../../lib/fakecards.js")
  const __vxExports = {}
  const pluginConfig = { name: "fakedana", alias: ["danafake"], category: "canvas", description: "Layar saldo dompet FIKTIF \"VanPay\" (contoh hiburan)", usage: ".fakedana <nominal>", example: ".fakedana <nominal>", isOwner: false, isPremium: false, isGroup: false, isPrivate: false, cooldown: 5, energi: 1, isEnabled: true }

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

    const n = String(m.text||'').replace(/[^0-9]/g,'')
    if (!n) return m.reply(`Contoh: ${m.prefix}${m.command} 10000`)
    await sock.sendMessage(m.chat, { image: await fc.walletScreen({ saldo: n }), caption: '💙 Layar contoh FIKTIF (VanPay, bukan bukti saldo)' }, { quoted: m })
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
