// group/notifopengroup — satu file: metadata + kode fitur (gabungan dari engine3/plugins/group/notifopengroup.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "notifopengroup",
  "command": [
    "notifopengroup",
    "notifopen"
  ],
  "category": "group",
  "desc": "Toggle notifikasi saat grup dibuka",
  "usage": ".notifopengroup on/off",
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
module.exports = __vx.plugin("group/notifopengroup", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/notifopengroup.js'
  const __vxExports = {};
  const pluginConfig = {
      name: 'notifopengroup',
      alias: ['notifopen'],
      category: 'group',
      description: 'Toggle notifikasi saat grup dibuka',
      usage: '.notifopengroup on/off',
      example: '.notifopengroup on',
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
          const status = group.notifOpenGroup === true ? '✅ Aktif' : '❌ Nonaktif'
          return m.reply(`🔓 *ɴᴏᴛɪꜰ ᴏᴘᴇɴ ɢʀᴏᴜᴘ*\n\n> Status: ${status}\n\n*Penggunaan:*\n\`${m.prefix}notifopengroup on\` - Aktifkan\n\`${m.prefix}notifopengroup off\` - Nonaktifkan`)
      }
      
      if (args === 'on') {
          group.notifOpenGroup = true
          db.setGroup(m.chat, group)
          return m.reply(`✅ *ɴᴏᴛɪꜰ ᴏᴘᴇɴ ɢʀᴏᴜᴘ ᴅɪᴀᴋᴛɪꜰᴋᴀɴ*`)
      }
      
      if (args === 'off') {
          group.notifOpenGroup = false
          db.setGroup(m.chat, group)
          return m.reply(`❌ *ɴᴏᴛɪꜰ ᴏᴘᴇɴ ɢʀᴏᴜᴘ ᴅɪɴᴏɴᴀᴋᴛɪꜰᴋᴀɴ*`)
      }
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
