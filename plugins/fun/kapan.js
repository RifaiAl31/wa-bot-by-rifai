// fun/kapan — satu file: metadata + kode fitur (gabungan dari engine3/plugins/fun/kapan.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "kapan",
  "command": [
    "kapan",
    "when"
  ],
  "category": "fun",
  "desc": "Tanya bot kapan sesuatu",
  "usage": ".kapan <pertanyaan>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 3,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/fun").split('\\').join('/')
module.exports = __vx.plugin("fun/kapan", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/kapan.js'
  const __vxExports = {};
  const pluginConfig = {
      name: 'kapan',
      alias: ['when'],
      category: 'fun',
      description: 'Tanya bot kapan sesuatu',
      usage: '.kapan <pertanyaan>',
      example: '.kapan aku nikah?',
      isOwner: false,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 3,
      energi: 0,
      isEnabled: true
  };
  
  const answers = [
      'Besok mungkin?',
      'Tahun depan kayaknya.',
      '3 hari lagi!',
      'Hmm, masih lama sih.',
      'Sebentar lagi kok!',
      'Kalau sudah waktunya, pasti terjadi.',
      'Bulan depan!',
      'Entah kapan, yang penting sabar.',
      'Dalam waktu dekat!',
      '10 tahun lagi mungkin?',
      'Nggak lama lagi!',
      'Kalau jodoh, pasti ketemu.',
      'Hmm, susah diprediksi.',
      'Minggu depan!',
      'Kalau usahanya lebih keras, lebih cepat!',
      'Pas waktunya tepat.',
      'Secepatnya, tenang aja.',
      'Ntar kalo udah siap.',
      'Dalam hitungan hari!',
      'Saat kamu sudah siap menerimanya.'
  ];
  
  async function handler(m) {
      const text = m.text?.trim();
      
      if (!text) {
          return m.reply(`⏰ *ᴋᴀᴘᴀɴ*\n\n> Masukkan pertanyaan!\n\n*Contoh:*\n> .kapan aku nikah?`);
      }
      
      const answer = answers[Math.floor(Math.random() * answers.length)];
      
      await m.reply(`${m.body.slice(1)}?\n*${answer}*`);
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
