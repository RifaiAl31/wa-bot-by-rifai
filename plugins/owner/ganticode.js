// owner/ganticode — satu file: metadata + kode fitur (gabungan dari engine1/plugins/owner/ganticode.js)
const __vx = require("../../lib/adapter/e1.js")
const __meta = {
  "name": "ganticode",
  "command": [
    "ganticode",
    "replaceplugin",
    "updateplugin",
    "gantiplugin",
    "gc"
  ],
  "category": "owner",
  "desc": "Ganti code plugin yang sudah ada",
  "usage": ".ganticode [namafile] [folder]",
  "owner": true,
  "group": false,
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
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/owner").split('\\').join('/')
module.exports = __vx.plugin("owner/ganticode", __meta, async function () {
  return require("../../lib/ext/plugins/e1/owner/ganticode.js")
})
