// fitur tambahan WhatsApp Bot (owner/backupdb)
module.exports = require('../../lib/adapter/e9.js').plugin("owner/backupdb", {"command":["delbackup","getbackup","listbackup","restoredb","setbackup"],"category":"owner","desc":"Fitur backupdb","usage":".delbackup","owner":true})
