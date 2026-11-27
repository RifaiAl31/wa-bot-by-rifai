// fun/kematian — satu file: metadata + kode fitur (gabungan dari engine7/plugins/fun/kematian.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "kematian",
  "command": [
    "kematian"
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
module.exports = __vx.plugin("fun/kematian", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/kematian.js'
  const __vxExports = {};
  const FEATURE_CREDIT = "Fitur by: Owner Bot";
  
  
  function getRandomDate() {
    const now = new Date()
    const future = new Date(now.getFullYear() + 70, 0, 1)
    const deathTime = new Date(now.getTime() + Math.random() * (future.getTime() - now.getTime()))
    return deathTime.toDateString()
  }
  
  const pluginConfig = {
    name: "kematian",
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
  
    const sebab = [
      'keracunan cilok expired 😵',
      'ditabrak mobil odading 😩',
      'terpeleset di kamar mandi pas nyanyi dangdut 🚿🎤',
      'kecanduan scrolling TikTok 48 jam nonstop 📱💀',
      'ngambek sama bot sendiri terus putus asa 😭',
      'kelamaan jomblo sampe badan menghilang 🫥',
      'makan mie pakai kopi dan susu 🤢',
      'diculik alien terus dikira bahan eksperimen 👽🔬',
      'dipukul karma karena suka nyolong meme 🙃',
      'ketawa ngakak sampai lupa napas 😂'
    ]
  
    let tanggal = getRandomDate()
    let penyebab = sebab[Math.floor(Math.random() * sebab.length)]
  
    m.reply(`💀 *Ramalan Kematian*\n\n📛 Nama: *${nama}*\n🗓️ Tanggal: *${tanggal}*\n⚰️ Penyebab: *${penyebab}*`)
  }
  
  
  
  Object.defineProperty(__vxExports, "FEATURE_CREDIT", { enumerable: true, get: () => FEATURE_CREDIT });
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
