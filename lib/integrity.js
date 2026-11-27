// =====================================================================
//  lib/integrity.js — versi tanpa kunci
//
//  Pengecekan hash dinonaktifkan, jadi lib/autojoin.js (dan file lain)
//  bebas diubah oleh siapa saja tanpa membuat bot berhenti.
//
//  Fungsi check() dan hashOf() tetap diekspor agar file lain yang
//  memanggilnya (mis. require('./integrity').check()) tidak error.
//
//  Developer asli: WhatsApp Bot
// =====================================================================
'use strict'

const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

const TARGET = path.join(__dirname, 'autojoin.js')

const hashOf = () => {
  try {
    return crypto.createHash('sha256').update(fs.readFileSync(TARGET, 'utf8').replace(/\r\n?/g, '\n')).digest('hex')
  } catch {
    return null
  }
}

// Selalu lolos: tidak ada lagi pengecekan atau process.exit
function check() {
  return true
}

if (require.main === module) {
  console.log('Penguncian dinonaktifkan: autojoin.js bebas diubah.')
}

module.exports = { check, hashOf }
