// fun/puisi — satu file: metadata + kode fitur (gabungan dari engine3/plugins/fun/puisi.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "puisi",
  "command": [
    "puisi",
    "puisiku",
    "sajak"
  ],
  "category": "fun",
  "desc": "Random puisi Indonesia",
  "usage": ".puisi",
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
module.exports = __vx.plugin("fun/puisi", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/puisi.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const axios = __vxDef(require("axios"));
  const config = __vxDef(require("../../lib/ext/config.e3.js"));
  const { f } = require("../../lib/ext/src/lib/vanxone-http.js");
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.js"));
  const NEOXR_APIKEY = config.APIkey?.neoxr || ''
  
  const pluginConfig = {
      name: 'puisi',
      alias: ['puisiku', 'sajak'],
      category: 'fun',
      description: 'Random puisi Indonesia',
      usage: '.puisi',
      example: '.puisi',
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
          const res = await f(`https://api.neoxr.eu/api/puisi?apikey=${NEOXR_APIKEY}`)
          
          if (!res.status || !res.data?.text) {
              m.react('❌')
              return m.reply(`❌ Gagal mengambil puisi`)
          }
          
          const text = res.data.text
          await m.reply(text)
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
