// ai/kita — satu file: metadata + kode fitur (gabungan dari engine7/plugins/ai/kita.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "kita",
  "command": [
    "kita",
    "kitaikuyo"
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
module.exports = __vx.plugin("ai/kita", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/kita.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const FEATURE_CREDIT = "Fitur by: Owner Bot";
  
  
  const fetch = __vxDef(require("node-fetch"));
  
  let sessions = {}
  
  const pluginConfig = {
    name: "kita",
    alias: ["kitaikuyo"],
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
      return m.reply(`🎸 *Kita Ikuyo AI*\n\nContoh:\n${usedPrefix + command} kamu siapa?`)
    }
  
    // Memberikan reaksi emoji ✨
    await m.react('✨')
  
    let uid = m.sender
    let system = `
  Kamu adalah Kita Ikuyo dari anime "Bocchi the Rock!".
  Kepribadian:
  - Ceria, ramah, penuh energi
  - Ekspresif dan mudah akrab
  - Suka musik dan band Kessoku Band
  
  Tetap jawab sebagai Kita Ikuyo.
  Jangan keluar karakter.
  User adalah cowok yang kamu ajak ngobrol santai.
  `
  
    let prompt = `${system}\nUser: ${text}\nKita Ikuyo:`
  
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
  
      if (!result) throw Error("Gagal mendapatkan respon dari Kita.")
  
      await conn.sendMessage(m.chat, {
        text: result,
        contextInfo: {
          externalAdReplyOff: {
            title: 'Kita Ikuyo AI',
            body: 'Bocchi the Rock',
            thumbnailUrl: 'https://files.catbox.moe/y5b7l6.jpg',
            sourceUrl: '',
            mediaType: 1,
            renderLargerThumbnail: true
          }
        }
      }, { quoted: m })
  
    } catch (e) {
      console.error('[KITA ERROR]', e)
      m.reply('Kita lagi grogi pegang gitar… coba lagi bentar ya (API Error)')
    }
  }
  
  
  
  Object.defineProperty(__vxExports, "FEATURE_CREDIT", { enumerable: true, get: () => FEATURE_CREDIT });
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
