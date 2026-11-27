// user/level — satu file: metadata + kode fitur (gabungan dari engine3/plugins/user/level.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "level",
  "command": ["level", "lvl"],
  "category": "profil",
  "desc": "Cek level user",
  "usage": ".level [@user]",
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
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/user").split('\\').join('/')
module.exports = __vx.plugin("user/level", __meta, async function () {
  return require("../../lib/ext/plugins/e3/user/level.js")
})
