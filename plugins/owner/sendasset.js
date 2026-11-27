// owner/sendasset — satu file: metadata + kode fitur (gabungan dari engine1/plugins/owner/sendasset.js)
const __vx = require("../../lib/adapter/e1.js")
const __meta = {
  "name": "sendasset",
  "command": [
    "sendasset",
    "assetbrowser",
    "sendassets",
    "browseasset"
  ],
  "category": "owner",
  "desc": "Asset browser & sender — lihat/kirim aset dari URL di config.assets",
  "usage": ".sendasset [grup] [nama-aset] [--url]",
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
module.exports = __vx.plugin("owner/sendasset", __meta, async function () {
  return require("../../lib/ext/plugins/e1/owner/sendasset.js")
})
