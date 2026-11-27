// group/autoforward — satu file: metadata + kode fitur (gabungan dari engine3/plugins/group/autoforward.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "autoforward",
  "command": [
    "autoforward",
    "autofw",
    "autofwd"
  ],
  "category": "group",
  "desc": "Auto forward pesan yang masuk ke grup ke grup ini",
  "usage": ".autoforward <on/off>",
  "owner": false,
  "group": true,
  "private": false,
  "premium": false,
  "admin": true,
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
module.exports = __vx.plugin("group/autoforward", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/autoforward.js'
  const __vxExports = {};
  const { getDatabase } = require("../../lib/ext/src/lib/vanxone-database.js");
  const pluginConfig = {
      name: 'autoforward',
      alias: ['autofw', 'autofwd'],
      category: 'group',
      description: 'Auto forward pesan yang masuk ke grup ke grup ini',
      usage: '.autoforward <on/off>',
      example: '.autoforward on',
      isOwner: false,
      isPremium: false,
      isGroup: true,
      isPrivate: false,
      isAdmin: true,
      cooldown: 5,
      energi: 0,
      isEnabled: true
  }
  
  function handler(m, { sock }) {
      const db = getDatabase()
      const option = m.text?.toLowerCase()?.trim()
      const groupId = m.chat
      const group = db.getGroup(groupId) || {}
      
      if (!option) {
          const status = group.autoforward ? '✅ ON' : '❌ OFF'
          return m.reply(
              `🔄 *ᴀᴜᴛᴏ ꜰᴏʀᴡᴀʀᴅ*\n\n` +
              `╭┈┈⬡「 📋 *ɪɴꜰᴏ* 」\n` +
              `┃ ◦ Status: *${status}*\n` +
              `╰┈┈⬡\n\n` +
              `> Gunakan: \`${m.prefix}autoforward on/off\`\n\n` +
              `_Fitur ini akan meneruskan semua pesan ke grup ini_`
          )
      }
      
      if (option === 'on') {
          db.setGroup(groupId, { ...group, autoforward: true })
          m.react('✅')
          return m.reply(
              `🔄 *ᴀᴜᴛᴏ ꜰᴏʀᴡᴀʀᴅ*\n\n` +
              `╭┈┈⬡「 ✅ *ᴀᴋᴛɪꜰ* 」\n` +
              `┃ ◦ Status: *ON*\n` +
              `╰┈┈⬡\n\n` +
              `> _Semua pesan akan di-forward_`
          )
      }
      
      if (option === 'off') {
          db.setGroup(groupId, { ...group, autoforward: false })
          m.react('❌')
          return m.reply(
              `🔄 *ᴀᴜᴛᴏ ꜰᴏʀᴡᴀʀᴅ*\n\n` +
              `╭┈┈⬡「 ❌ *ɴᴏɴᴀᴋᴛɪꜰ* 」\n` +
              `┃ ◦ Status: *OFF*\n` +
              `╰┈┈⬡`
          )
      }
      
      return m.reply(`❌ Gunakan: on atau off`)
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
