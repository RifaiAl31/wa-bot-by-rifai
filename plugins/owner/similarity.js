// owner/similarity — satu file: metadata + kode fitur (gabungan dari engine3/plugins/owner/similarity.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "similarity",
  "command": [
    "similarity",
    "setsimilarity",
    "sim"
  ],
  "category": "owner",
  "desc": "Mengaktifkan/menonaktifkan fitur similarity (saran typo)",
  "usage": ".similarity <on/off>",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 0,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/owner").split('\\').join('/')
module.exports = __vx.plugin("owner/similarity", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/similarity.js'
  const __vxExports = {};
  const { getDatabase } = require("../../lib/ext/src/lib/vanxone-database.js");
  const pluginConfig = {
      name: 'similarity',
      alias: ['setsimilarity', 'sim'],
      category: 'owner',
      description: 'Mengaktifkan/menonaktifkan fitur similarity (saran typo)',
      usage: '.similarity <on/off>',
      example: '.similarity on',
      isOwner: true,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 0,
      energi: 0,
      isEnabled: true
  }
  
  async function handler(m, { sock }) {
      const db = getDatabase()
      const args = m.args
      
      if (!args[0]) {
          return m.reply(`⚠️ *ᴄᴀʀᴀ ᴘᴀᴋᴀɪ*\n\n> \`.similarity on\` - Aktifkan\n> \`.similarity off\` - Matikan`)
      }
      
      const mode = args[0].toLowerCase()
      
      if (mode === 'on') {
          db.setting('similarity', true)
          await m.react('✅')
          await m.reply(`✅ *sᴜᴋsᴇs*\n\n> Fitur similarity command *DIAKTIFKAN*`)
      } else if (mode === 'off') {
          db.setting('similarity', false)
          await m.react('✅')
          await m.reply(`✅ *sᴜᴋsᴇs*\n\n> Fitur similarity command *DIMATIKAN*`)
      } else {
          return m.reply(`⚠️ *ᴄᴀʀᴀ ᴘᴀᴋᴀɪ*\n\n> \`.similarity on\` - Aktifkan\n> \`.similarity off\` - Matikan`)
      }
      
      await db.save()
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
