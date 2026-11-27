// owner/gamemode — satu file: metadata + kode fitur (gabungan dari engine1/plugins/owner/gamemode.js)
const __vx = require("../../lib/adapter/e1.js")
const __meta = {
  "name": "gamemode",
  "command": [
    "gamemode",
    "gm",
    "setrole"
  ],
  "category": "owner",
  "desc": "Set role user: creative (owner), survival (user biasa), spectator (diabaikan bot)",
  "usage": ".gamemode @user/nomor <creative|c|survival|s|spectator|sp>",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 3,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/owner").split('\\').join('/')
module.exports = __vx.plugin("owner/gamemode", __meta, async function () {
  return require("../../lib/ext/plugins/e1/owner/gamemode.js")
})
