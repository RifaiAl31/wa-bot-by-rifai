// game/wwsorcerer — satu file: metadata + kode fitur (gabungan dari engine3/plugins/game/wwsorcerer.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "wwsorcerer",
  "command": [
    "wwsorcerer",
    "sorcerer",
    "wws"
  ],
  "category": "game",
  "desc": "Sorcerer night action - Check if target is Seer",
  "usage": ".wwsorcerer <nomor>",
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
module.exports = __vx.plugin("game/wwsorcerer", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/wwsorcerer.js'
  const __vxExports = {};
  const { nightActionHandler } = require("../../lib/ext/plugins/e3/game/werewolf.js");
  const pluginConfig = {
      name: 'wwsorcerer',
      alias: ['sorcerer', 'wws'],
      category: 'game',
      description: 'Sorcerer night action - Check if target is Seer',
      usage: '.wwsorcerer <nomor>',
      example: '.wwsorcerer 3',
      isOwner: false,
      isPremium: false,
      isGroup: false,
      isPrivate: true,
      cooldown: 0,
      energi: 0,
      isEnabled: true
  }
  
  async function handler(m, { sock }) {
      return await nightActionHandler(m, { sock })
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
