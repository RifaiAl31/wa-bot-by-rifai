// group/resetwelcome — satu file: metadata + kode fitur (gabungan dari engine3/plugins/group/resetwelcome.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "resetwelcome",
  "command": [
    "resetwelcome",
    "delwelcome",
    "clearwelcome"
  ],
  "category": "group",
  "desc": "Reset welcome message ke default",
  "usage": ".resetwelcome",
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
module.exports = __vx.plugin("group/resetwelcome", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/resetwelcome.js'
  const __vxExports = {};
  const { getDatabase } = require("../../lib/ext/src/lib/vanxone-database.js");
  const pluginConfig = {
      name: 'resetwelcome',
      alias: ['delwelcome', 'clearwelcome'],
      category: 'group',
      description: 'Reset welcome message ke default',
      usage: '.resetwelcome',
      example: '.resetwelcome',
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
      
      if (!groupData?.welcomeMsg) {
          return m.reply(`❌ *ɢᴀɢᴀʟ*\n\n> Welcome message sudah default`)
      }
      
      db.setGroup(m.chat, { welcomeMsg: null })
      
      m.react('✅')
      
      await m.reply(`✅ *ᴡᴇʟᴄᴏᴍᴇ ᴅɪʀᴇsᴇᴛ*\n\n> Kembali ke pesan default`)
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
