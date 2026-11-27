// group/intro — satu file: metadata + kode fitur (gabungan dari engine3/plugins/group/intro.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "intro",
  "command": [
    "perkenalan",
    "selamatdatang"
  ],
  "category": "group",
  "desc": "Tampilkan pesan intro grup",
  "usage": ".intro",
  "owner": false,
  "group": true,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 10,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/group").split('\\').join('/')
module.exports = __vx.plugin("group/intro", __meta, async function () {
  return require("../../lib/ext/plugins/e3/group/intro.js")
})
