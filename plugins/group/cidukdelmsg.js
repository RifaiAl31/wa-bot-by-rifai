// group/cidukdelmsg — satu file: metadata + kode fitur (gabungan dari engine1/plugins/group/cidukdelmsg.js)
const __vx = require("../../lib/adapter/e1.js")
const __meta = {
  "name": "cidukdelmsg",
  "command": [
    "cidukdelmsg",
    "ciduk"
  ],
  "category": "group",
  "desc": "Ciduk user yang hapus pesan! Bot kirim stiker kalau ada pesan dihapus di grup.",
  "usage": ".cidukdelmsg <on/off/add/list>",
  "owner": false,
  "group": true,
  "private": false,
  "premium": false,
  "cooldown": 3,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/group").split('\\').join('/')
module.exports = __vx.plugin("group/cidukdelmsg", __meta, async function () {
  return require("../../lib/ext/plugins/e1/group/cidukdelmsg.js")
})
