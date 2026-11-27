// owner/botmode — satu file: metadata + kode fitur (gabungan dari engine3/plugins/owner/botmode.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "botmode",
  "command": [
    "botmode",
    "setmode"
  ],
  "category": "owner",
  "desc": "Mengatur mode bot",
  "usage": ".botmode <mode>",
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
module.exports = __vx.plugin("owner/botmode", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/botmode.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const config = __vxDef(require("../../lib/ext/config.e3.js"));
  const { getDatabase } = require("../../lib/ext/src/lib/vanxone-database.js");
  
  const pluginConfig = {
      name: 'botmode',
      alias: ['setmode', 'mode'],
      category: 'owner',
      description: 'Mengatur mode bot',
      usage: '.botmode <mode>',
      example: '.botmode md',
      isOwner: true,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 3,
      energi: 0,
      isEnabled: true
  }
  
  const VALID_MODES = ['md', 'pushkontak', 'otp', 'all']
  
  const MODE_DESCRIPTIONS = {
      md: 'Mode default dengan fitur standar',
      pushkontak: 'Mode pushkontak, main + group + sticker + owner + pushkontak',
      otp: 'Mode OTP service, main + group + sticker + owner + otp',
      all: 'Mode full, SEMUA fitur dari semua mode bisa diakses'
  }
  
  async function handler(m, { sock }) {
      const db = getDatabase()
      const args = m.args || []
      
      let mode = (args[0] || '').toLowerCase()
      const flags = args.slice(1).map(f => f.toLowerCase())
      const globalMode = db.setting('botMode') || 'all'
      const groupData = m.isGroup ? (db.getGroup(m.chat) || {}) : {}
      const groupMode = groupData.botMode || null
      
      if (!mode) {
          let txt = `╭┈┈⬡「 🤖 *ʙᴏᴛ ᴍᴏᴅᴇ* 」\n`
          txt += `┃ ㊗ ɢʟᴏʙᴀʟ: *${globalMode.toUpperCase()}*\n`
          
          if (m.isGroup) {
              txt += `┃ ㊗ ɢʀᴜᴘ: *${(groupMode || 'INHERIT').toUpperCase()}*\n`
          }
          txt += `╰┈┈⬡\n\n`
          
          txt += `╭┈┈⬡「 📋 *ᴀᴠᴀɪʟᴀʙʟᴇ ᴍᴏᴅᴇs* 」\n`
          
          const currentMode = m.isGroup ? (groupMode || globalMode) : globalMode
          
          for (const [key, desc] of Object.entries(MODE_DESCRIPTIONS)) {
              const isActive = key === currentMode ? ' ✅' : ''
              txt += `┃ ㊗ *${key.toUpperCase()}*${isActive}\n`
              txt += `┃   ${desc}\n`
          }
          txt += `╰┈┈⬡\n\n`
          
          txt += `> \`${m.prefix}botmode md\` → Mode default\n`
          txt += `> \`${m.prefix}botmode all\` → Semua fitur`
          
          await m.reply(txt)
          return
      }
  
      if (!VALID_MODES.includes(mode)) {
          return m.reply(
              `❌ *ᴍᴏᴅᴇ ᴛɪᴅᴀᴋ ᴠᴀʟɪᴅ*\n\n` +
              `> Mode tersedia: \`${VALID_MODES.join(', ')}\``
          )
      }
  
      if (m.isGroup) {
          const newGroupData = {
              ...groupData,
              botMode: mode
          }
  
          db.setGroup(m.chat, newGroupData)
      } else {
          db.setting('botMode', mode)
      }
  
      db.save()
      await m.react('✅')
  
      await m.reply(
          `✅ *ᴍᴏᴅᴇ ᴅɪᴜʙᴀʜ*\n\n` +
          `> Mode: *${mode.toUpperCase()}*\n` +
          `> ${MODE_DESCRIPTIONS[mode]}\n` +
          `\n\n` +
          (m.isGroup ? `> _Mode grup ini juga diubah._` : `> _Mode global diubah._`)
      )
  
      console.log(`[BotMode] Changed to ${mode.toUpperCase()} by ${m.pushName} (${m.sender})`)
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  Object.defineProperty(__vxExports, "VALID_MODES", { enumerable: true, get: () => VALID_MODES });
  Object.defineProperty(__vxExports, "MODE_DESCRIPTIONS", { enumerable: true, get: () => MODE_DESCRIPTIONS });
  return __vxExports
})
