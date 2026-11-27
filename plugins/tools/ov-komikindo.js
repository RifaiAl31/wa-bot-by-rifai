// download/komikindo — satu file: metadata + kode fitur (gabungan dari engine1/plugins/download/komikindo.js)
const __vx = require("../../lib/adapter/e1.js")
const __meta = {
  "name": "komikindo",
  "command": [
    "komikindo",
    "komikindo2",
    "kmk"
  ],
  "category": "download",
  "desc": "Cari dan download komik dari Komikindo sebagai PDF",
  "usage": ".komikindo <judul/url>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 15,
  "energi": 2,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  },
  "override": true
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/download").split('\\').join('/')
module.exports = __vx.plugin("download/komikindo", __meta, async function () {
  return require("../../lib/ext/plugins/e1/download/komikindo.js")
})
