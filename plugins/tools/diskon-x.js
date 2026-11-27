// fitur tambahan WhatsApp Bot (asisten/diskon)
module.exports = require('../../lib/adapter/e9.js').plugin("asisten/diskon", {"command":["diskon"],"category":"tools","desc":"Hitung harga setelah diskon (bisa bertingkat, mis. 50+20) dan PPN","usage":".diskon"})
