// game/werewolf — satu file: metadata + kode fitur (gabungan dari engine3/plugins/game/werewolf.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "werewolf",
  "command": [
    "werewolf",
    "ww",
    "wwgc"
  ],
  "category": "game",
  "desc": "Main Werewolf Game bersama player lain",
  "usage": ".ww <create|join|start|vote|player|exit|delete>",
  "owner": false,
  "group": true,
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
module.exports = __vx.plugin("game/werewolf", __meta, async function () {
  return require("../../lib/ext/plugins/e3/game/werewolf.js")
})
