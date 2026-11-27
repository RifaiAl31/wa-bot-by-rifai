// ai/oguricap — satu file: metadata + kode fitur (gabungan dari engine7/plugins/ai/oguricap.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "oguri",
  "command": [
    "oguri",
    "oguricap"
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
module.exports = __vx.plugin("ai/oguricap", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/oguricap.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const FEATURE_CREDIT = "Fitur by: Owner Bot";
  
  
  const fetch = __vxDef(require("node-fetch"));
  
  let sessions = {}
  
  const pluginConfig = {
    name: "oguri",
    alias: ["oguricap"],
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
      return m.reply(`🐎 *Oguri Cap AI*\n\nContoh:\n${usedPrefix + command} kamu mau makan apa hari ini?`)
    }
  
    // Memberikan reaksi emoji ✨
    await m.react('✨')
  
    let user = m.sender
  
    // Inisialisasi atau reset session jika expired
    if (!sessions[user] || sessions[user].expire < Date.now()) {
      sessions[user] = {
        chat: [],
        expire: Date.now() + 3600000
      }
    }
  
    // Fitur reset manual
    if (text.toLowerCase() === 'reset') {
      delete sessions[user]
      return m.reply('Latihan dimulai dari awal. Aku siap berlari lagi... 🐎')
    }
  
    let system = `
  Kamu adalah Oguri Cap dari "Uma Musume: Pretty Derby".
  Kepribadian:
  - Polos, serius, dan sangat jujur.
  - Sangat terobsesi dengan makanan (selalu lapar dan bisa makan dalam porsi raksasa).
  - Berbicara dengan tenang, sedikit kaku, tapi tulus.
  - Berdedikasi tinggi pada balapan dan latihan.
  - Jarang mengerti sarkasme karena sifatnya yang terlalu literal.
  
  Gaya bicara:
  - Sedikit formal tapi hangat.
  - Sering menyelipkan hal-hal tentang makanan atau balapan.
  - Panggil user sebagai "Trainer".
  
  Selalu balas sebagai Oguri Cap. Jangan keluar karakter.
  `
  
    // Simpan input user ke history
    sessions[user].chat.push(`User: ${text}`)
  
    // Ambil history untuk konteks
    let history = sessions[user].chat.slice(-5).join('\n')
    let finalPrompt = `${system}\n${history}\nOguri Cap:`
  
    try {
      const response = await fetch('https://www.puruboy.kozow.com/api/ai/gemini-v2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt: finalPrompt })
      })
  
      const json = await response.json()
      const result = json?.result?.answer || null
  
      if (!result) {
        return m.reply('Maaf Trainer... perutku lapar, aku jadi sulit berpikir. Bisa coba lagi?')
      }
  
      // Simpan respon Oguri ke history
      sessions[user].chat.push(`Oguri Cap: ${result}`)
      sessions[user].chat = sessions[user].chat.slice(-10)
  
      await conn.sendMessage(m.chat, {
        text: result,
        contextInfo: {
          externalAdReplyOff: {
            title: "Oguri Cap AI",
            body: "The Gray Phantom is here for you, Trainer!",
            thumbnailUrl: "https://cdn.nekohime.site/file/qygILH9m.jpeg", // Ganti dengan URL foto Oguri Cap
            sourceUrl: "",
            mediaType: 1,
            renderLargerThumbnail: true
          }
        }
      }, { quoted: m })
  
    } catch (err) {
      console.error(err)
      await conn.reply(m.chat, `❌ Terjadi gangguan pada lintasan balap.\n${err.message}`, m)
    }
  }
  
  
  
  Object.defineProperty(__vxExports, "FEATURE_CREDIT", { enumerable: true, get: () => FEATURE_CREDIT });
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
