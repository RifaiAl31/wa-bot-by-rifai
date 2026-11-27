// fun/suratcinta — satu file: metadata + kode fitur (gabungan dari engine7/plugins/fun/suratcinta.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "suratcinta",
  "command": [
    "suratcinta"
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
module.exports = __vx.plugin("fun/suratcinta", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/suratcinta.js'
  const __vxExports = {};
  const FEATURE_CREDIT = "Fitur by: Owner Bot";
  
  
  const pluginConfig = {
    name: "suratcinta",
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
    if (!text) return m.reply('💌 Masukkan nama orang yang mau kamu kirimi surat cinta palsu.\n\nContoh: .suratcinta WhatsApp Bot')
  
    const target = text
    const pembuka = [
      `Untukmu yang selalu hadir dalam lamunanku, ${target},`,
      `Dear ${target},`,
      `Kepada ${target} yang diam-diam kucintai,`,
      `Hai ${target}, bintang di langit malamku,`,
      `Wahai ${target}, pemilik senyum yang menghancurkan dompetku,`
    ]
  
    const isi = [
      `Setiap kali aku melihat status-mu, hatiku bergetar seperti sinyal WiFi tetangga.`,
      `Kau hadir dalam hidupku bagaikan notif Shopee di tengah malam, mengejutkan tapi bikin senang.`,
      `Aku tau kamu bukan SPBU, tapi kenapa kamu selalu ngisi hatiku?`,
      `Kalau cinta itu buta, maka aku sudah lama tersesat di labirin wajahmu.`,
      `Tanpamu hidupku seperti Indomie tanpa micin, hambar dan menyedihkan.`
    ]
  
    const penutup = [
      `Salam terhangat, dari seseorang yang bahkan kamu gak save nomornya.`,
      `Dari aku, yang hanya bisa memandangmu dari status WhatsApp.`,
      `Dengan penuh cinta palsu,`,
      `Yang mencintaimu dalam diam dan chat yang tak pernah kamu balas.`,
      `Sekian, sebelum kamu buang surat ini ke spam.`
    ]
  
    const surat = `${pick(pembuka)}\n\n${pick(isi)}\n\n${pick(penutup)}`
    m.reply(`💌 *Surat Cinta Palsu*\n\n${surat}`)
  }
  
  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)]
  }
  
  
  
  Object.defineProperty(__vxExports, "FEATURE_CREDIT", { enumerable: true, get: () => FEATURE_CREDIT });
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
