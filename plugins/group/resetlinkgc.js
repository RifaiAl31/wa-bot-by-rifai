// group/resetlinkgc — satu file: metadata + kode fitur (gabungan dari engine3/plugins/group/resetlinkgc.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "resetlinkgc",
  "command": [
    "resetlinkgc",
    "revokelink",
    "newlink"
  ],
  "category": "group",
  "desc": "Reset link invite grup",
  "usage": ".resetlinkgc",
  "owner": false,
  "group": true,
  "private": false,
  "premium": false,
  "admin": true,
  "botAdmin": true,
  "cooldown": 60,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/group").split('\\').join('/')
module.exports = __vx.plugin("group/resetlinkgc", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/resetlinkgc.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.js"));
  const pluginConfig = {
      name: 'resetlinkgc',
      alias: ['resetlink', 'revokelink', 'newlink'],
      category: 'group',
      description: 'Reset link invite grup',
      usage: '.resetlinkgc',
      example: '.resetlinkgc',
      isOwner: false,
      isPremium: false,
      isGroup: true,
      isPrivate: false,
      cooldown: 60,
      energi: 0,
      isEnabled: true,
      isAdmin: true,
      isBotAdmin: true
  }
  
  async function handler(m, { sock }) {
      m.react('🔄')
      
      try {
          await sock.groupRevokeInvite(m.chat)
          
          m.react('✅')
          m.reply(`✅ *ʟɪɴᴋ ɢʀᴜᴘ ᴅɪʀᴇsᴇᴛ*\nLink grup lama sudah tidak berlaku.\nGunakan \`${m.prefix}linkgc\` untuk mendapatkan link baru.`)
          
      } catch (err) {
          m.react('☢')
          m.reply(te(m.prefix, m.command, m.pushName))
      }
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
