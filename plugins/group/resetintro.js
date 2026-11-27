// group/resetintro — satu file: metadata + kode fitur (gabungan dari engine3/plugins/group/resetintro.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "resetintro",
  "command": [
    "resetintro",
    "introdel",
    "deleteintro"
  ],
  "category": "group",
  "desc": "Reset intro grup ke default (admin only)",
  "usage": ".resetintro",
  "owner": false,
  "group": true,
  "private": false,
  "premium": false,
  "admin": true,
  "botAdmin": false,
  "cooldown": 10,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/group").split('\\').join('/')
module.exports = __vx.plugin("group/resetintro", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/resetintro.js'
  const __vxExports = {};
  const { getDatabase } = require("../../lib/ext/src/lib/vanxone-database.js");
  const { DEFAULT_INTRO } = require("../../lib/ext/plugins/e3/group/intro.js");
  const pluginConfig = {
      name: 'resetintro',
      alias: ['introdel', 'delintro', 'deleteintro'],
      category: 'group',
      description: 'Reset intro grup ke default (admin only)',
      usage: '.resetintro',
      example: '.resetintro',
      isOwner: false,
      isPremium: false,
      isGroup: true,
      isPrivate: false,
      cooldown: 10,
      energi: 0,
      isEnabled: true,
      isAdmin: true
  }
  
  async function handler(m) {
      const db = getDatabase()
      const groupData = db.getGroup(m.chat) || db.setGroup(m.chat)
      
      if (!groupData.intro) {
          return m.reply(`❌ Grup ini sudah menggunakan intro default!`)
      }
      
      delete groupData.intro
      db.setGroup(m.chat, groupData)
      db.save()
      
      await m.reply(
          `✅ *ɪɴᴛʀᴏ ᴅɪʀᴇsᴇᴛ!*\n` +
          `Intro grup dikembalikan ke default.\n\n` +
          `Ketik *${m.prefix}intro* untuk melihat hasilnya.`
      )
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
