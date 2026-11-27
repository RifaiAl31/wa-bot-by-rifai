// fun/seberapagila — satu file: metadata + kode fitur (gabungan dari engine7/plugins/fun/seberapagila.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "seberapagila",
  "command": [
    "seberapagila"
  ],
  "category": "fun",
  "desc": "Imported from WhatsApp Bot V4.6",
  "usage": "",
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
module.exports = __vx.plugin("fun/seberapagila", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/seberapagila.js'
  const __vxExports = {};
  const FEATURE_CREDIT = "Fitur by: Owner Bot";
  
  
  const pluginConfig = {
    name: "seberapagila",
    alias: [],
    category: "fun",
    description: "Imported from WhatsApp Bot V4.6",
    usage: "",
    example: "",
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 3,
    energi: 0,
    isEnabled: true,
  };
  
  async function handler(m, { text }) {
    const nama = text || m.pushName || 'Kamu'
    const persen = Math.floor(Math.random() * 101)
  
    const komentar = [
      'Normal... kayak batu bata.',
      'Agak nyeleneh, tapi masih bisa diajak diskusi.',
      'Udah mulai ngaco, tolong dijaga.',
      'Wah ini sih gila bener, cocok masuk rumah tertawa.',
      'Level dewa... gila tapi keren.',
      'Gila banget, sampe bot aja pusing baca chat kamu.',
      'Kayaknya udah enggak bisa diselamatkan 😭',
      'Kamu waras, tapi cuma kalau tidur.',
      'Gila dalam diam... serem banget kamu.',
      'Gila bergaya profesional. Respect.'
    ]
  
    const kata = komentar[Math.floor(Math.random() * komentar.length)]
  
    m.reply(`🧠 *Tes Kegilaan Hari Ini*\n\n👤 Nama: *${nama}*\n📊 Tingkat Gila: *${persen}%*\n🗯️ Komentar: *${kata}*`)
  }
  
  
  
  Object.defineProperty(__vxExports, "FEATURE_CREDIT", { enumerable: true, get: () => FEATURE_CREDIT });
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
