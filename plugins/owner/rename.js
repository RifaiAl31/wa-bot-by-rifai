// owner/rename — satu file: metadata + kode fitur (gabungan dari engine1/plugins/owner/rename.js)
const __vx = require("../../lib/adapter/e1.js")
const __meta = {
  "name": "rename",
  "command": [
    "renamesc",
    "gantinama"
  ],
  "category": "owner",
  "desc": "Ganti nama/teks tertentu di seluruh SC termasuk nama file",
  "usage": ".rename <teks lama>|<teks baru>",
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
module.exports = __vx.plugin("owner/rename", __meta, async function () {
  return require("../../lib/ext/plugins/e1/owner/rename.js")
})
