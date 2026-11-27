// fun/senja — satu file: metadata + kode fitur (gabungan dari engine3/plugins/fun/senja.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "senja",
  "command": [
    "senja",
    "katacinta",
    "romanticquotes"
  ],
  "category": "fun",
  "desc": "Random kata-kata senja/romantis",
  "usage": ".senja",
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
module.exports = __vx.plugin("fun/senja", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/senja.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const axios = __vxDef(require("axios"));
  const config = __vxDef(require("../../lib/ext/config.e3.js"));
  const { f } = require("../../lib/ext/src/lib/vanxone-http.js");
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.js"));
  const NEOXR_APIKEY = config.APIkey?.neoxr || ''
  
  const pluginConfig = {
      name: 'senja',
      alias: ['katacinta', 'romanticquotes'],
      category: 'fun',
      description: 'Random kata-kata senja/romantis',
      usage: '.senja',
      example: '.senja',
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
          const res = await f(`https://api.neoxr.eu/api/senja?apikey=${NEOXR_APIKEY}`)
          
          if (!res.status || !res.data?.text) {
              m.react('❌')
              return m.reply(`❌ Gagal mengambil kata senja`)
          }
          await m.reply(res.data.text)
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
