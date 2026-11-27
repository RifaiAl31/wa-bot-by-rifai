// owner/autoreadsw — satu file: metadata + kode fitur (gabungan dari engine3/plugins/owner/autoreadsw.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "autoreadsw",
  "command": [
    "autoreadsw",
    "autoreadstory",
    "readstory",
    "bacasw"
  ],
  "category": "owner",
  "desc": "Auto read semua status/story WA",
  "usage": ".autoreadsw on/off",
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
module.exports = __vx.plugin("owner/autoreadsw", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/autoreadsw.js'
  const __vxExports = {};
  const { getDatabase } = require("../../lib/ext/src/lib/vanxone-database.js");
  
  const pluginConfig = {
      name: 'autoreadsw',
      alias: ['autoreadstory', 'readstory', 'bacasw'],
      category: 'owner',
      description: 'Auto read semua status/story WA',
      usage: '.autoreadsw on/off',
      example: '.autoreadsw on',
      isOwner: true,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 5,
      energi: 0,
      isEnabled: true
  }
  
  async function handler(m) {
      const db = getDatabase()
      const action = (m.args?.[0] || '').toLowerCase()
      const current = db.setting('autoReadSW') || { enabled: false }
  
      if (!action) {
          return m.reply(
              `👁️ *ᴀᴜᴛᴏ ʀᴇᴀᴅ sᴛᴏʀʏ*\n\n` +
              `> Status: *${current.enabled ? '✅ ON' : '❌ OFF'}*\n\n` +
              `*ᴄᴀʀᴀ ᴘᴀᴋᴀɪ:*\n` +
              `> \`${m.prefix}autoreadsw on\` — Aktifkan\n` +
              `> \`${m.prefix}autoreadsw off\` — Matikan`
          )
      }
  
      if (action === 'on') {
          db.setting('autoReadSW', { enabled: true })
          db.save()
          await m.react('✅')
          return m.reply(
              `✅ *ᴀᴜᴛᴏ ʀᴇᴀᴅ sᴛᴏʀʏ ᴀᴋᴛɪꜰ*\n\n` +
              `> Bot akan otomatis membaca semua story WA`
          )
      }
  
      if (action === 'off') {
          db.setting('autoReadSW', { enabled: false })
          db.save()
          await m.react('✅')
          return m.reply(`❌ *ᴀᴜᴛᴏ ʀᴇᴀᴅ sᴛᴏʀʏ ᴅɪᴍᴀᴛɪᴋᴀɴ*`)
      }
  
      return m.reply(`❌ Gunakan \`on\` atau \`off\``)
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
