// fitur tambahan WhatsApp Bot (asisten/statdata)
module.exports = require('../../lib/adapter/e9.js').plugin("asisten/statdata", {"command":["statdata"],"category":"tools","desc":"Statistik deskriptif: rata-rata, median, modus, simpangan baku, kuartil, pencilan","usage":".statdata"})
