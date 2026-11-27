// fitur tambahan WhatsApp Bot (asisten/sandi)
module.exports = require('../../lib/adapter/e9.js').plugin("asisten/sandi", {"command":["sandi","encode","decode","enkripsi","dekripsi"],"category":"tools","desc":"Encode/decode teks: base64, hex, biner, url, rot13, caesar, balik","usage":".sandi"})
