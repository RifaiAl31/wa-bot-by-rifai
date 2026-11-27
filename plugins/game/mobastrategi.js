// game/mobastrategi — satu file: metadata + kode fitur (gabungan dari engine8/plugins/game/mobastrategi.js)
const __vx = require("../../lib/adapter/e8.js")
const __meta = {
  "name": "mobastrategi",
  "command": [
    "mobastrategi",
    "moba",
    "battlestrategi",
    "mobastra"
  ],
  "category": "game",
  "desc": "Tebak skill terbaik dalam situasi battle MOBA!",
  "usage": "",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/game").split('\\').join('/')
module.exports = __vx.plugin("game/mobastrategi", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/mobastrategi.js'
  const __vxExports = {};
  const { games } = require("../../lib/ext/src/lib/vanxone-games.e8.js");
  
  games.register('mobastrategi', {
      alias: ['moba', 'battlestrategi', 'mobastra'],
      emoji: '⚔️',
      title: 'MOBA STRATEGI',
      description: 'Tebak skill terbaik dalam situasi battle MOBA!',
      timeout: 60000,
      cooldown: 5,
      dataFile: 'mobastrategi.json',
      questionField: 'soal',
      answerField: 'jawaban',
      hasImage: false,
  })
  
  const { config: pluginConfig, handler, answerHandler } = games.createPlugin('mobastrategi')
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  Object.defineProperty(__vxExports, "answerHandler", { enumerable: true, get: () => answerHandler });
  return __vxExports
})
