// group/setrulesgrup — satu file: metadata + kode fitur (gabungan dari engine3/plugins/group/setrulesgrup.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "setrulesgrup",
  "command": [
    "setrulesgrup",
    "setgrouprules",
    "setaturangrup"
  ],
  "category": "group",
  "desc": "Set rules/aturan grup custom (admin only)",
  "usage": ".setrulesgrup <text>",
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
module.exports = __vx.plugin("group/setrulesgrup", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/setrulesgrup.js'
  const __vxExports = {};
  const { getDatabase } = require("../../lib/ext/src/lib/vanxone-database.js");
  const pluginConfig = {
      name: 'setrulesgrup',
      alias: ['setgrouprules', 'setaturangrup'],
      category: 'group',
      description: 'Set rules/aturan grup custom (admin only)',
      usage: '.setrulesgrup <text>',
      example: '.setrulesgrup 1. Jangan spam\n2. Hormati sesama',
      isOwner: false,
      isPremium: false,
      isGroup: true,
      isPrivate: false,
      isAdmin: true,
      cooldown: 5,
      energi: 0,
      isEnabled: true
  }
  
  function handler(m) {
      const db = getDatabase()
      const text = m.text?.trim() || (m.quoted?.body || m.quoted?.text || '')
  
      if (!text) {
          return m.reply(
              `📝 *sᴇᴛ ɢʀᴜᴘ ʀᴜʟᴇs*\n\n` +
              `> Masukkan teks rules yang baru\n\n` +
              `\`Contoh:\`\n` +
              `\`${m.prefix}setrulesgrup 1. Jangan spam
  2. Hormati sesama\``
          )
      }
  
      db.setGroup(m.chat, { groupRules: text })
  
      m.reply(
          `✅ *ɢʀᴜᴘ ʀᴜʟᴇs ᴅɪᴜᴘᴅᴀᴛᴇ*\n\n` +
          `Rules grup berhasil diubah!\n` +
          `Ketik \`${m.prefix}rulesgrup\` untuk melihat.`
      )
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
