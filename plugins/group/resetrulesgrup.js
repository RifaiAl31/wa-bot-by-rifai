// group/resetrulesgrup — satu file: metadata + kode fitur (gabungan dari engine3/plugins/group/resetrulesgrup.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "resetrulesgrup",
  "command": [
    "resetrulesgrup",
    "resetgrouprules"
  ],
  "category": "group",
  "desc": "Reset rules grup ke default (admin only)",
  "usage": ".resetrulesgrup",
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
module.exports = __vx.plugin("group/resetrulesgrup", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/resetrulesgrup.js'
  const __vxExports = {};
  const { getDatabase } = require("../../lib/ext/src/lib/vanxone-database.js");
  const pluginConfig = {
      name: 'resetrulesgrup',
      alias: ['resetgrouprules'],
      category: 'group',
      description: 'Reset rules grup ke default (admin only)',
      usage: '.resetrulesgrup',
      example: '.resetrulesgrup',
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
      
      db.setGroup(m.chat, { groupRules: null })
      
      m.reply(
          `✅ *ɢʀᴜᴘ ʀᴜʟᴇs ᴅɪʀᴇsᴇᴛ*\n` +
          `Rules grup berhasil direset ke default!\n` +
          `Ketik \`${m.prefix}rulesgrup\` untuk melihat.`
      )
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
