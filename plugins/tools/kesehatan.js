// fitur tambahan WhatsApp Bot (asisten/kesehatan)
module.exports = require('../../lib/adapter/e9.js').plugin("asisten/kesehatan", {"command":["kesehatan","bmi","air","tdee","detak","tidur","kalori"],"category":"tools","desc":"Kesehatan: bmi, kebutuhan air, tdee, zona detak jantung, jam tidur ideal","usage":".kesehatan"})
