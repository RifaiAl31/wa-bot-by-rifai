// game/sambungkata — satu file: metadata + kode fitur (gabungan dari engine8/plugins/game/sambungkata.js)
const __vx = require("../../lib/adapter/e8.js")
const __meta = {
  "name": "sambungkata",
  "command": [
    "sambkata",
    "sw",
    "wordchain"
  ],
  "category": "game",
  "desc": "Sambung kata dari huruf terakhir kata sebelumnya",
  "usage": "",
  "owner": false,
  "group": true,
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
module.exports = __vx.plugin("game/sambungkata", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/sambungkata.js'
  const __vxExports = {};
  const { games } = require("../../lib/ext/src/lib/vanxone-games.e8.js");
  
  games.register('sambungkata', {
      mode: 'chain',
      alias: ['sambkata', 'sw', 'wordchain'],
      emoji: '🔠',
      title: 'SAMBUNG KATA',
      description: 'Sambung kata dari huruf terakhir kata sebelumnya',
      dataFile: 'sambungkata.json',
      turnTimeout: 300000, 
      minWordLength: 3,
  })
  
  const { config: pluginConfig, handler, answerHandler } = games.createPlugin('sambungkata', {
      isGroup: true,
      isPrivate: false,
  })
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  Object.defineProperty(__vxExports, "answerHandler", { enumerable: true, get: () => answerHandler });
  return __vxExports
})
