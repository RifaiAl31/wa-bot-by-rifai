// group/groupadmin — satu file: metadata + kode fitur (gabungan dari engine1/plugins/group/groupadmin.js)
const __vx = require("../../lib/adapter/e1.js")
const __meta = {
  "name": "groupadmin",
  "command": [
    "groupadmin",
    "gadmin",
    "adminlock",
    "onlygroupadmin"
  ],
  "category": "group",
  "desc": "Batasi akses bot hanya untuk admin (per grup)",
  "usage": ".groupadmin on/off",
  "owner": false,
  "group": true,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/group").split('\\').join('/')
module.exports = __vx.plugin("group/groupadmin", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/groupadmin.js'
  const module = { exports: {} }; const exports = module.exports;
  const { getDatabase } = require("../../lib/ext/src/lib/database.js")
  
  const pluginConfig = {
      name: 'groupadmin',
      alias: ['gadmin', 'adminlock', 'onlygroupadmin'],
      category: 'group',
      description: 'Batasi akses bot hanya untuk admin (per grup)',
      usage: '.groupadmin on/off',
      example: '.groupadmin on',
      isOwner: false,
      isAdmin: true,
      isGroup: true,
      cooldown: 5,
      energi: 0,
      isEnabled: true
  }
  
  async function handler(m) {
      const db = getDatabase()
      const args = m.args || []
      const cmd = args[0]?.toLowerCase()
  
      const groupData = db.getGroup(m.chat) || {}
      const current = groupData.groupAdmin || false
  
      // 🌸 STATUS
      if (!cmd) {
          return m.reply(
  `🔒 *ɢʀᴏᴜᴘᴀᴅᴍɪɴ*
  
  > Status: ${current ? '✅ Aktif' : '❌ Nonaktif'}
  
  *Akses saat aktif:*
  ✔️ Admin grup
  ✔️ Owner bot
  ❌ Member biasa
  
  *Gunakan:*
  > .groupadmin on
  > .groupadmin off`
          )
      }
  
      // 🌸 ON
      if (cmd === 'on') {
          if (current) return m.reply('⚠️ *Eh eh~* Sudah aktif~ 🌸')
  
          db.setGroup(m.chat, { groupAdmin: true })
          m.react('🔒')
  
          return m.reply(
  `🔒 *ɢʀᴏᴜᴘᴀᴅᴍɪɴ ᴀᴋᴛɪꜰ*
  
  ╭┈┈⬡「 🔐 *ᴀᴋsᴇs* 」
  ┃ ✅ Admin grup
  ┃ ✅ Owner bot
  ┃ ❌ Member biasa
  ╰┈┈⬡`
          )
      }
  
      // 🌸 OFF
      if (cmd === 'off') {
          if (!current) return m.reply('⚠️ *Eh eh~* Sudah nonaktif~ 🌸')
  
          db.setGroup(m.chat, { groupAdmin: false })
          m.react('🔓')
  
          return m.reply(
  `🔓 *ɢʀᴏᴜᴘᴀᴅᴍɪɴ ɴᴏɴᴀᴋᴛɪꜰ*
  
  > Semua member bisa pakai bot`
          )
      }
  
      return m.reply('❌ *Ehh~* Gunakan: on / off~ 🥺')
  }
  
  module.exports = {
      config: pluginConfig,
      handler
  }
  return module.exports
})
