// fun/gachfemboy — satu file: metadata + kode fitur (gabungan dari engine7/plugins/fun/gachfemboy.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "gachafemboy",
  "command": [
    "gachafemboy"
  ],
  "category": "fun",
  "desc": "Gacha femboy anime random",
  "usage": ".gachafemboy",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 3,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/fun").split('\\').join('/')
module.exports = __vx.plugin("fun/gachfemboy", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/gachfemboy.js'
  const __vxExports = {};
  const pluginConfig = {
      name: "gachafemboy",
      category: "fun",
      description: "Gacha femboy anime random",
      usage: ".gachafemboy",
      cooldown: 3,
      isEnabled: true
  }
  
  const femboyList = [
  
  "Astolfo",
  "Felix Argyle",
  "Hideri Kanzaki",
  "Ruka Urushibara",
  "Gasper Vladi",
  "Saika Totsuka",
  "Nagisa Shiota",
  "Chihiro Fujisaki",
  "Ritsu Sohma",
  "Kurapika",
  "Haku",
  "WhatsApp Bot Tempest",
  "Hideyoshi Kinoshita",
  "Tetra",
  "Juuzou Suzuya",
  "Armin Arlert",
  "Kalluto Zoldyck",
  "Alluka Zoldyck",
  "Gowther",
  "Mare Bello Fiore",
  "Bridget",
  "Venti",
  "Lyney",
  "Xingqiu",
  "Shun Kaidou",
  "Kazuto Kirigaya (GGO Avatar)",
  "Chihiro Fujisaki",
  "Hideyoshi",
  "Saika Totsuka",
  "Felix Argyle",
  "Astolfo Rider",
  "Gasper Vladi",
  "Haku (Naruto)",
  "Nagisa Shiota",
  "WhatsApp Bot Human Form"
  
  ]
  
  async function handler(m){
  
  const name = m.pushName || "Darling"
  const femboy = femboyList[Math.floor(Math.random()*femboyList.length)]
  const love = Math.floor(Math.random()*101)
  
  const statusList = [
  "💖 Terpesona",
  "💘 Bikin Bingung Gender",
  "💕 Imut Banget",
  "💞 Terlalu Cantik",
  "🔥 Femboy Idaman",
  "😳 Kamu Tertipu"
  ]
  
  const status = statusList[Math.floor(Math.random()*statusList.length)]
  
  const responses = [
  
  `╔═══『 🌸 *GACHA FEMBOY* 』═══╗
  ┃
  ┃ 👤 Player : *${name}*
  ┃ 🎀 Femboy : *${femboy}*
  ┃
  ┃ 💖 Love Meter : *${love}%*
  ┃ 📊 Status : *${status}*
  ┃
  ┃ Selamat kamu dapat
  ┃ femboy anime 😳
  ┃
  ╚════════════════════╝`,
  
  `┏━━━〔 🎀 *FEMBOY FOUND* 〕━━━┓
  ┃
  ┃ 👤 *${name}*
  ┃ 💕 *${femboy}*
  ┃
  ┃ 💘 Kecocokan : *${love}%*
  ┃ 📊 Status : *${status}*
  ┃
  ┃ Cantik... eh cowok 🗿
  ┃
  ┗━━━━━━━━━━━━━━━━━━┛`,
  
  `╭────〔 🌸 *TRAP DETECTED* 〕────╮
  │
  │ 👤 Player : *${name}*
  │ 🎀 Character : *${femboy}*
  │
  │ 💓 Love Level : *${love}%*
  │ 📊 Status : *${status}*
  │
  │ Hati-hati...
  │ bisa bikin bingung 😏
  │
  ╰──────────────────────╯`,
  
  `╔═══〔 🤨 *WARNING* 〕═══╗
  ║
  ║ 👤 Player : *${name}*
  ║ 🎀 Character : *${femboy}*
  ║
  ║ 💖 Love : *${love}%*
  ║
  ║ 🤨 Kamu gak belok
  ║ nanti nya kan?
  ║
  ║ 🗿 Semoga masih
  ║ lurus ya bro...
  ║
  ╚════════════════════╝`
  
  ]
  
  const reply = responses[Math.floor(Math.random()*responses.length)]
  
  await m.reply(reply)
  
  }
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
