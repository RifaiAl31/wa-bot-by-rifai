// fun/akankah — satu file: metadata + kode fitur (gabungan dari engine3/plugins/fun/akankah.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "akankah",
  "command": [
    "akankah",
    "akan",
    "will"
  ],
  "category": "fun",
  "desc": "Tanya bot akankah sesuatu terjadi",
  "usage": ".akankah <pertanyaan>",
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
module.exports = __vx.plugin("fun/akankah", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/akankah.js'
  const __vxExports = {};
  const pluginConfig = {
      name: 'akankah',
      alias: ['akan', 'will'],
      category: 'fun',
      description: 'Tanya bot akankah sesuatu terjadi',
      usage: '.akankah <pertanyaan>',
      example: '.akankah aku sukses?',
      isOwner: false,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 3,
      energi: 0,
      isEnabled: true
  };
  
  const answers = [
      'Ya, pasti akan terjadi!',
      'Tidak, sepertinya tidak akan.',
      'Mungkin akan, mungkin tidak.',
      'InsyaAllah akan terjadi!',
      'Hmm, sulit diprediksi.',
      'Pasti! Yakin saja!',
      'Kayaknya nggak deh.',
      'Akan terjadi kalau kamu mau berusaha.',
      'Suatu saat nanti, pasti.',
      'Nggak akan, maaf.',
      'Tentu akan! Tunggu saja!',
      'Hmm, aku ragu.',
      'Akan! Percaya sama proses!',
      'Kemungkinannya kecil.',
      'Pasti akan, aku yakin!',
      'Nggak akan, cari yang lain aja.',
      'Akan, tapi butuh waktu.',
      'InsyaAllah!',
      'Kalau jodoh, pasti akan.',
      'Akan terjadi di saat yang tepat!'
  ];
  
  async function handler(m) {
      const text = m.text?.trim();
      
      if (!text) {
          return m.reply(`🔮 *ᴀᴋᴀɴᴋᴀʜ*\n\n> Masukkan pertanyaan!\n\n*Contoh:*\n> .akankah aku sukses?`);
      }
      
      const answer = answers[Math.floor(Math.random() * answers.length)];
      
      await m.reply(`${m.body.slice(1)}?
  *${answer}*`);
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
