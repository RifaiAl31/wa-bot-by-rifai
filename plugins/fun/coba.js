// fun/coba — satu file: metadata + kode fitur (gabungan dari engine3/plugins/fun/coba.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "coba",
  "command": [
    "coba",
    "try"
  ],
  "category": "fun",
  "desc": "Coba tanyakan sesuatu ke bot",
  "usage": ".coba <pertanyaan>",
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
module.exports = __vx.plugin("fun/coba", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/coba.js'
  const __vxExports = {};
  const pluginConfig = {
      name: 'coba',
      alias: ['try'],
      category: 'fun',
      description: 'Coba tanyakan sesuatu ke bot',
      usage: '.coba <pertanyaan>',
      example: '.coba tebak apa yang aku pikirkan',
      isOwner: false,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 3,
      energi: 0,
      isEnabled: true
  };
  
  const answers = [
      'Hmm, aku coba ya... Kamu lagi mikirin makanan!',
      'Aku tebak... Kamu lagi gabut!',
      'Coba ya... Kayaknya kamu lagi seneng!',
      'Hmm, aku rasa kamu lagi bingung.',
      'Aku coba nebak... Kamu lagi kangen seseorang?',
      'Kayaknya kamu lagi santai deh.',
      'Aku tebak kamu lagi scroll HP terus.',
      'Hmm, pasti lagi bosan ya?',
      'Coba ditebak... Kamu lagi pengen jalan-jalan!',
      'Aku rasa kamu lagi butuh hiburan.',
      'Hmm, kayaknya kamu lagi happy!',
      'Aku coba... Kamu pasti lagi penasaran!',
      'Tebakan aku: kamu lagi rebahan.',
      'Hmm, kamu mungkin lagi mikirin seseorang spesial.',
      'Aku coba: kamu lagi mau curhat?',
      'Kayaknya kamu lagi pengen main game!',
      'Hmm, aku tebak kamu lagi dengerin musik.',
      'Coba aku tebak... Kamu lagi di kamar!',
      'Aku rasa kamu lagi waiting for something.',
      'Hmm, tebakan aku: kamu butuh temen ngobrol!'
  ];
  
  async function handler(m) {
      const text = m.text?.trim();
      
      if (!text) {
          return m.reply(`🎯 *ᴄᴏʙᴀ*\n\n> Masukkan sesuatu!\n\n*Contoh:*\n> .coba tebak apa yang aku pikirkan`);
      }
      
      const answer = answers[Math.floor(Math.random() * answers.length)];
      
      await m.reply(`${m.body.slice(1)}?
  *${answer}*`);
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
