// fitur tambahan WhatsApp Bot (asisten/bandingharga)
module.exports = require('../../lib/adapter/e9.js').plugin("asisten/bandingharga", {"command":["bandingharga"],"category":"tools","desc":"Bandingkan harga per satuan (per 100 gram/ml/pcs) untuk cari yang paling hemat","usage":".bandingharga"})
