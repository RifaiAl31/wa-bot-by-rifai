// pushkontak/pushkontak — satu file: metadata + kode fitur (gabungan dari engine7/plugins/pushkontak/pushkontak.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "pushkontak",
  "command": [
    "pushkontak",
    "puskontak",
    "push",
    "stoppush",
    "setjedapush",
    "pushkontak_start",
    "kelolapush",
    "autovcf_on",
    "autovcf_off",
    "kodeunik_on",
    "kodeunik_off",
    "vcftarget_private",
    "vcftarget_group",
    "skipadmin_on",
    "skipadmin_off"
  ],
  "category": "broadcast",
  "desc": "Push pesan ke semua member grup + auto simpan kontak VCF",
  "usage": ".pushkontak",
  "owner": true,
  "group": true,
  "private": false,
  "premium": false,
  "cooldown": 10,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/pushkontak").split('\\').join('/')
module.exports = __vx.plugin("pushkontak/pushkontak", __meta, async function () {
  return require("../../lib/ext/plugins/e7/pushkontak/pushkontak.js")
})
