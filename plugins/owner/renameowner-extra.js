// owner/renameowner — satu file: metadata + kode fitur (gabungan dari engine1/plugins/owner/renameowner.js)
const __vx = require("../../lib/adapter/e1.js")
const __meta = {
  "name": "ownername",
  "command": [
    "ownername",
    "renameowner"
  ],
  "category": "owner",
  "desc": "Ganti nama owner yang tampil di bot",
  "usage": ".ownername",
  "owner": true,
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
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/owner").split('\\').join('/')
module.exports = __vx.plugin("owner/renameowner", __meta, async function () {
  return require("../../lib/ext/plugins/e1/owner/renameowner.js")
})
