// sticker/tostickerpack — satu file: metadata + kode fitur (gabungan dari engine1/plugins/sticker/tostickerpack.js)
const __vx = require("../../lib/adapter/e1.js")
const __meta = {
  "name": "tostickerpack",
  "command": [
    "tostickerpack",
    "tospack",
    "spack",
    "tsp"
  ],
  "category": "sticker",
  "desc": "Ubah album foto yang di-reply jadi sticker pack WhatsApp",
  "usage": ".tostickerpack <nama pack> (reply ke pesan album foto)",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 10,
  "energi": 3,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/sticker").split('\\').join('/')
module.exports = __vx.plugin("sticker/tostickerpack", __meta, async function () {
  return require("../../lib/ext/plugins/e1/sticker/tostickerpack.js")
})
