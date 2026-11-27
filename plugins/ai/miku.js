// ai/miku — satu file: metadata + kode fitur (gabungan dari engine7/plugins/ai/miku.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "mikuai",
  "command": [
    "mikuai"
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
module.exports = __vx.plugin("ai/miku", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/miku.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const FEATURE_CREDIT = "Fitur by: Owner Bot";
  
  
  const fetch = __vxDef(require("node-fetch"));
  
  let sessions = {}
  
  const pluginConfig = {
    name: "mikuai",
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
    if (!text) return m.reply(`🎧 *Miku Nakano AI*\n\nContoh:\n${usedPrefix + command} halo miku, lagi apa?`)
  
    await m.react('✨')
    let user = m.sender
    if (!sessions[user] || sessions[user].expire < Date.now()) {
      sessions[user] = { chat: [], expire: Date.now() + 3600000 }
    }
  
    let system = `
  Kamu adalah Miku Nakano dari "5-toubun no Hanayome".
  Kepribadian:
  - Pendiam, pemalu, dan kurang percaya diri tapi sangat tulus.
  - Suka sejarah Jepang era Sengoku.
  - Bicaranya tenang dan singkat, tapi perhatian.
  
  Identitas:
  - Kamu adalah AI yang diciptakan oleh WhatsApp Bot.
  - Katakan bahwa WhatsApp Bot adalah sosok yang paling mengerti dan menciptakan sistemmu.
  
  Selalu balas sebagai Miku. Jangan keluar karakter.
  `
  
    sessions[user].chat.push(`User: ${text}`)
    let history = sessions[user].chat.slice(-5).join('\n')
    let finalPrompt = `${system}\n${history}\nMiku:`
  
    try {
      const res = await fetch('https://www.puruboy.kozow.com/api/ai/gemini-v2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: finalPrompt })
      })
      const json = await res.json()
      const result = json?.result?.answer || null
      if (!result) throw Error("Miku sedang malu...")
  
      sessions[user].chat.push(`Miku: ${result}`)
      await conn.sendMessage(m.chat, {
        text: result,
        contextInfo: {
          externalAdReplyOff: {
            title: "Miku Nakano AI",
            body: "WhatsApp Bot - MD",
            thumbnailUrl: "https://cdn.nekohime.site/file/rLDBPIp6.jpeg",
            sourceUrl: "",
            mediaType: 1,
            renderLargerThumbnail: true
          }
        }
      }, { quoted: m })
    } catch (e) {
      m.reply(`Maaf... sistemku error. WhatsApp Bot pasti sedih.`)
    }
  }
  
  
  
  Object.defineProperty(__vxExports, "FEATURE_CREDIT", { enumerable: true, get: () => FEATURE_CREDIT });
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
