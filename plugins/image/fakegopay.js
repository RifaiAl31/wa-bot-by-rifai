// image/fakegopay — dirender LOKAL lewat lib/fakecards.js (tanpa API/template luar)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "fakegopay",
  "command": [
    "fakegopay"
  ],
  "category": "image",
  "desc": "Layar dompet FIKTIF \"VanPay Go\" (contoh hiburan)",
  "usage": ".fakegopay <saldo>|<koin>|<terpakai>|<bulan>",
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
module.exports = __vx.plugin("canvas/fakegopay", __meta, async function () {
  const fc = require("../../lib/fakecards.js")
  const __vxExports = {}
  const pluginConfig = { name: "fakegopay", alias: [], category: "canvas", description: "Layar dompet FIKTIF \"VanPay Go\" (contoh hiburan)", usage: ".fakegopay <saldo>|<koin>|<terpakai>|<bulan>", example: ".fakegopay <saldo>|<koin>|<terpakai>|<bulan>", isOwner: false, isPremium: false, isGroup: false, isPrivate: false, cooldown: 5, energi: 2, isEnabled: true }

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

    const p = String(m.text||'').split('|').map(s=>s.trim())
    if (p.length < 4 || p.some(x=>!x)) return m.reply(`Format: ${m.prefix}${m.command} saldo|koin|terpakai|bulan\nContoh: ${m.prefix}${m.command} 100000|500|20000|Januari`)
    const buf = await fc.walletScreen({ saldo: p[0], title: 'VanPay Go', rows: [['Koin', p[1]], ['Terpakai', 'Rp ' + fc.idr(p[2])], ['Bulan', p[3]]] })
    await sock.sendMessage(m.chat, { image: buf, caption: '💚 Layar contoh FIKTIF (VanPay Go, bukan bukti saldo)' }, { quoted: m })
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
