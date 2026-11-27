// fun/fuckmylife — satu file: metadata + kode fitur (gabungan dari engine3/plugins/fun/fuckmylife.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "fuckmylife",
  "command": [
    "fuckmylife",
    "fml"
  ],
  "category": "fun",
  "desc": "Random FML story",
  "usage": ".fuckmylife",
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
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/fun").split('\\').join('/')
module.exports = __vx.plugin("fun/fuckmylife", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/fuckmylife.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const axios = __vxDef(require("axios"));
  const config = __vxDef(require("../../lib/ext/config.e3.js"));
  const { f } = require("../../lib/ext/src/lib/vanxone-http.js");
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.js"));
  const NEOXR_APIKEY = config.APIkey?.neoxr || ''
  
  const pluginConfig = {
      name: 'fuckmylife',
      alias: ['fml'],
      category: 'fun',
      description: 'Random FML story',
      usage: '.fuckmylife',
      example: '.fuckmylife',
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
          const data = await f(`https://api.neoxr.eu/api/fml?apikey=${NEOXR_APIKEY}`)
          
          if (!data?.status || !data?.data?.text) {
              m.react('❌')
              return m.reply(`❌ Gagal mengambil FML story`)
          }    
          await m.reply(data.data.text)
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
