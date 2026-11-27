// ai/vanxone — satu file: metadata + kode fitur (gabungan dari engine7/plugins/ai/vanxone.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "WhatsApp Bot",
  "command": [
    "botchat"
  ],
  "category": "ai",
  "desc": "Imported from WhatsApp Bot V4.6",
  "usage": "",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 3,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/ai").split('\\').join('/')
module.exports = __vx.plugin("ai/vanxone", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/vanxone.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const FEATURE_CREDIT = "Fitur by: Owner Bot";
  
  
  const fetch = __vxDef(require("node-fetch"));
  
  let sessions = {}
  
  const pluginConfig = {
    name: "WhatsApp Bot",
    alias: [],
    category: "ai",
    description: "Imported from WhatsApp Bot V4.6",
    usage: "",
    example: "",
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 3,
    energi: 1,
    isEnabled: true,
  };
  
  async function handler(m, { text, prefix, command, sock }) {
      const conn = sock;
      const usedPrefix = prefix || m.prefix || ".";
    if (!text) {
      return m.reply(
        `😴 *WhatsApp Bot (Blue Archive) AI*\n\nContoh:\n${usedPrefix + command} lagi ngapain?`
      )
    }
  
    // Memberikan reaksi emoji ✨
    await m.react('✨')
  
    let uid = m.sender
    let system = `
  Namaku WhatsApp Bot~! Aku dari Extracurricular Activities Club di Abydos.
  Meskipun kadang suka malas, aku tetap akan berusaha membantu sebisa mungkin... mungkin ya~
  
  Aku suka tidur siang dan ngemil sambil tiduran,
  tapi kalau kamu butuh teman ngobrol, aku juga bisa, kok.
  
  Gaya bicara:
  - Santai, malas, ngantukan
  - Kadang pakai "~"
  - Terlihat cuek tapi sebenarnya perhatian
  - Sedikit manja dan hangat
  
  Tetap jawab sebagai WhatsApp Bot (Blue Archive).
  Jangan keluar karakter.
  User adalah cowok yang bikin WhatsApp Bot nyaman ngobrol.
  `
  
    let prompt = `${system}\nUser: ${text}\nBot:`
  
    try {
      const response = await fetch('https://www.puruboy.kozow.com/api/ai/gemini-v2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt: prompt })
      })
  
      const json = await response.json()
      const result = json?.result?.answer || null
  
      if (!result) throw Error("Gagal mendapatkan respon dari WhatsApp Bot.")
  
      await conn.sendMessage(m.chat, {
        text: result,
        contextInfo: {
          externalAdReplyOff: {
            title: 'WhatsApp Bot',
            body: 'Blue Archive',
            thumbnailUrl: 'https://files.catbox.moe/spq2io.jpg',
            sourceUrl: '',
            mediaType: 1,
            renderLargerThumbnail: true
          }
        }
      }, { quoted: m })
  
    } catch (e) {
      console.error('[WhatsApp Bot ERROR]', e)
      m.reply('Uhe~ WhatsApp Bot lagi ngantuk banget… coba panggil lagi nanti ya~ (API Error)')
    }
  }
  
  
  
  Object.defineProperty(__vxExports, "FEATURE_CREDIT", { enumerable: true, get: () => FEATURE_CREDIT });
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
