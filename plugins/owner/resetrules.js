// owner/resetrules — satu file: metadata + kode fitur (gabungan dari engine3/plugins/owner/resetrules.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "resetrules",
  "command": [
    "resetrules",
    "resetbotrules"
  ],
  "category": "owner",
  "desc": "Reset rules bot ke default",
  "usage": ".resetrules",
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
module.exports = __vx.plugin("owner/resetrules", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/resetrules.js'
  const __vxExports = {};
  const { getDatabase } = require("../../lib/ext/src/lib/vanxone-database.js");
  const pluginConfig = {
      name: 'resetrules',
      alias: ['resetbotrules'],
      category: 'owner',
      description: 'Reset rules bot ke default',
      usage: '.resetrules',
      example: '.resetrules',
      isOwner: true,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 5,
      energi: 0,
      isEnabled: true
  }
  
  function handler(m) {
      const db = getDatabase()
      
      db.setting('botRules', null)
      
      m.reply(
          `✅ *ʙᴏᴛ ʀᴜʟᴇs ᴅɪʀᴇsᴇᴛ*\n\n` +
          `> Rules bot berhasil direset ke default!\n` +
          `> Ketik \`${m.prefix}rules\` untuk melihat.`
      )
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
