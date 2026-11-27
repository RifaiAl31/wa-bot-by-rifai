// owner/resetlimitdefault — satu file: metadata + kode fitur (gabungan dari engine3/plugins/owner/resetlimitdefault.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "resetlimitdefault",
  "command": [
    "resetlimitdefault",
    "defaultlimitreset"
  ],
  "category": "owner",
  "desc": "Reset default limit ke config asli",
  "usage": ".resetlimitdefault",
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
module.exports = __vx.plugin("owner/resetlimitdefault", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/resetlimitdefault.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const { getDatabase } = require("../../lib/ext/src/lib/vanxone-database.js");
  const config = __vxDef(require("../../lib/ext/config.e3.js"));
  const pluginConfig = {
      name: 'resetlimitdefault',
      alias: ['defaultlimitreset'],
      category: 'owner',
      description: 'Reset default limit ke config asli',
      usage: '.resetlimitdefault',
      example: '.resetlimitdefault',
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
      const configDefault = config.limits?.default || 25
      
      db.setting('defaultLimit', null)
      
      await m.reply(
          `✅ *ʙᴇʀʜᴀsɪʟ*\n\n` +
          `> Default limit direset ke config: \`${configDefault}\`\n` +
          `> User baru akan mendapat limit dari config`
      )
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
