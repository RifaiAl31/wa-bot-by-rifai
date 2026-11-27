// image/fakekartupelajar — dirender LOKAL lewat lib/fakecards.js (tanpa API/template luar)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "fakekartupelajar",
  "command": [
    "fakekartupelajar",
    "kartupelajarfake",
    "fakestudentid",
    "fakekps"
  ],
  "category": "image",
  "desc": "Kartu pelajar FIKTIF (contoh hiburan)",
  "usage": ".fakekartupelajar <nama> | <sekolah> (foto opsional)",
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
module.exports = __vx.plugin("canvas/fakekartupelajar", __meta, async function () {
  const fc = require("../../lib/fakecards.js")
  const __vxExports = {}
  const pluginConfig = { name: "fakekartupelajar", alias: ["kartupelajarfake", "fakestudentid", "fakekps"], category: "canvas", description: "Kartu pelajar FIKTIF (contoh hiburan)", usage: ".fakekartupelajar <nama> | <sekolah> (foto opsional)", example: ".fakekartupelajar <nama> | <sekolah> (foto opsional)", isOwner: false, isPremium: false, isGroup: false, isPrivate: false, cooldown: 5, energi: 1, isEnabled: true }

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
    if (!t) return m.reply(`Cara pakai: ${m.prefix}${m.command} <nama> | <sekolah>\nContoh: ${m.prefix}${m.command} Restu | SMPN 1`)
    const [nama, sekolah] = t.split('|').map(s=>s.trim())
    const photo = await getPhoto(m)
    await sock.sendMessage(m.chat, { image: await fc.studentCard({ nama: nama || 'NAMA', sekolah: sekolah || 'SEKOLAH CONTOH', photo }), caption: '🎓 Kartu pelajar FIKTIF (contoh hiburan)' }, { quoted: m })
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
