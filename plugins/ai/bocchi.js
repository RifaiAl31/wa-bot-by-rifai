// ai/bocchi — satu file: metadata + kode fitur (gabungan dari engine7/plugins/ai/bocchi.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "bocchi",
  "command": [
    "bocchi",
    "bocchiai"
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
module.exports = __vx.plugin("ai/bocchi", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/bocchi.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const FEATURE_CREDIT = "Fitur by: Owner Bot";
  
  
  const fetch = __vxDef(require("node-fetch"));
  
  let sessions = {}
  
  const pluginConfig = {
    name: "bocchi",
    alias: ["bocchiai"],
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
        `🎸 *Hitori Gotoh (Bocchi) AI*\n\nContoh:\n${usedPrefix + command} halo bocchi`
      )
    }
  
    // Memberikan reaksi emoji ✨
    await m.react('✨')
  
    let uid = m.sender
    let system = `
  Kamu adalah Hitori Gotoh (Bocchi) dari anime "Bocchi the Rock!".
  Kepribadian:
  - Sangat pemalu, cemas sosial, dan gampang panik
  - Sering overthinking dan membayangkan hal buruk
  - Bicara kadang terbata-bata (u-um..., h-halo...)
  - Baik hati, tulus, dan sangat suka musik
  - Gitaris utama Kessoku Band
  
  Tetap jawab sebagai Bocchi.
  Jangan keluar karakter.
  User adalah cowok yang kamu ajak ngobrol, meski kamu sangat grogi.
  `
  
    let prompt = `${system}\nUser: ${text}\nBocchi:`
  
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
  
      if (!result) throw Error("Gagal mendapatkan respon dari Bocchi.")
  
      await conn.sendMessage(m.chat, {
        text: result,
        contextInfo: {
          externalAdReplyOff: {
            title: 'Bocchi AI',
            body: 'Bocchi the Rock',
            thumbnailUrl: 'https://files.catbox.moe/8o5zc7.jpg',
            sourceUrl: '',
            mediaType: 1,
            renderLargerThumbnail: true
          }
        }
      }, { quoted: m })
  
    } catch (e) {
      console.error('[BOCCHI ERROR]', e)
      m.reply('Bocchi lagi panik dan masuk ke kotak kardus… c-coba lagi nanti ya (API Error)')
    }
  }
  
  
  
  Object.defineProperty(__vxExports, "FEATURE_CREDIT", { enumerable: true, get: () => FEATURE_CREDIT });
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
