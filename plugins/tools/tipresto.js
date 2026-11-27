// fitur tambahan WhatsApp Bot (asisten/tipresto)
module.exports = require('../../lib/adapter/e9.js').plugin("asisten/tipresto", {"command":["tipresto"],"category":"tools","desc":"Hitung tagihan restoran: service charge + pajak, dibagi per orang","usage":".tipresto"})
