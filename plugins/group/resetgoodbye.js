// group/resetgoodbye — satu file: metadata + kode fitur (gabungan dari engine3/plugins/group/resetgoodbye.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "resetgoodbye",
  "command": [
    "resetgoodbye",
    "delgoodbye",
    "cleargoodbye"
  ],
  "category": "group",
  "desc": "Reset goodbye message ke default",
  "usage": ".resetgoodbye",
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
module.exports = __vx.plugin("group/resetgoodbye", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/resetgoodbye.js'
  const __vxExports = {};
  const { getDatabase } = require("../../lib/ext/src/lib/vanxone-database.js");
  const pluginConfig = {
      name: 'resetgoodbye',
      alias: ['delgoodbye', 'cleargoodbye'],
      category: 'group',
      description: 'Reset goodbye message ke default',
      usage: '.resetgoodbye',
      example: '.resetgoodbye',
      isOwner: false,
      isPremium: false,
      isGroup: true,
      isPrivate: false,
      isAdmin: true,
      cooldown: 5,
      energi: 0,
      isEnabled: true
  }
  
  async function handler(m, { sock }) {
      const db = getDatabase()
      const groupData = db.getGroup(m.chat)
      
      if (!groupData?.goodbyeMsg) {
          return m.reply(`❌ *ɢᴀɢᴀʟ*\n\n> Goodbye message sudah default`)
      }
      
      db.setGroup(m.chat, { goodbyeMsg: null })
      
      m.react('✅')
      
      await m.reply(`✅ *ɢᴏᴏᴅʙʏᴇ ᴅɪʀᴇsᴇᴛ*\nKembali ke pesan default`)
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
