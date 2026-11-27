// fitur tambahan WhatsApp Bot (group/poll)
module.exports = require('../../lib/adapter/e9.js').plugin("group/poll", {"command":["pollhasil","pollstop"],"category":"group","desc":"Fitur poll","usage":".pollhasil","group":true})
