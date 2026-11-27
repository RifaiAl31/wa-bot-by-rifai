// random/barandom — satu file: metadata + kode fitur (gabungan dari engine3/plugins/random/barandom.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "barandom",
  "command": [
    "barandom",
    "bluearchive"
  ],
  "category": "fun",
  "desc": "Random gambar Blue Archive",
  "usage": ".barandom",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/random").split('\\').join('/')
module.exports = __vx.plugin("random/barandom", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/barandom.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const axios = __vxDef(require("axios"));
  const config = __vxDef(require("../../lib/ext/config.e3.js"));
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.js"));
  const pluginConfig = {
      name: 'barandom',
      alias: ['bluearchive', 'ba'],
      category: 'random',
      description: 'Random gambar Blue Archive',
      usage: '.barandom',
      example: '.barandom',
      isOwner: false,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 5,
      energi: 1,
      isEnabled: true
  }
  
  async function handler(m, { sock }) {
      const api = 'https://api.nexray.web.id/random/ba'
      await m.react('🕕')
      try {
          await sock.sendMedia(m.chat, api, null, m, {
              type: 'image'
          })
          
          await m.react('✅')
      } catch (e) {
          await m.react('☢')
          m.reply(te(m.prefix, m.command, m.pushName))
      }
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
