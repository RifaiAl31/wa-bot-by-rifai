// rpg/idolku — satu file: metadata + kode fitur (gabungan dari engine1/plugins/rpg/idolku.js)
const __vx = require("../../lib/adapter/e1.js")
const __meta = {
  "name": "idolku",
  "command": [
    "idolku",
    "oshi",
    "panggung",
    "karirai"
  ],
  "category": "rpg",
  "desc": "Karir idol ala WhatsApp Bot — stage, rank, showdown, dan lainnya",
  "usage": ".idolku <profile/stage/rank/showdown/help>",
  "owner": false,
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
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/rpg").split('\\').join('/')
module.exports = __vx.plugin("rpg/idolku", __meta, async function () {
  return require("../../lib/ext/plugins/e1/rpg/idolku.js")
})
