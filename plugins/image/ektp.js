// image/ektp — dirender LOKAL lewat lib/fakecards.js (tanpa API/template luar)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "ektp",
  "command": [
    "ektp",
    "ktp"
  ],
  "category": "image",
  "desc": "Bikin kartu identitas FIKTIF (contoh hiburan)",
  "usage": ".ektp <nik>|<nama>|<tgl lahir> (kirim/reply foto)",
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
module.exports = __vx.plugin("canvas/ektp", __meta, async function () {
  const fc = require("../../lib/fakecards.js")
  const __vxExports = {}
  const pluginConfig = { name: "ektp", alias: ["ktp"], category: "canvas", description: "Bikin kartu identitas FIKTIF (contoh hiburan)", usage: ".ektp <nik>|<nama>|<tgl lahir> (kirim/reply foto)", example: ".ektp <nik>|<nama>|<tgl lahir> (kirim/reply foto)", isOwner: false, isPremium: false, isGroup: false, isPrivate: false, cooldown: 5, energi: 2, isEnabled: true }

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

    const parts = String(m.text||'').split('|').map(s=>s.trim())
    if (!m.text || parts.length < 2) return m.reply(`⚠️ Format: ${m.prefix}${m.command} nik|nama|tanggal lahir (kirim/reply foto)\nContoh: ${m.prefix}${m.command} 123456789|Budi|10-02-2000`)
    const photo = await getPhoto(m)
    const buf = await fc.idCard({ nik: parts[0] || '0000', nama: parts[1] || 'NAMA', ttl: parts[2] || '01-01-2000', photo })
    await sock.sendMessage(m.chat, { image: buf, caption: '🪪 Kartu identitas FIKTIF (contoh hiburan, bukan dokumen resmi)' }, { quoted: m })
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
