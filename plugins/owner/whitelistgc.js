// owner/whitelistgc — satu file: metadata + kode fitur (gabungan dari engine1/plugins/owner/whitelistgc.js)
const __vx = require("../../lib/adapter/e1.js")
const __meta = {
  "name": "whitelistgc",
  "command": [
    "whitelistgc",
    "wlgc",
    "unwhitelistgc",
    "unwlgc",
    "listwhitelistgc",
    "listwlgc",
    "whitelistmode"
  ],
  "category": "owner",
  "desc": "Mode whitelist — bot hanya aktif di grup yang didaftarkan",
  "usage": ".whitelistgc <id> | .unwhitelistgc <id> | .listwlgc | .whitelistmode on/off",
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
module.exports = __vx.plugin("owner/whitelistgc", __meta, async function () {
  return require("../../lib/ext/plugins/e1/owner/whitelistgc.js")
})
