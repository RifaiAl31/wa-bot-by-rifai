// fitur tambahan WhatsApp Bot (asisten/simpan)
module.exports = require('../../lib/adapter/e9.js').plugin("asisten/simpan", {"command":["simpan","ambil","daftarsimpan","hapussimpan","snippet"],"category":"tools","desc":"Simpan teks/catatan cepat: .simpan <kunci> <isi>, .ambil <kunci>, .daftarsimpan, .hapussimpan <kunci>","usage":".simpan"})
