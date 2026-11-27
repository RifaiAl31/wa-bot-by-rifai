// game/wwprotect — satu file: metadata + kode fitur (gabungan dari engine3/plugins/game/wwprotect.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "wwprotect",
  "command": [
    "wwprotect",
    "protect",
    "guardian",
    "wpr"
  ],
  "category": "game",
  "desc": "Guardian night action - Protect target",
  "usage": ".wwprotect <nomor>",
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
module.exports = __vx.plugin("game/wwprotect", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/wwprotect.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const { nightActionHandler } = require("../../lib/ext/plugins/e3/game/werewolf.js");
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.js"));
  const pluginConfig = {
      name: 'wwprotect',
      alias: ['protect', 'guardian', 'wpr'],
      category: 'game',
      description: 'Guardian night action - Protect target',
      usage: '.wwprotect <nomor>',
      example: '.wwprotect 3',
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
          console.error('[WWPROTECT ERROR]', error)
          m.reply(te(m.prefix, m.command, m.pushName))
      }
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
