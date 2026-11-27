// group/antitoxic — satu file: metadata + kode fitur (gabungan dari engine3/plugins/group/antitoxic.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "toxic",
  "command": [
    "toxic",
    "antitoxik"
  ],
  "category": "group",
  "desc": "Anti kata toxic di grup (on/off)",
  "usage": ".toxic",
  "owner": false,
  "group": true,
  "admin": true,
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
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/group").split('\\').join('/')
module.exports = __vx.plugin("group/antitoxic", __meta, async function () {
  return require("../../lib/ext/plugins/e3/group/antitoxic.js")
})
