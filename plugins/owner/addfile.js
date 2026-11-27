// owner/addfile — satu file: metadata + kode fitur (gabungan dari engine1/plugins/owner/addfile.js)
const __vx = require("../../lib/adapter/e1.js")
const __meta = {
  "name": "addfile",
  "command": [
    "addfile",
    "newfile",
    "buatfile"
  ],
  "category": "owner",
  "desc": "Tambah file baru di server via path (gagal kalau file sudah ada)",
  "usage": ".addfile <path>",
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
module.exports = __vx.plugin("owner/addfile", __meta, async function () {
  return require("../../lib/ext/plugins/e1/owner/addfile.js")
})
