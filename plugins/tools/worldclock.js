// fitur tambahan WhatsApp Bot (asisten/worldclock)
module.exports = require('../../lib/adapter/e9.js').plugin("asisten/worldclock", {"command":["worldclock","jam","jamdunia","konversijam","zonawaktu"],"category":"tools","desc":"Jam dunia (.jam [kota]) dan konversi jam antar kota (.konversijam 15:00 jakarta tokyo)","usage":".worldclock"})
