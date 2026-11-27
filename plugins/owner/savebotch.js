// owner/savebotch — satu file: metadata + kode fitur (gabungan dari engine1/plugins/owner/savebotch.js)
const __vx = require("../../lib/adapter/e1.js")
const __meta = {
  "name": "savebotch",
  "command": [
    "savebotch",
    "sbc",
    "wlchannel",
    "channelwl"
  ],
  "category": "owner",
  "desc": "Daftarkan saluran (channel) tertentu supaya bot bisa dipakai di situ walau mode onlygc aktif, plus opsi owner-only per saluran",
  "usage": ".savebotch <add/del/list/ownerOnly> [jid/link saluran] [on/off]",
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
module.exports = __vx.plugin("owner/savebotch", __meta, async function () {
  return require("../../lib/ext/plugins/e1/owner/savebotch.js")
})
