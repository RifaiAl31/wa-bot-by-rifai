// user/levelup — satu file: metadata + kode fitur (gabungan dari engine3/plugins/user/levelup.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "levelup",
  "command": [
    "levelup",
    "lvlup",
    "levelnotif"
  ],
  "category": "profil",
  "desc": "Toggle notifikasi level up",
  "usage": ".levelup <on/off>",
  "owner": false,
  "group": false,
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
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/user").split('\\').join('/')
module.exports = __vx.plugin("user/levelup", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/levelup.js'
  const __vxExports = {};
  const { getDatabase } = require("../../lib/ext/src/lib/vanxone-database.js");
  const pluginConfig = {
      name: 'levelup',
      alias: ['lvlup', 'levelnotif'],
      category: 'user',
      description: 'Toggle notifikasi level up',
      usage: '.levelup <on/off>',
      example: '.levelup on',
      isOwner: false,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 5,
      energi: 0,
      isEnabled: true
  }
  
  function handler(m, { sock }) {
      const db = getDatabase()
      const user = db.getUser(m.sender)
      const args = m.args || []
      const sub = args[0]?.toLowerCase()
      
      if (!user.settings) user.settings = {}
      
      if (sub === 'on') {
          user.settings.levelupNotif = true
          db.save()
          return m.reply(
              `✅ *ʟᴇᴠᴇʟ ᴜᴘ ɴᴏᴛɪꜰ*\n\n` +
              `> Status: *ON* ✅\n` +
              `> Kamu akan menerima notifikasi saat naik level!`
          )
      }
      
      if (sub === 'off') {
          user.settings.levelupNotif = false
          db.save()
          return m.reply(
              `❌ *ʟᴇᴠᴇʟ ᴜᴘ ɴᴏᴛɪꜰ*\n\n` +
              `> Status: *OFF* ❌\n` +
              `> Notifikasi level up dinonaktifkan.`
          )
      }
      
      const status = user.settings.levelupNotif !== false ? 'ON ✅' : 'OFF ❌'
      return m.reply(
          `🔔 *ʟᴇᴠᴇʟ ᴜᴘ ɴᴏᴛɪꜰ*\n\n` +
          `> Status saat ini: *${status}*\n\n` +
          `╭┈┈⬡「 📋 *ᴜsᴀɢᴇ* 」\n` +
          `┃ > \`.levelup on\` - Aktifkan\n` +
          `┃ > \`.levelup off\` - Nonaktifkan\n` +
          `╰┈┈┈┈┈┈┈┈⬡`
      )
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
