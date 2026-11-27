// fun/gachatomboy — satu file: metadata + kode fitur (gabungan dari engine7/plugins/fun/gachatomboy.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "gachatomboy",
  "command": [
    "gachatomboy"
  ],
  "category": "fun",
  "desc": "Gacha char anime tomboy random 100+ karakter",
  "usage": ".gachatomboy",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 0,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/fun").split('\\').join('/')
module.exports = __vx.plugin("fun/gachatomboy", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/gachatomboy.js'
  const __vxExports = {};
  const pluginConfig = {
      name: "gachatomboy",
      category: "fun",
      description: "Gacha char anime tomboy random 100+ karakter",
      usage: ".gachatomboy",
      isEnabled: true
  }
  
  // List char tomboy, bisa ditambah sesuka hati
  const tomboyList = [
  "Misaki Ayuzawa","Haruhi Fujioka","Ruka Sarashina","Hikari Hanazono",
  "Ushio","Makoto Kino","Souta","Yuki Nagato","Shikimori","Uzaki Hana",
  "Tsuki Uzaki","Nagatoro","Chika Fujiwara","Ai Hayasaka","Akane Kurokawa",
  "Ruby WhatsApp Bot","Frieren","Akira Asai","Tomoko Kuroki","Menma","Izumi Mom",
  "Yukino Yukinoshita","Rikka Takarada","Chisato Nishikigi","Takina Inoue",
  "Vivy","Shiraori","Anisphia Wynn Palletia","Euphyllia Magenta"
  ]
  
  async function handler(m){
      const name = m.pushName || "Darling"
      const char = tomboyList[Math.floor(Math.random()*tomboyList.length)]
      const love = Math.floor(Math.random()*101)
  
      const statusList = [
          "💖 Cinta Sejati",
          "💘 Pasangan Serasi",
          "💕 Jodoh Anime",
          "💞 Relationship Goals",
          "💓 Bucin Maksimal",
          "💔 Hubungan Toxic 🗿"
      ]
  
      const status = statusList[Math.floor(Math.random()*statusList.length)]
  
      const responses = [
  `╔═══『 💍 *GACHA TOMBOY* 』═══╗
  ┃
  ┃ 👤 Suami : *${name}*
  ┃ 👰 Tomboy : *${char}*
  ┃
  ┃ 💖 Love Meter : *${love}%*
  ┃ 📊 Status : *${status}*
  ┃
  ┃ Omedetou atas pernikahan kalian!
  ┃ Semoga langgeng selamanya ❤️
  ┃
  ╚════════════════════╝`,
  
  `┏━━━〔 👰 *TOMBOY FOUND* 〕━━━┓
  ┃
  ┃ 🎉 Selamat!!
  ┃
  ┃ 👤 *${name}*
  ┃ ❤️ *${char}*
  ┃
  ┃ 💘 Kecocokan : *${love}%*
  ┃ 📊 Status : *${status}*
  ┃
  ┃ Jangan disia-siakan ya 😏
  ┗━━━━━━━━━━━━━━━━━━┛`,
  
  `╭────〔 💞 *MATCHMAKING TOMBOY* 〕────╮
  │
  │ 👤 Player : *${name}*
  │ 💖 Tomboy : *${char}*
  │
  │ 💓 Love Level : *${love}%*
  │ 📊 Status : *${status}*
  │
  │ Sistem telah menjodohkan kalian
  │ secara random 🗿
  │
  ╰────────────────────╯`
      ]
  
      const reply = responses[Math.floor(Math.random()*responses.length)]
      await m.reply(reply)
  }
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
