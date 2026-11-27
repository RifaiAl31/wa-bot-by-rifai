// random/quotesimage — satu file: metadata + kode fitur (gabungan dari engine3/plugins/random/quotesimage.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "quotesimage",
  "command": [
    "quotesimage",
    "quoteimg",
    "quotes-image",
    "qimg"
  ],
  "category": "fun",
  "desc": "Random quotes image",
  "usage": ".quotesimage",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [
      "neoxr"
    ],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/random").split('\\').join('/')
module.exports = __vx.plugin("random/quotesimage", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/quotesimage.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const axios = __vxDef(require("axios"));
  const config = __vxDef(require("../../lib/ext/config.e3.js"));
  const { f } = require("../../lib/ext/src/lib/vanxone-http.js");
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.js"));
  const NEOXR_APIKEY = config.APIkey?.neoxr || ''
  
  const pluginConfig = {
      name: 'quotesimage',
      alias: ['quoteimg', 'quotes-image', 'qimg'],
      category: 'random',
      description: 'Random quotes image',
      usage: '.quotesimage',
      example: '.quotesimage',
      isOwner: false,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 5,
      energi: 0,
      isEnabled: true
  }
  
  async function handler(m, { sock }) {
      m.react('🕕')
      
      try {
          const res = await f(`https://api.neoxr.eu/api/quotesimage?apikey=${NEOXR_APIKEY}`)
          
          if (!res.status || !res.data?.url) {
              m.react('❌')
              return m.reply(`❌ Gagal mengambil quotes image`)
          }
          
          await sock.sendMedia(m.chat, res.data.url, null, m, {
              type: 'image'
          })
          
          m.react('✅')
          
      } catch (err) {
          m.react('☢')
          return m.reply(te(m.prefix, m.command, m.pushName))
      }
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
