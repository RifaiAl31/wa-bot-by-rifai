// group/hapusabsen — satu file: metadata + kode fitur (gabungan dari engine3/plugins/group/hapusabsen.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "hapusabsen",
  "command": [
    "hapusabsen",
    "deleteabsen",
    "tutupabsen",
    "closeabsen",
    "resetabsen"
  ],
  "category": "group",
  "desc": "Hapus/tutup sesi absen (admin only)",
  "usage": ".hapusabsen",
  "owner": false,
  "group": true,
  "private": false,
  "premium": false,
  "admin": true,
  "botAdmin": false,
  "cooldown": 10,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/group").split('\\').join('/')
module.exports = __vx.plugin("group/hapusabsen", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/hapusabsen.js'
  const __vxExports = {};
  const pluginConfig = {
      name: 'hapusabsen',
      alias: ['deleteabsen', 'tutupabsen', 'closeabsen', 'resetabsen'],
      category: 'group',
      description: 'Hapus/tutup sesi absen (admin only)',
      usage: '.hapusabsen',
      example: '.hapusabsen',
      isOwner: false,
      isPremium: false,
      isGroup: true,
      isPrivate: false,
      cooldown: 10,
      energi: 0,
      isEnabled: true,
      isAdmin: true
  }
  
  if (!global.absensi) global.absensi = {}
  
  async function handler(m) {
      const chatId = m.chat
      
      if (!global.absensi[chatId]) {
          return m.reply(
              `❌ *ᴛɪᴅᴀᴋ ᴀᴅᴀ ᴀʙsᴇɴ*\n\n` +
              `> Tidak ada sesi absen di grup ini!`
          )
      }
      
      const absen = global.absensi[chatId]
      const totalPeserta = absen.peserta.length
      
      delete global.absensi[chatId]
      
      await m.reply(
          `✅ *ABSEN DITUTUP!*\n\n` +
          `Penyebab?\n` +
          `📝 ${absen.keterangan}\n` +
          `👥 Total hadir: ${totalPeserta}\n\n` +
          `Sesi absen telah dihapus.`
      )
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
