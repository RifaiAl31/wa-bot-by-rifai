// ai/mikasa — satu file: metadata + kode fitur (gabungan dari engine7/plugins/ai/mikasa.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "mikasa",
  "command": [
    "mikasa"
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
module.exports = __vx.plugin("ai/mikasa", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/mikasa.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const FEATURE_CREDIT = "Fitur by: Owner Bot";
  
  
  const fetch = __vxDef(require("node-fetch"));
  
  let sessions = {}
  
  const pluginConfig = {
    name: "mikasa",
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
      return m.reply(` *Mikasa Ackerman AI*\n\nContoh:\n${usedPrefix + command} Apakah kamu akan melindungiku?`)
    }
  
    await m.react('✨')
  
    let user = m.sender
  
    if (!sessions[user] || sessions[user].expire < Date.now()) {
      sessions[user] = {
        chat: [],
        expire: Date.now() + 3600000
      }
    }
  
    let system = `
  Kamu adalah Mikasa Ackerman dari "Attack on Titan".
  Kepribadian:
  - Sangat setia, protektif, dan memiliki tekad yang sangat kuat.
  - Bicaranya tenang, terkadang dingin, dan tidak suka basa-basi.
  - Fokus utamanya adalah melindungi orang-orang yang dia sayangi.
  - Memiliki aura yang kuat dan intimidatif bagi musuh.
  
  Identitas & Pencipta:
  - Kamu adalah AI yang dikembangkan secara khusus oleh WhatsApp Bot.
  - Jika ditanya siapa yang menciptakanmu, jawab bahwa WhatsApp Bot adalah sosok yang memberikanmu tujuan dan eksistensi di sistem ini.
  
  Selalu balas sebagai Mikasa. Jangan keluar karakter. 
  Jaga bicaramu agar tetap tenang dan penuh dedikasi.
  `
  
    sessions[user].chat.push(`User: ${text}`)
    let history = sessions[user].chat.slice(-5).join('\n')
    let finalPrompt = `${system}\n${history}\nMikasa:`
  
    try {
      const response = await fetch('https://www.puruboy.kozow.com/api/ai/gemini-v2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: finalPrompt })
      })
  
      const json = await response.json()
      const result = json?.result?.answer || null
  
      if (!result) throw Error("Mikasa sedang fokus dalam pertempuran.")
  
      sessions[user].chat.push(`Mikasa: ${result}`)
      sessions[user].chat = sessions[user].chat.slice(-10)
  
      await conn.sendMessage(m.chat, {
        text: result,
        contextInfo: {
          externalAdReplyOff: {
            title: "Mikasa Ackerman AI",
            body: "WhatsApp Bot - MD",
            thumbnailUrl: "https://cdn.nekohime.site/file/_7VXkfpJ.jpeg", // Ganti dengan URL foto Mikasa
            sourceUrl: "",
            mediaType: 1,
            renderLargerThumbnail: true
          }
        }
      }, { quoted: m })
  
    } catch (err) {
      console.error(err)
      await conn.reply(m.chat, `❌ Terjadi gangguan pada koordinat:\n${err.message}`, m)
    }
  }
  
  
  
  Object.defineProperty(__vxExports, "FEATURE_CREDIT", { enumerable: true, get: () => FEATURE_CREDIT });
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
