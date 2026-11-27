// fun/berapa — satu file: metadata + kode fitur (gabungan dari engine3/plugins/fun/berapa.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "berapa",
  "command": [
    "berapa",
    "howmuch",
    "howmany"
  ],
  "category": "fun",
  "desc": "Tanya bot berapa sesuatu",
  "usage": ".berapa <pertanyaan>",
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
module.exports = __vx.plugin("fun/berapa", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/berapa.js'
  const __vxExports = {};
  const pluginConfig = {
      name: 'berapa',
      alias: ['howmuch', 'howmany'],
      category: 'fun',
      description: 'Tanya bot berapa sesuatu',
      usage: '.berapa <pertanyaan>',
      example: '.berapa umur jodohku?',
      isOwner: false,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 3,
      energi: 0,
      isEnabled: true
  };
  
  const answers = [
      '1',
      '7',
      '12',
      '21',
      '99',
      '69',
      '100',
      '50',
      '25',
      '1000',
      '5',
      '17',
      '88',
      '33',
      'nothing (jawabannya selalu nothing)',
      'Banyak banget!',
      'Cuma sedikit.',
      'Tak terhitung!',
      'Hmm, sekitar 10-an.',
      'Lebih dari yang kamu kira!',
      'Gak tau ah, males'
  ];
  
  async function handler(m) {
      const text = m.text?.trim();
      
      if (!text) {
          return m.reply(`🔢 *ʙᴇʀᴀᴘᴀ*\n\n> Masukkan pertanyaan!\n\n*Contoh:*\n> .berapa umur jodohku?`);
      }
      
      const answer = answers[Math.floor(Math.random() * answers.length)];
      
      await m.reply(`${m.body.slice(1)}?
  *${answer}*`);
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
