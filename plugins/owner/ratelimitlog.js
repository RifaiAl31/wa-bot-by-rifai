// owner/ratelimitlog — satu file: metadata + kode fitur (gabungan dari engine1/plugins/owner/ratelimitlog.js)
const __vx = require("../../lib/adapter/e1.js")
const __meta = {
  "name": "ratelimitlog",
  "command": [
    "ratelimitlog",
    "ratelimit",
    "rll",
    "spamlog"
  ],
  "category": "owner",
  "desc": "Monitor user yang spam command secara global, dengan auto-warning & auto-mute sementara",
  "usage": ".ratelimitlog [list|reset <user>|unmute <user>|set <maxCmd> <windowSec> <muteSec>]",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 0,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/owner").split('\\').join('/')
module.exports = __vx.plugin("owner/ratelimitlog", __meta, async function () {
  return require("../../lib/ext/plugins/e1/owner/ratelimitlog.js")
})
