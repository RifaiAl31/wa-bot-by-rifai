// group/notifclosegroup — satu file: metadata + kode fitur (gabungan dari engine3/plugins/group/notifclosegroup.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "notifclosegroup",
  "command": [
    "notifclosegroup",
    "notifclose"
  ],
  "category": "group",
  "desc": "Toggle notifikasi saat grup ditutup",
  "usage": ".notifclosegroup on/off",
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
module.exports = __vx.plugin("group/notifclosegroup", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/notifclosegroup.js'
  const __vxExports = {};
  const pluginConfig = {
      name: 'notifclosegroup',
      alias: ['notifclose'],
      category: 'group',
      description: 'Toggle notifikasi saat grup ditutup',
      usage: '.notifclosegroup on/off',
      example: '.notifclosegroup on',
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
          const status = group.notifCloseGroup === true ? '✅ Aktif' : '❌ Nonaktif'
          return m.reply(`🔒 *ɴᴏᴛɪꜰ ᴄʟᴏsᴇ ɢʀᴏᴜᴘ*\n\n> Status: ${status}\n\n*Penggunaan:*\n\`${m.prefix}notifclosegroup on\` - Aktifkan\n\`${m.prefix}notifclosegroup off\` - Nonaktifkan`)
      }
      
      if (args === 'on') {
          group.notifCloseGroup = true
          db.setGroup(m.chat, group)
          return m.reply(`✅ *ɴᴏᴛɪꜰ ᴄʟᴏsᴇ ɢʀᴏᴜᴘ ᴅɪᴀᴋᴛɪꜰᴋᴀɴ*`)
      }
      
      if (args === 'off') {
          group.notifCloseGroup = false
          db.setGroup(m.chat, group)
          return m.reply(`❌ *ɴᴏᴛɪꜰ ᴄʟᴏsᴇ ɢʀᴏᴜᴘ ᴅɪɴᴏɴᴀᴋᴛɪꜰᴋᴀɴ*`)
      }
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
