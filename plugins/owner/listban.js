// owner/listban — satu file: metadata + kode fitur (gabungan dari engine3/plugins/owner/listban.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "listban",
  "command": [
    "listban",
    "listbanned"
  ],
  "category": "owner",
  "desc": "Melihat daftar banned user",
  "usage": ".listban",
  "owner": true,
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
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/owner").split('\\').join('/')
module.exports = __vx.plugin("owner/listban", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/listban.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const config = __vxDef(require("../../lib/ext/config.e3.js"));
  const { getDatabase } = require("../../lib/ext/src/lib/vanxone-database.js");
  const pluginConfig = {
      name: 'listban',
      alias: ['listbanned', 'banlist'],
      category: 'owner',
      description: 'Melihat daftar banned user',
      usage: '.listban',
      example: '.listban',
      isOwner: true,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 5,
      energi: 0,
      isEnabled: true
  }
  
  async function handler(m, { sock }) {
      const db = getDatabase()
      const bannedUsers = config.bannedUsers && config.bannedUsers.length > 0 ? config.bannedUsers : (db.setting('bannedUsers') || [])
      
      if (bannedUsers.length === 0) {
          return m.reply(`🚫 *ʟɪsᴛ ʙᴀɴɴᴇᴅ*\n\n> Tidak ada user yang dibanned\n\n\`Gunakan: ${m.prefix}ban <nomor>\``)
      }
      
      let caption = `🚫 *ʟɪsᴛ ʙᴀɴɴᴇᴅ*\n\n`
      caption += `╭┈┈⬡「 ⛔ *ᴜsᴇʀs* 」\n`
      
      for (let i = 0; i < bannedUsers.length; i++) {
          caption += `┃ ${i + 1}. \`${bannedUsers[i]}\`\n`
      }
      
      caption += `╰┈┈⬡\n\n`
      caption += `> ᴛᴏᴛᴀʟ: \`${bannedUsers.length}\` ʙᴀɴɴᴇᴅ ᴜsᴇʀ`
      
      await m.reply(caption)
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
