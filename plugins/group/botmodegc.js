// group/botmodegc — satu file: metadata + kode fitur (gabungan dari engine1/plugins/group/botmodegc.js)
const __vx = require("../../lib/adapter/e1.js")
const __meta = {
  "name": "botmodegc",
  "command": [
    "botmodegc",
    "setmodegc",
    "modegc"
  ],
  "category": "group",
  "desc": "Atur mode bot untuk grup ini",
  "usage": ".botmode <md/pushkontak/otp>",
  "owner": false,
  "group": true,
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
module.exports = __vx.plugin("group/botmodegc", __meta, async function () {
  return require("../../lib/ext/plugins/e1/group/botmodegc.js")
})
