// owner/energitoggle — satu file: metadata + kode fitur (gabungan dari engine7/plugins/owner/energitoggle.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "offenergi",
  "command": [
    "offenergi",
    "onenergi"
  ],
  "category": "owner",
  "desc": "Enable/disable sistem energi",
  "usage": ".disableenergi atau .enableenergi",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/owner").split('\\').join('/')
module.exports = __vx.plugin("owner/energitoggle", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/energitoggle.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const { getDatabase } = require("../../lib/ext/src/lib/vanxone-database.e4.js");
  const config = __vxDef(require("../../lib/ext/config.e7.js"));
  const pluginConfig = {
      name: ['disableenergi', 'enableenergi'],
      alias: ['offenergi', 'onenergi'],
      category: 'owner',
      description: 'Enable/disable sistem energi',
      usage: '.disableenergi atau .enableenergi',
      example: '.disableenergi',
      isOwner: true,
      cooldown: 5,
      energi: 0,
      isEnabled: true
  }
  
  async function handler(m) {
      const db = getDatabase()
      const cmd = m.command.toLowerCase()
      const isEnable = ['enableenergi', 'onenergi'].includes(cmd)
  
      db.setting('energi', isEnable)
      db.save()
  
      await m.react(isEnable ? '⚡' : '🔌')
      return m.reply(
          isEnable
              ? '⚡ *sɪsᴛᴇᴍ ᴇɴᴇʀɢɪ ᴅɪᴀᴋᴛɪꜰᴋᴀɴ*\n\n> Setiap command sekarang memerlukan energi.'
              : '🔌 *sɪsᴛᴇᴍ ᴇɴᴇʀɢɪ ᴅɪɴᴏɴᴀᴋᴛɪꜰᴋᴀɴ*\n\n> Command tidak lagi membutuhkan energi.'
      )
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
