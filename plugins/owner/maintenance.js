// owner/maintenance — satu file: metadata + kode fitur (gabungan dari engine1/plugins/owner/maintenance.js)
const __vx = require("../../lib/adapter/e1.js")
const __meta = {
  "name": "maintenance",
  "command": ["maintenance", "matiin", "nyalain", "setmaintenance"],
  "category": "owner",
  "desc": "Mode maintenance — bot hanya respon owner, user lain dapat pesan custom",
  "usage": ".maintenance on/off [pesan] | .cekstatus",
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
module.exports = __vx.plugin("owner/maintenance", __meta, async function () {
  return require("../../lib/ext/plugins/e1/owner/maintenance.js")
})
