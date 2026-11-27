// owner/bankategori — satu file: metadata + kode fitur (gabungan dari engine1/plugins/owner/bankategori.js)
const __vx = require("../../lib/adapter/e1.js")
const __meta = {
  "name": "bankategori",
  "command": [
    "bankategori",
    "bancat",
    "bancategory"
  ],
  "category": "owner",
  "desc": "Ban/unban/list kategori plugin",
  "usage": ".bankategori <kategori> [global/@user] | -unban <kategori> [global/@user] | -list",
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
module.exports = __vx.plugin("owner/bankategori", __meta, async function () {
  return require("../../lib/ext/plugins/e1/owner/bankategori.js")
})
