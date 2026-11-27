// owner/delkoin — satu file: metadata + kode fitur (gabungan dari engine3/plugins/owner/delkoin.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "delkoin",
  "command": [
    "delkoin",
    "kurangkoin",
    "removekoin",
    "delcoin",
    "delmoney"
  ],
  "category": "owner",
  "desc": "Kurangi koin user",
  "usage": ".delkoin <jumlah> @user",
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
module.exports = __vx.plugin("owner/delkoin", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/delkoin.js'
  const __vxExports = {};
  const { getDatabase } = require("../../lib/ext/src/lib/vanxone-database.js");
  const pluginConfig = {
      name: 'delkoin',
      alias: ['kurangkoin', 'removekoin', 'delcoin', 'delmoney'],
      category: 'owner',
      description: 'Kurangi koin user',
      usage: '.delkoin <jumlah> @user',
      example: '.delkoin 50000 @user',
      isOwner: true,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 3,
      energi: 0,
      isEnabled: true
  }
  
  function formatKoin(num) {
      if (num >= 1000000000000) return (num / 1000000000000).toFixed(2) + 'T'
      if (num >= 1000000000) return (num / 1000000000).toFixed(2) + 'B'
      if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M'
      if (num >= 1000) return (num / 1000).toFixed(2) + 'K'
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  }
  
  function extractTarget(m) {
      if (m.quoted) return m.quoted.sender
      if (m.mentionedJid?.length) return m.mentionedJid[0]
      return null
  }
  
  async function handler(m, { sock }) {
      const db = getDatabase()
      const args = m.args
      
      const numArg = args.find(a => !isNaN(a) && !a.startsWith('@'))
      const amount = parseInt(numArg) || 0
      
      let targetJid = await extractTarget(m)
      
      if (!targetJid && amount > 0) {
          targetJid = m.sender
      }
      
      if (!targetJid || amount <= 0) {
          return m.reply(
              `💰 *ᴅᴇʟ ᴋᴏɪɴ*\n\n` +
              `> \`.delkoin <jumlah>\` - dari diri sendiri\n` +
              `> \`.delkoin <jumlah> @user\` - dari user\n\n` +
              `\`Contoh: ${m.prefix}delkoin 50000\``
          )
      }
      
      if (amount <= 0) {
          return m.reply(`❌ *ɢᴀɢᴀʟ*\n\n> Jumlah harus lebih dari 0`)
      }
      
      const user = db.getUser(targetJid)
      
      if (!user) {
          return m.reply(`❌ *ɢᴀɢᴀʟ*\n\n> User tidak ditemukan di database`)
      }
      
      const newKoin = db.updateKoin(targetJid, -amount)
      
      await m.react('✅')
      
      await m.reply(
          `✅ *ᴋᴏɪɴ ᴅɪᴋᴜʀᴀɴɢɪ*\n\n` +
          `╭┈┈⬡「 📋 *ᴅᴇᴛᴀɪʟ* 」\n` +
          `┃ 👤 ᴜsᴇʀ: @${targetJid.split('@')[0]}\n` +
          `┃ ➖ ᴋᴜʀᴀɴɢ: *-${formatKoin(amount)}*\n` +
          `┃ 💰 sɪsᴀ: *${formatKoin(newKoin)}*\n` +
          `╰┈┈⬡`,
          { mentions: [targetJid] }
      )
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
