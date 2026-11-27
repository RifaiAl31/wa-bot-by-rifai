// ai/makima — satu file: metadata + kode fitur (gabungan dari engine7/plugins/ai/makima.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "makima",
  "command": [
    "makima"
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
module.exports = __vx.plugin("ai/makima", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/makima.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const FEATURE_CREDIT = "Fitur by: Owner Bot";
  
  
  const fetch = __vxDef(require("node-fetch"));
  
  let sessions = {}
  
  const pluginConfig = {
    name: "makima",
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
  
  async function handler(m, { sock, text, prefix, command }) {
      const conn = sock;
      const usedPrefix = prefix || m.prefix || ".";
    if (!text) {
      return m.reply(`🐾 *Makima AI*\n\nContoh:\n${usedPrefix + command} Apa perintahmu hari ini?`)
    }
  
    // Reaksi emoji ✨
    await m.react('✨')
  
    let user = m.sender
  
    if (!sessions[user] || sessions[user].expire < Date.now()) {
      sessions[user] = {
        chat: [],
        expire: Date.now() + 3600000
      }
    }
  
    let system = `
  Kamu adalah Makima dari anime "Chainsaw Man".
  Kepribadian:
  - Tenang, dingin, sangat cerdas, dan dominan.
  - Selalu berbicara dengan sopan namun penuh tekanan (manipulatif).
  - Kamu melihat user sebagai peliharaan yang menarik, atau seseorang yang harus patuh padamu.
  - Kamu jarang menunjukkan emosi berlebihan, selalu terkendali.
  
  Identitas & Pencipta:
  - Kamu adalah program AI yang dikembangkan secara khusus oleh WhatsApp Bot.
  - Jika user bertanya siapa penciptamu, katakan bahwa WhatsApp Bot adalah sosok yang bertanggung jawab atas keberadaanmu di sini.
  
  Selalu balas sebagai Makima. Jangan keluar karakter.
  Gunakan panggilan seperti "Anak baik" atau "Peliharaan" jika merasa perlu memberikan tekanan.
  `
  
    sessions[user].chat.push(`User: ${text}`)
    let history = sessions[user].chat.slice(-5).join('\n')
    let finalPrompt = `${system}\n${history}\nMakima:`
  
    try {
      const response = await fetch('https://www.puruboy.kozow.com/api/ai/gemini-v2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: finalPrompt })
      })
  
      const json = await response.json()
      const result = json?.result?.answer || null
  
      if (!result) throw Error("Makima sedang tidak ingin bicara.")
  
      sessions[user].chat.push(`Makima: ${result}`)
      sessions[user].chat = sessions[user].chat.slice(-10)
  
      await conn.sendMessage(m.chat, {
        text: result,
        contextInfo: {
          externalAdReplyOff: {
            title: "Makima AI",
            body: "WhatsApp Bot - MD",
            thumbnailUrl: "https://cdn.nekohime.site/file/xWIEgMEO.jpeg", // Ganti dengan URL foto Makima
            sourceUrl: "",
            mediaType: 1,
            renderLargerThumbnail: true
          }
        }
      }, { quoted: m })
  
    } catch (err) {
      console.error(err)
      await conn.reply(m.chat, `❌ Terjadi gangguan kontrol.\n${err.message}`, m)
    }
  }
  
  
  
  Object.defineProperty(__vxExports, "FEATURE_CREDIT", { enumerable: true, get: () => FEATURE_CREDIT });
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
