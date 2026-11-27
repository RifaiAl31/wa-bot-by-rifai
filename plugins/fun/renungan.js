// fun/renungan — satu file: metadata + kode fitur (gabungan dari engine3/plugins/fun/renungan.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "renungan",
  "command": [
    "renungan",
    "mutiara"
  ],
  "category": "fun",
  "desc": "Random gambar renungan/motivasi",
  "usage": ".renungan",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/fun").split('\\').join('/')
module.exports = __vx.plugin("fun/renungan", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/renungan.js'
  const __vxExports = {};
  const { getRandomItem } = require("../../lib/ext/src/lib/vanxone-game-data.js");
  const { fetchBuffer } = require("../../lib/ext/src/lib/vanxone-utils.js");
  const pluginConfig = {
      name: 'renungan',
      alias: ['motivasi', 'mutiara'],
      category: 'fun',
      description: 'Random gambar renungan/motivasi',
      usage: '.renungan',
      example: '.renungan',
      isOwner: false,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 5,
      energi: 0,
      isEnabled: true
  };
  
  async function handler(m, { sock }) {
      m.react('🕕')
      try {
          await sock.sendMedia(m.chat, getRandomItem('renungan.json'), null, m, {
              type: 'image'
          })
          m.react('✅')
      } catch (error) {
          m.react('❌')
          await m.reply('❌ Gagal mengambil gambar. Coba lagi!');
      }
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
