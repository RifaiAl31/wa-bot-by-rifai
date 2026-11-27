// group/notifpromote — satu file: metadata + kode fitur (gabungan dari engine3/plugins/group/notifpromote.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "notifpromote",
  "command": [
    "notifpromote"
  ],
  "category": "group",
  "desc": "Toggle notifikasi saat ada yang dijadikan admin",
  "usage": ".notifpromote on/off",
  "owner": false,
  "group": true,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/group").split('\\').join('/')
module.exports = __vx.plugin("group/notifpromote", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/notifpromote.js'
  const __vxExports = {};
  const pluginConfig = {
      name: 'notifpromote',
      alias: [],
      category: 'group',
      description: 'Toggle notifikasi saat ada yang dijadikan admin',
      usage: '.notifpromote on/off',
      example: '.notifpromote on',
      isOwner: false,
      isPremium: false,
      isGroup: true,
      isPrivate: false,
      cooldown: 5,
      energi: 0,
      isEnabled: true
  }
  
  function handler(m, { sock, db }) {
      if (!m.isAdmin && !m.isOwner) {
          return m.reply(`❌ Hanya admin grup yang bisa menggunakan fitur ini`)
      }
      
      const args = m.args[0]?.toLowerCase()
      const group = db.getGroup(m.chat) || {}
      
      if (!['on', 'off'].includes(args)) {
          const status = group.notifPromote === true ? '✅ Aktif' : '❌ Nonaktif'
          return m.reply(`👑 *ɴᴏᴛɪꜰ ᴘʀᴏᴍᴏᴛᴇ*\n\n> Status: ${status}\n\n*Penggunaan:*\n\`${m.prefix}notifpromote on\` - Aktifkan\n\`${m.prefix}notifpromote off\` - Nonaktifkan`)
      }
      
      if (args === 'on') {
          group.notifPromote = true
          db.setGroup(m.chat, group)
          return m.reply(`✅ *ɴᴏᴛɪꜰ ᴘʀᴏᴍᴏᴛᴇ ᴅɪᴀᴋᴛɪꜰᴋᴀɴ*`)
      }
      
      if (args === 'off') {
          group.notifPromote = false
          db.setGroup(m.chat, group)
          return m.reply(`❌ *ɴᴏᴛɪꜰ ᴘʀᴏᴍᴏᴛᴇ ᴅɪɴᴏɴᴀᴋᴛɪꜰᴋᴀɴ*`)
      }
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
