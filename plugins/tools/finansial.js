// fitur tambahan WhatsApp Bot (asisten/finansial)
module.exports = require('../../lib/adapter/e9.js').plugin("asisten/finansial", {"command":["finansial","thr","laba","untung","labarugi"],"category":"tools","desc":"Hitung THR (sesuai masa kerja) dan laba/margin penjualan","usage":".finansial"})
