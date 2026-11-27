// fitur tambahan WhatsApp Bot (owner/send)
module.exports = require('../../lib/adapter/e9.js').plugin("owner/send", {"command":["send","sendvn"],"category":"owner","desc":"Fitur send <nomor>|<pesan>","usage":".send","owner":true})
