// owner/dellalluser — satu file: metadata + kode fitur (gabungan dari engine7/plugins/owner/dellalluser.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "deluserall",
  "command": [
    "deluserall",
    "deletealluser",
    "hapussemua",
    "delalluser",
    "resetuser",
    "clearuser"
  ],
  "category": "owner",
  "desc": "Hapus SEMUA user dari database (LANGSUNG HAPUS)",
  "usage": ".deluserall",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 10,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/owner").split('\\').join('/')
module.exports = __vx.plugin("owner/dellalluser", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/dellalluser.js'
  const __vxExports = {};
  const { getDatabase } = require("../../lib/ext/src/lib/vanxone-database.e4.js");
  
  const pluginConfig = {
      name: 'deluserall',
      alias: ['deletealluser', 'hapussemua', 'delalluser', 'resetuser', 'clearuser'],
      category: 'owner',
      description: 'Hapus SEMUA user dari database (LANGSUNG HAPUS)',
      usage: '.deluserall',
      example: '.deluserall',
      isOwner: true,
      cooldown: 10,
      isEnabled: true
  }
  
  async function handler(m) {
      const db = getDatabase()
      
      const users = Object.entries(db.data.users || {})
      
      if (users.length === 0) {
          return m.reply(`❌ *Tidak ada user di database*\n\n> Database user sudah kosong, Darling~`)
      }
  
      const totalUsers = users.length
      let totalKoin = 0
      let totalEnergi = 0
      let totalExp = 0
  
      for (const [jid, user] of users) {
          totalKoin += user.koin || 0
          totalEnergi += user.energi || 0
          totalExp += user.exp || 0
      }
  
      // LANGSUNG HAPUS SEMUA
      db.data.users = {}
      db.save()
  
      let txt = `╭━━━〔 💀 *WhatsApp Bot ᴍᴀꜱꜱ ᴅᴇʟᴇᴛᴇ* 💀 〕━━━⬣
  │
  │  ✅ *SEMUA USER BERHASIL DIHAPUS!*
  │
  │  📊 *ꜱᴛᴀᴛɪꜱᴛɪᴋ*
  │  ├ 👥 User terhapus : *${totalUsers}*
  │  ├ 💰 Total Koin   : *${totalKoin.toLocaleString('id-ID')}*
  │  ├ ⚡ Total Energi  : *${totalEnergi.toLocaleString('id-ID')}*
  │  └ 📈 Total Exp     : *${totalExp.toLocaleString('id-ID')}*
  │
  │  🩸 *Darling, database user kini kosong.*
  │  🩸 *Semua data telah lenyap...*
  │
  │  💀 *Ketik .daftar untuk registrasi ulang*
  │
  ╰━━━━━━━━━━━━━━━━━━━━━━━⬣`
  
      await m.reply(txt)
  }
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
