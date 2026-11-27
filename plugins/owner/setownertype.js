// owner/setownertype — satu file: metadata + kode fitur (gabungan dari engine3/plugins/owner/setownertype.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "setownertype",
  "command": [
    "setownertype",
    "ownertype",
    "ownervariant",
    "ownerstyle"
  ],
  "category": "owner",
  "desc": "Mengatur variant tampilan owner message",
  "usage": ".setownertype",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 3,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/owner").split('\\').join('/')
module.exports = __vx.plugin("owner/setownertype", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/setownertype.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const config = __vxDef(require("../../lib/ext/config.e3.js"));
  const { getDatabase } = require("../../lib/ext/src/lib/vanxone-database.js");
  const fs = __vxDef(require("fs"));
  const path = __vxDef(require("path"));
  const pluginConfig = {
      name: 'setownertype',
      alias: ['ownertype', 'ownervariant', 'ownerstyle'],
      category: 'owner',
      description: 'Mengatur variant tampilan owner message',
      usage: '.setownertype',
      example: '.setownertype',
      isOwner: true,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 3,
      energi: 0,
      isEnabled: true
  }
  
  const VARIANTS = {
      1: { name: 'Current Design', desc: 'Tampilan default saat ini' },
      2: { name: 'Multiple Contact', desc: 'Kirim contact card semua owner' }
  }
  
  async function handler(m, { sock, db }) {
      const args = m.args || []
      const variant = args[0]?.toLowerCase()
      const current = db.setting('ownerType') || 1
  
      if (variant && /^v?[1-3]$/.test(variant)) {
          const id = parseInt(variant.replace('v', ''))
          db.setting('ownerType', id)
          await db.save()
  
          await m.reply(
              `✅ Owner type diubah ke *V${id}*\n\n` +
              `> *${VARIANTS[id].name}*\n` +
              `> _${VARIANTS[id].desc}_`
          )
          return
      }
  
      const buttons = []
      for (const [id, val] of Object.entries(VARIANTS)) {
          const mark = parseInt(id) === current ? ' ✓' : ''
          buttons.push({
              name: 'quick_reply',
              buttonParamsJson: JSON.stringify({
                  display_text: `V${id}${mark} - ${val.name}`,
                  id: `${m.prefix}setownertype v${id}`
              })
          })
      }
  
      await sock.sendMessage(m.chat, {
          text: `🎨 *sᴇᴛ ᴏᴡɴᴇʀ ᴛʏᴘᴇ*\n\n> Type saat ini: *V${current}*\n> _${VARIANTS[current].name}_\n\n> Pilih variant owner:`,
          footer: config.bot?.name || 'WhatsApp Bot',
          contextInfo: {
              mentionedJid: [m.sender],
              isForwarded: true,
              forwardingScore: 999
          },
          interactiveButtons: buttons
      }, { quoted: m })
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
