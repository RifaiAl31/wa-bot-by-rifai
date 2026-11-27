// fun/lupakan — satu file: metadata + kode fitur (gabungan dari engine7/plugins/fun/lupakan.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "lupakan",
  "command": [
    "lupakan"
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
module.exports = __vx.plugin("fun/lupakan", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/lupakan.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const FEATURE_CREDIT = "Fitur by: Owner Bot";
  
  
  const fetch = __vxDef(require("node-fetch"));
  
  const pluginConfig = {
    name: "lupakan",
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
  
  const handler = async (m, { conn, text, usedPrefix, command }) => {
    const quotes = [
      'Masa lalu adalah pelajaran, bukan penjara. Biarkan dirimu terbang lebih tinggi.',
      'Setiap hari adalah kesempatan baru untuk menjadi versi terbaik dari dirimu.',
      'Jangan biarkan kemarin mengambil terlalu banyak dari hari ini.',
      'Lupakan apa yang tidak bisa diubah, fokus pada apa yang bisa kamu lakukan sekarang.',
      'Kehidupan terlalu singkat untuk menyimpan dendam dan penyesalan.',
      'Masa depan menunggu mereka yang berani meninggalkan masa lalu.',
      'Kesalahan adalah guru terbaik, bukan musuh. Belajar dan lanjutkan.',
      'Kamu tidak bisa mengubah masa lalu, tapi kamu bisa membentuk masa depan.',
      'Setiap detik adalah kesempatan untuk memulai ulang.',
      'Lepaskan beban masa lalu dan rasakan kebebasan sejati.',
      'Hidup dimulai ketika kamu berhenti memikirkan apa yang seharusnya terjadi.',
      'Masa lalu tidak mendefinisikan siapa kamu, pilihan hari ini yang melakukannya.',
      'Jangan terjebak dalam cerita lama, tulis cerita baru yang lebih indah.',
      'Keberanian bukan tidak takut, tapi melangkah maju meski takut.',
      'Setiap orang berhak mendapatkan kesempatan kedua, termasuk dirimu sendiri.'
    ];
  
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    
    const message = `— lupakan masa lalu —
  
  ❀ motivasi :
  ${randomQuote}
  
  Ingat, kamu lebih kuat dari yang kamu pikirkan. Masa depan penuh dengan kemungkinan tak terbatas! 💪✨`;
  
    await conn.sendMessage(m.chat, { text: message }, { quoted: m });
  };
  
  handler.register = true;
  
  
  
  Object.defineProperty(__vxExports, "FEATURE_CREDIT", { enumerable: true, get: () => FEATURE_CREDIT });
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
