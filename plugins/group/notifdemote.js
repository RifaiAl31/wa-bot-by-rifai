// group/notifdemote — satu file: metadata + kode fitur (gabungan dari engine3/plugins/group/notifdemote.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "notifdemote",
  "command": [
    "notifdemote"
  ],
  "category": "group",
  "desc": "Toggle notifikasi saat ada yang dicopot dari admin",
  "usage": ".notifdemote on/off",
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
module.exports = __vx.plugin("group/notifdemote", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/notifdemote.js'
  const __vxExports = {};
  const pluginConfig = {
      name: 'notifdemote',
      alias: [],
      category: 'group',
      description: 'Toggle notifikasi saat ada yang dicopot dari admin',
      usage: '.notifdemote on/off',
      example: '.notifdemote on',
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
          const status = group.notifDemote === true ? '✅ Aktif' : '❌ Nonaktif'
          return m.reply(`👤 *ɴᴏᴛɪꜰ ᴅᴇᴍᴏᴛᴇ*\n\n> Status: ${status}\n\n*Penggunaan:*\n\`${m.prefix}notifdemote on\` - Aktifkan\n\`${m.prefix}notifdemote off\` - Nonaktifkan`)
      }
      
      if (args === 'on') {
          group.notifDemote = true
          db.setGroup(m.chat, group)
          return m.reply(`✅ *ɴᴏᴛɪꜰ ᴅᴇᴍᴏᴛᴇ ᴅɪᴀᴋᴛɪꜰᴋᴀɴ*`)
      }
      
      if (args === 'off') {
          group.notifDemote = false
          db.setGroup(m.chat, group)
          return m.reply(`❌ *ɴᴏᴛɪꜰ ᴅᴇᴍᴏᴛᴇ ᴅɪɴᴏɴᴀᴋᴛɪꜰᴋᴀɴ*`)
      }
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
