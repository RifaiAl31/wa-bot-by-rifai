// image/fake-tweet — dirender LOKAL lewat lib/fakecards.js (tanpa API/template luar)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "fake-tweet",
  "command": [
    "fake-tweet",
    "ftweet",
    "tweetfake"
  ],
  "category": "image",
  "desc": "Buat tweet palsu untuk hiburan",
  "usage": ".fake-tweet | nama | username | teks",
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
module.exports = __vx.plugin("canvas/fake-tweet", __meta, async function () {
  const fc = require("../../lib/fakecards.js")
  const __vxExports = {}
  const pluginConfig = { name: "fake-tweet", alias: ["ftweet", "tweetfake"], category: "canvas", description: "Buat tweet palsu untuk hiburan", usage: ".fake-tweet | nama | username | teks", example: ".fake-tweet | nama | username | teks", isOwner: false, isPremium: false, isGroup: false, isPrivate: false, cooldown: 5, energi: 1, isEnabled: true }

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

    const parts = String(m.text||'').split('|').map(s=>s.trim()).filter((s,i)=>!(i===0&&s===''))
    if (parts.length < 3) return m.reply(`🐦 Format: ${m.prefix}${m.command} | Nama | Username | Teks tweet\n(boleh kirim/reply foto untuk avatar)`)
    let avatar = await getPhoto(m)
    if (!avatar) { try { const u = await sock.profilePictureUrl(m.sender, 'image'); avatar = await fetchBuf(u) } catch {} }
    const buf = await fc.tweet({ name: parts[0], username: parts[1], text: parts.slice(2).join(' | ') , avatar })
    await sock.sendMessage(m.chat, { image: buf, caption: '🐦 Fake tweet (hiburan)' }, { quoted: m })
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
