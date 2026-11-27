// owner/welcomeall — satu file: metadata + kode fitur (gabungan dari engine3/plugins/owner/welcomeall.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "welcomeall",
  "command": [
    "welcomeall",
    "wcall",
    "globalwelcome"
  ],
  "category": "owner",
  "desc": "Aktifkan/nonaktifkan welcome di semua grup",
  "usage": ".welcomeall <on/off>",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 10,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/owner").split('\\').join('/')
module.exports = __vx.plugin("owner/welcomeall", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/welcomeall.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const { getDatabase } = require("../../lib/ext/src/lib/vanxone-database.js");
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.js"));
  const pluginConfig = {
      name: 'welcomeall',
      alias: ['wcall', 'globalwelcome'],
      category: 'owner',
      description: 'Aktifkan/nonaktifkan welcome di semua grup',
      usage: '.welcomeall <on/off>',
      example: '.welcomeall on',
      isOwner: true,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 10,
      energi: 0,
      isEnabled: true
  }
  
  async function handler(m, { sock }) {
      const db = getDatabase()
      const args = m.args || []
      const action = args[0]?.toLowerCase()
      
      if (!action || !['on', 'off'].includes(action)) {
          return m.reply(
              `👋 *ᴡᴇʟᴄᴏᴍᴇ ɢʟᴏʙᴀʟ*\n\n` +
              `> Aktifkan/nonaktifkan welcome di SEMUA grup sekaligus\n\n` +
              `╭┈┈⬡「 📋 *ᴄᴀʀᴀ ᴘᴀᴋᴀɪ* 」\n` +
              `┃ ${m.prefix}welcomeall on\n` +
              `┃ ${m.prefix}welcomeall off\n` +
              `╰┈┈┈┈┈┈┈┈⬡`
          )
      }
      
      await m.react('🕕')
      
      try {
          const groups = await sock.groupFetchAllParticipating()
          const groupIds = Object.keys(groups)
          const status = action === 'on'
          let count = 0
          
          for (const groupId of groupIds) {
              db.setGroup(groupId, { welcome: status })
              count++
          }
          
          await m.react('✅')
          
          if (status) {
              return m.reply(
                  `✅ *ᴡᴇʟᴄᴏᴍᴇ ɢʟᴏʙᴀʟ ᴏɴ*\n\n` +
                  `╭┈┈⬡「 📊 *ʀᴇsᴜʟᴛ* 」\n` +
                  `┃ 🌐 Total Grup: *${count}*\n` +
                  `┃ ✅ Welcome: *AKTIF*\n` +
                  `╰┈┈┈┈┈┈┈┈⬡\n\n` +
                  `> Semua member baru akan disambut otomatis!`
              )
          } else {
              return m.reply(
                  `❌ *ᴡᴇʟᴄᴏᴍᴇ ɢʟᴏʙᴀʟ ᴏꜰꜰ*\n\n` +
                  `╭┈┈⬡「 📊 *ʀᴇsᴜʟᴛ* 」\n` +
                  `┃ 🌐 Total Grup: *${count}*\n` +
                  `┃ ❌ Welcome: *NONAKTIF*\n` +
                  `╰┈┈┈┈┈┈┈┈⬡\n\n` +
                  `> Welcome dinonaktifkan di semua grup.`
              )
          }
      } catch (error) {
          console.error('[WelcomeAll] Error:', error.message)
          await m.react('☢')
          await m.reply(te(m.prefix, m.command, m.pushName))
      }
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
