// owner/gantifile — satu file: metadata + kode fitur (gabungan dari engine1/plugins/owner/gantifile.js)
const __vx = require("../../lib/adapter/e1.js")
const __meta = {
  "name": "gantifile",
  "command": [
    "gantifile",
    "replacefile",
    "updatefile"
  ],
  "category": "owner",
  "desc": "Ganti file apapun di server via path",
  "usage": ".gantifile <path>",
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
module.exports = __vx.plugin("owner/gantifile", __meta, async function () {
  return require("../../lib/ext/plugins/e1/owner/gantifile.js")
})
