// Adapter engine 8 — fitur tambahan (inti di engine/engine8/plugins/<kategori>/<nama>.js), memakai adapter engine3
// (m bergaya WhatsApp Bot, sock tambahan, limit/energi, cooldown, database) tetapi memuat kode dari folder engine8.
'use strict'
const path = require('path')
const e3 = require("./e3.js")
const tag = require("./rank.js")
const RANK = 10 // setelah semua fitur asli dan engine lain: tidak pernah menimpa command yang sudah ada
module.exports = {
  plugin: tag(RANK, (rel, meta, thunk) => e3.plugin(rel, meta, thunk, 'engine8')),
  hook: tag(RANK, (items) => e3.hook(items, 'engine8')),
  module: (rel, thunk) => require('./modreg.js').moduleOnly('engine8', rel, thunk)
}
