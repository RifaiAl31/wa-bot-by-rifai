// game/caklontong — satu file: metadata + kode fitur (gabungan dari engine8/plugins/game/caklontong.js)
const __vx = require("../../lib/adapter/e8.js")
const __meta = {
  "name": "caklontong",
  "command": [
    "cak",
    "lontong"
  ],
  "category": "game",
  "desc": "Game cak lontong - jawaban receh",
  "usage": "",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 3,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/game").split('\\').join('/')
module.exports = __vx.plugin("game/caklontong", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/caklontong.js'
  const __vxExports = {};
  const { games } = require("../../lib/ext/src/lib/vanxone-games.e8.js");
  
  games.register('caklontong', {
      alias: ['cak', 'lontong'],
      emoji: '🤔',
      title: 'CAK LONTONG',
      description: 'Game cak lontong - jawaban receh'
  })
  
  const { config: pluginConfig, handler, answerHandler } = games.createPlugin('caklontong')
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  Object.defineProperty(__vxExports, "answerHandler", { enumerable: true, get: () => answerHandler });
  return __vxExports
})
