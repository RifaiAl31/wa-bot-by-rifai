// fitur tambahan WhatsApp Bot (owner/chatmode)
module.exports = require('../../lib/adapter/e9.js').plugin("owner/chatmode", {"command":["chatmode","gconly","pconly"],"category":"owner","desc":"Fitur chatmode pconly on/off","usage":".chatmode","owner":true})
