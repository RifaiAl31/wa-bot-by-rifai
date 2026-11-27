// fun/gachanasip — satu file: metadata + kode fitur (gabungan dari engine7/plugins/fun/gachanasip.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "gachanasip",
  "command": [
    "gachanasip"
  ],
  "category": "fun",
  "desc": "Random nasip / hoki / keberuntungan buat user",
  "usage": ".gachanasip",
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
module.exports = __vx.plugin("fun/gachanasip", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/gachanasip.js'
  const __vxExports = {};
  const pluginConfig = {
      name: "gachanasip",
      category: "fun",
      description: "Random nasip / hoki / keberuntungan buat user",
      usage: ".gachanasip",
      isEnabled: true
  }
  
  // List nasip / hoki / sial lucu
  const nasipList = [
  "Hari ini hoki banget, rezeki nyangkut di jalan 😎",
  "Sedikit sial, hati-hati dengan benda tajam 🗡️",
  "Nasip biasa aja, tapi senyummu manis ❤️",
  "Rejeki datang tak terduga, siap-siap senyum 😏",
  "Hari ini banyak godaan, tapi kamu kuat 💪",
  "Nasip baik, kemungkinan dapat hadiah kecil 🎁",
  "Sedikit sial, jangan lupa bawa payung ☂️",
  "Nasip gokil! Orang jatuh cinta sama kamu hari ini 🥰",
  "Peruntungan naik, tapi jangan sombong ya 😉",
  "Nasip netral, santai aja dan nikmati hari 😎"
  ]
  
  async function handler(m){
      const name = m.pushName || "Darling"
      const nasip = nasipList[Math.floor(Math.random()*nasipList.length)]
  
      const responses = [
  `╭─〔 💖 WhatsApp Bot GACHA NASIP 💖 〕─╮
  │ Darling, nih nasipmu hari ini 😋
  │
  │ 👤 Player : *${name}*
  │ 🍀 Nasip : *${nasip}*
  │
  │ Ara ara~ semoga harimu menyenangkan ❤️
  ╰────────────`,
  
  `╔═══『 💞 NASIP GACHA 』═══╗
  ┃ Darling, yuk cek nasipmu!
  ┃
  ┃ 👤 Player : *${name}*
  ┃ 🌟 Nasip : *${nasip}*
  ┃
  ┃ Ara ara~ semoga hoki terus 😏
  ╚════════════════════╝`,
  
  `┏━━━〔 💫 NASIPMU 〕━━━┓
  ┃
  ┃ 👤 Player : *${name}*
  ┃ 🎲 Nasip : *${nasip}*
  ┃
  ┃ Ara ara~ semoga rezeki & hoki selalu menyertaimu 🗿
  ┗━━━━━━━━━━━━━━━━━━┛`
      ]
  
      const reply = responses[Math.floor(Math.random()*responses.length)]
      await m.reply(reply)
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
