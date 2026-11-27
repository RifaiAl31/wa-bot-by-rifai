// game/game-caklontong_hint — satu file: metadata + kode fitur (gabungan dari engine2/plugins/game/game-caklontong_hint.js)
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "calo"
  ],
  "category": "game",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur calo (dari Bot package)"
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/game").split('\\').join('/')
module.exports = __vx.plugin("game/game-caklontong_hint", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/game-caklontong_hint.js'
  const __vxExports = {};
  let handler = async (m, { conn }) => {
      conn.caklontong = conn.caklontong ? conn.caklontong : {}
      let id = m.chat
      if (!(id in conn.caklontong)) throw false
      let json = conn.caklontong[id][1]
      let ans = json.jawaban
      let clue = ans.replace(/[AIUEO]/gi, '_')
      m.reply('```' + clue + '```')
  }
  handler.command = /^calo$/i
  
  handler.limit = true
  handler.register = true
  
  const __vxDefault = handler
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})
