// fun/dimana — satu file: metadata + kode fitur (gabungan dari engine3/plugins/fun/dimana.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "dimana",
  "command": [
    "dimana",
    "where",
    "mana"
  ],
  "category": "fun",
  "desc": "Tanya bot dimana sesuatu",
  "usage": ".dimana <pertanyaan>",
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
module.exports = __vx.plugin("fun/dimana", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/dimana.js'
  const __vxExports = {};
  const pluginConfig = {
      name: 'dimana',
      alias: ['where', 'mana'],
      category: 'fun',
      description: 'Tanya bot dimana sesuatu',
      usage: '.dimana <pertanyaan>',
      example: '.dimana jodohku berada?',
      isOwner: false,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 3,
      energi: 0,
      isEnabled: true
  };
  
  const answers = [
      'Di dekatmu!',
      'Jauh di sana.',
      'Di tempat yang tidak kamu duga.',
      'Di hatimu.',
      'Di sekitar sini.',
      'Hmm, coba cari di kamar.',
      'Di luar sana, menunggumu.',
      'Di tempat yang sama denganmu.',
      'Di suatu tempat yang indah.',
      'Di balik pintu.',
      'Di sebelah kirimu.',
      'Di depan matamu!',
      'Jauh banget, di luar negeri mungkin?',
      'Di tempat yang penuh kenangan.',
      'Di mana-mana!',
      'Di dunia maya.',
      'Di alam mimpi.',
      'Di tempat rahasia.',
      'Hmm, susah dijelaskan lokasinya.',
      'Di tempat yang akan membuatmu bahagia.'
  ];
  
  async function handler(m) {
      const text = m.text?.trim();
      
      if (!text) {
          return m.reply(`📍 *ᴅɪᴍᴀɴᴀ*\n\n> Masukkan pertanyaan!\n\n*Contoh:*\n> .dimana jodohku berada?`);
      }
      
      const answer = answers[Math.floor(Math.random() * answers.length)];
      
      await m.reply(`${m.body.slice(1)}?
  *${answer}*`);
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
