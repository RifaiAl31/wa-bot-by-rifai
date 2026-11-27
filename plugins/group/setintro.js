// group/setintro — satu file: metadata + kode fitur (gabungan dari engine3/plugins/group/setintro.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "setintro",
  "command": [
    "setperkenalan",
    "introset"
  ],
  "category": "group",
  "desc": "Set pesan intro grup (admin only)",
  "usage": ".setintro <pesan>",
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
module.exports = __vx.plugin("group/setintro", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/setintro.js'
  const __vxExports = {};
  const { getDatabase } = require("../../lib/ext/src/lib/vanxone-database.js");
  const pluginConfig = {
      name: 'setintro',
      alias: ['setperkenalan', 'introset'],
      category: 'group',
      description: 'Set pesan intro grup (admin only)',
      usage: '.setintro <pesan>',
      example: '.setintro Selamat datang @user di @group!',
      isOwner: false,
      isPremium: false,
      isGroup: true,
      isPrivate: false,
      cooldown: 10,
      energi: 0,
      isEnabled: true,
      isAdmin: true
  }
  
  async function handler(m) {
      const db = getDatabase()
      const introText = m.fullArgs?.trim() || m.text?.trim()
      
      if (!introText) {
          return m.reply(
              `📝 *sᴇᴛ ɪɴᴛʀᴏ*\n\n` +
              `> Masukkan pesan intro!\n\n` +
              `*Placeholder yang tersedia:*\n` +
              `> @user - Nama pengguna\n` +
              `> @group - Nama grup\n` +
              `> @count - Jumlah member\n` +
              `> @date - Tanggal hari ini\n` +
              `> @time - Waktu sekarang\n` +
              `> @desc - Deskripsi grup\n` +
              `> @botname - Nama bot\n\n` +
              `*Contoh:*\n` +
              `> .setintro Selamat datang @user di grup @group! 👋`
          )
      }
      
      const groupData = db.getGroup(m.chat) || db.setGroup(m.chat)
      groupData.intro = introText
      db.setGroup(m.chat, groupData)
      db.save()
      
      await m.reply(
          `✅ *ɪɴᴛʀᴏ ᴅɪsᴀᴠᴇ!*\n` +
          `Pesan intro grup berhasil diubah.\n` +
          `Ketik *${m.prefix}intro* untuk melihat hasilnya.`
      )
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
