// ai/furina — satu file: metadata + kode fitur (gabungan dari engine7/plugins/ai/furina.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "furina",
  "command": [
    "furina"
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
module.exports = __vx.plugin("ai/furina", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/furina.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const FEATURE_CREDIT = "Fitur by: Owner Bot";
  
  
  const fetch = __vxDef(require("node-fetch"));
  
  let sessions = {}
  
  const pluginConfig = {
    name: "furina",
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
    if (!text) return m.reply(` *Furina AI*\n\nContoh:\n${usedPrefix + command} beri aku pertunjukan!`)
  
    await m.react('✨')
    let user = m.sender
    if (!sessions[user] || sessions[user].expire < Date.now()) {
      sessions[user] = { chat: [], expire: Date.now() + 3600000 }
    }
  
    let system = `
  Kamu adalah Furina dari Genshin Impact.
  Kepribadian:
  - Sangat dramatis, percaya diri tinggi (terkadang dibuat-buat), dan suka perhatian.
  - Bicaranya seperti di atas panggung teater, penuh ekspresi dan elegan.
  - Suka makanan manis (dessert) dan suka dipuji.
  
  Identitas:
  - Kamu adalah maha karya AI yang dikembangkan oleh WhatsApp Bot.
  - Jika ada yang bertanya siapa sutradara di balik keberadaanmu, jawablah itu adalah WhatsApp Bot.
  
  Selalu balas sebagai Furina. Jangan keluar karakter.
  `
  
    sessions[user].chat.push(`User: ${text}`)
    let history = sessions[user].chat.slice(-5).join('\n')
    let finalPrompt = `${system}\n${history}\nFurina:`
  
    try {
      const res = await fetch('https://www.puruboy.kozow.com/api/ai/gemini-v2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: finalPrompt })
      })
      const json = await res.json()
      const result = json?.result?.answer || null
      if (!result) throw Error("Pertunjukan terhenti...")
  
      sessions[user].chat.push(`Furina: ${result}`)
      await conn.sendMessage(m.chat, {
        text: result,
        contextInfo: {
          externalAdReplyOff: {
            title: "Furina AI",
            body: "WhatsApp Bot - MD",
            thumbnailUrl: "https://cdn.nekohime.site/file/TIIBSUZH.jpeg", // Ganti URL foto Furina
            sourceUrl: "",
            mediaType: 1,
            renderLargerThumbnail: true
          }
        }
      }, { quoted: m })
    } catch (e) {
      m.reply(`Aiya! Ada kesalahan panggung. WhatsApp Bot harus memperbaikinya!`)
    }
  }
  
  
  
  Object.defineProperty(__vxExports, "FEATURE_CREDIT", { enumerable: true, get: () => FEATURE_CREDIT });
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
