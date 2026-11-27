// random/meme — satu file: metadata + kode fitur (gabungan dari engine3/plugins/random/meme.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "meme",
  "command": [
    "memeindonesia"
  ],
  "category": "fun",
  "desc": "Random meme Indonesia",
  "usage": ".meme",
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
module.exports = __vx.plugin("random/meme", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/meme.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const axios = __vxDef(require("axios"));
  const config = __vxDef(require("../../lib/ext/config.e3.js"));
  const { f } = require("../../lib/ext/src/lib/vanxone-http.js");
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.js"));
  const NEOXR_APIKEY = config.APIkey?.neoxr || ''
  
  const pluginConfig = {
      name: 'meme',
      alias: ['randommeme', 'memeindonesia'],
      category: 'random',
      description: 'Random meme Indonesia',
      usage: '.meme',
      example: '.meme',
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
          const { data } = await f(`https://api.neoxr.eu/api/meme?apikey=${NEOXR_APIKEY}`)
          await sock.sendMedia(m.chat, data.url, data.title, m, {
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
