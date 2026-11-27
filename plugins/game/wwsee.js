// game/wwsee — satu file: metadata + kode fitur (gabungan dari engine3/plugins/game/wwsee.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "wwsee",
  "command": [
    "wwsee",
    "seer",
    "vision",
    "wse"
  ],
  "category": "game",
  "desc": "Seer night action - See target role",
  "usage": ".wwsee <nomor>",
  "owner": false,
  "group": false,
  "private": true,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 0,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/game").split('\\').join('/')
module.exports = __vx.plugin("game/wwsee", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/wwsee.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const { nightActionHandler } = require("../../lib/ext/plugins/e3/game/werewolf.js");
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.js"));
  const pluginConfig = {
      name: 'wwsee',
      alias: ['seer', 'vision', 'wse'],
      category: 'game',
      description: 'Seer night action - See target role',
      usage: '.wwsee <nomor>',
      example: '.wwsee 1',
      isOwner: false,
      isPremium: false,
      isGroup: false,
      isPrivate: true,
      cooldown: 0,
      energi: 0,
      isEnabled: true
  }
  
  async function handler(m, { sock }) {
      try {
          return await nightActionHandler(m, { sock })
      } catch (error) {
          console.error('[WWSEE ERROR]', error)
          m.reply(te(m.prefix, m.command, m.pushName))
      }
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
