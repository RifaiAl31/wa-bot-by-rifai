// fun/tebakumur — satu file: metadata + kode fitur (gabungan dari engine7/plugins/fun/tebakumur.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "tebakumur",
  "command": [
    "tebakumur"
  ],
  "category": "fun",
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
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/fun").split('\\').join('/')
module.exports = __vx.plugin("fun/tebakumur", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/tebakumur.js'
  const __vxExports = {};
  const FEATURE_CREDIT = "Fitur by: Owner Bot";
  
  
  const pluginConfig = {
    name: "tebakumur",
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
    energi: 1,
    isEnabled: true,
  };
  
  async function handler(m, { sock, text }) {
      const conn = sock;
      if (!text) return conn.reply(m.chat, 'Masukan Namamu', m)
      let age = umur.getRandom()
      m.reply(`Nama Kamu: ${text}\nUmur ${age}`)
  }
  const umur = [
  '12 Tahun, Masih Bocil',
  '11 Tahun, Bocilll',
  '10 Tahun, Aduh Masih Gaboleh Main Hp Dek',
  '16 Tahun, Remaja Lah Ya',
  '19 Tahun, Remajaa',
  '20 Tahun, Udah Nikah?',
  '21 Tahun, Udah Ketemu Calon Nih?',
  '14 Tahun',
  '15 Tahun',
  '17 Tahun',
  '18 Tahun, Udah Balig Nih'
  ]
  
  
  
  Object.defineProperty(__vxExports, "FEATURE_CREDIT", { enumerable: true, get: () => FEATURE_CREDIT });
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
