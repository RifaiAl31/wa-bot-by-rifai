// owner/delfile — satu file: metadata + kode fitur (gabungan dari engine1/plugins/owner/delfile.js)
const __vx = require("../../lib/adapter/e1.js")
const __meta = {
  "name": "delfile",
  "command": [
    "delfile",
    "deletefile",
    "hapusfile",
    "removefile"
  ],
  "category": "owner",
  "desc": "Hapus file dari server via path (backup otomatis sebelum dihapus)",
  "usage": ".delfile <path>",
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
module.exports = __vx.plugin("owner/delfile", __meta, async function () {
  return require("../../lib/ext/plugins/e1/owner/delfile.js")
})
