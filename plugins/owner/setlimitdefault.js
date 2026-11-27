// owner/setlimitdefault — satu file: metadata + kode fitur (gabungan dari engine3/plugins/owner/setlimitdefault.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "setlimitdefault",
  "command": [
    "setlimitdefault",
    "setdefaultlimit",
    "limitdefault"
  ],
  "category": "owner",
  "desc": "Set default limit untuk user baru",
  "usage": ".setlimitdefault <jumlah>",
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
module.exports = __vx.plugin("owner/setlimitdefault", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/setlimitdefault.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const { getDatabase } = require("../../lib/ext/src/lib/vanxone-database.js");
  const config = __vxDef(require("../../lib/ext/config.e3.js"));
  const pluginConfig = {
      name: 'setlimitdefault',
      alias: ['setdefaultlimit', 'limitdefault'],
      category: 'owner',
      description: 'Set default limit untuk user baru',
      usage: '.setlimitdefault <jumlah>',
      example: '.setlimitdefault 50',
      isOwner: true,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 5,
      energi: 0,
      isEnabled: true
  }
  
  async function handler(m, { sock }) {
      const args = m.args || []
      const newLimit = parseInt(args[0])
      
      if (!args[0] || isNaN(newLimit)) {
          const db = getDatabase()
          const currentDefault = db.setting('defaultLimit') || config.limits?.default || 25
          
          return m.reply(
              `📊 *sᴇᴛ ᴅᴇғᴀᴜʟᴛ ʟɪᴍɪᴛ*\n\n` +
              `> Limit default saat ini: \`${currentDefault}\`\n\n` +
              `*Cara pakai:*\n` +
              `> \`${m.prefix}setlimitdefault <jumlah>\`\n\n` +
              `*Contoh:*\n` +
              `> \`${m.prefix}setlimitdefault 50\``
          )
      }
      
      if (newLimit < 1 || newLimit > 1000) {
          return m.reply(`❌ *ɢᴀɢᴀʟ*\n\n> Limit harus antara 1 - 1000`)
      }
      
      const db = getDatabase()
      db.setting('defaultLimit', newLimit)
      
      await m.reply(
          `✅ *ʙᴇʀʜᴀsɪʟ*\n\n` +
          `> Default limit diubah menjadi: \`${newLimit}\`\n` +
          `> User baru akan mendapat limit ini`
      )
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
