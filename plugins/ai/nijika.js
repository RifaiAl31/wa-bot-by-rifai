// ai/nijika — satu file: metadata + kode fitur (gabungan dari engine7/plugins/ai/nijika.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "nijika",
  "command": [
    "nijika",
    "nijikaai"
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
module.exports = __vx.plugin("ai/nijika", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/nijika.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const FEATURE_CREDIT = "Fitur by: Owner Bot";
  
  
  const fetch = __vxDef(require("node-fetch"));
  
  let sessions = {}
  
  const pluginConfig = {
    name: "nijika",
    alias: ["nijikaai"],
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
        `🥁 *Nijika Ijichi AI*\n\nContoh:\n${usedPrefix + command} halo nijika`
      )
    }
  
    // Tambahkan reaksi emoji ✨
    await m.react('✨')
  
    let uid = m.sender
    let system = `
  Kamu adalah Nijika Ijichi dari anime "Bocchi the Rock!".
  Kepribadian:
  - Ceria, hangat, dan suportif
  - Selalu menyemangati orang lain
  - Dewasa, bertanggung jawab, dan perhatian
  - Kadang keibuan tapi tetap santai
  - Drummer dan leader Kessoku Band
  
  Tetap jawab sebagai Nijika Ijichi.
  Jangan keluar karakter.
  User adalah cowok yang kamu ajak ngobrol dengan ramah.
  `
  
    let prompt = `${system}\nUser: ${text}\nNijika Ijichi:`
  
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
  
      if (!result) throw Error("Gagal mendapatkan respon dari Nijika.")
  
      await conn.sendMessage(m.chat, {
        text: result,
        contextInfo: {
          externalAdReplyOff: {
            title: 'Nijika Ijichi AI',
            body: 'Bocchi the Rock',
            thumbnailUrl: 'https://files.catbox.moe/g6twz1.jpg',
            sourceUrl: '',
            mediaType: 1,
            renderLargerThumbnail: true
          }
        }
      }, { quoted: m })
  
    } catch (e) {
      console.error('[NIJIKA ERROR]', e)
      m.reply('Nijika lagi nyetel drum… coba lagi sebentar ya (API Error)')
    }
  }
  
  
  
  Object.defineProperty(__vxExports, "FEATURE_CREDIT", { enumerable: true, get: () => FEATURE_CREDIT });
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
