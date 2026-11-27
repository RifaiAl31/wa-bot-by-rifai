// other/tebakml — satu file: metadata + kode fitur (gabungan dari engine8/plugins/other/tebakml.js)
const __vx = require("../../lib/adapter/e8.js")
const __meta = {
  "name": "tebakml",
  "command": [
    "tebakml",
    "tebakmobalegends",
    "tebakhero"
  ],
  "category": "game",
  "desc": "Tebak karakter Mobile Legends",
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
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/other").split('\\').join('/')
module.exports = __vx.plugin("other/tebakml", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/tebakml.js'
  const __vxExports = {};
  const { games } = require("../../lib/ext/src/lib/vanxone-games.e8.js");
  
  games.register('tebakml', {
      alias: ['tebakmobalegends', 'tebakhero'],
      emoji: '⚔️',
      title: 'TEBAK ML',
      description: 'Tebak karakter Mobile Legends',
      hasImage: true,
      questionField: 'deskripsi',
      answerField: 'jawaban',
      imageField: 'img'
  })
  
  const { config: pluginConfig, handler, answerHandler } = games.createPlugin('tebakml')
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  Object.defineProperty(__vxExports, "answerHandler", { enumerable: true, get: () => answerHandler });
  return __vxExports
})
