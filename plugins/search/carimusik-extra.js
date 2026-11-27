// search/carimusik — satu file: metadata + kode fitur (gabungan dari engine7/plugins/search/carimusik.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "searchmusik",
  "command": [
    "carimusik",
    "searchmusik",
    "musiksearch"
  ],
  "category": "search",
  "desc": "Cari lagu dari berbagai sumber",
  "usage": ".searchmusik",
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
module.exports = __vx.plugin("search/carimusik", __meta, async function () {
  return require("../../lib/ext/plugins/e7/search/carimusik.js")
})
