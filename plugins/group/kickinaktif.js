// fitur tambahan WhatsApp Bot (group/kickinaktif)
module.exports = require('../../lib/adapter/e9.js').plugin("group/kickinaktif", {"command":["kickinaktif","listinaktif"],"category":"group","desc":"Fitur listinaktif [hari]","usage":".kickinaktif","group":true,"admin":true})
