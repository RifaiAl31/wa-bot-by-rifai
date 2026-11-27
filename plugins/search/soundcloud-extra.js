// search/soundcloud — satu file: metadata + kode fitur (gabungan dari engine3/plugins/search/soundcloud.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "scs",
  "command": [
    "scs"
  ],
  "category": "search",
  "desc": "Cari lagu di SoundCloud",
  "usage": ".scs",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/search").split('\\').join('/')
module.exports = __vx.plugin("search/soundcloud", __meta, async function () {
  return require("../../lib/ext/plugins/e3/search/soundcloud.js")
})
