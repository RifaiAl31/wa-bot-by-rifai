// owner/delenergi — satu file: metadata + kode fitur (gabungan dari engine3/plugins/owner/delenergi.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "delenergi",
  "command": [
    "delenergi",
    "kurangenergi",
    "removeenergi",
    "hapusenergi",
    "delenergy"
  ],
  "category": "owner",
  "desc": "Kurangi energi user",
  "usage": ".delenergi <jumlah> @user",
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
module.exports = __vx.plugin("owner/delenergi", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/delenergi.js'
  const __vxExports = {};
  const { getDatabase } = require("../../lib/ext/src/lib/vanxone-database.js");
  const pluginConfig = {
      name: 'delenergi',
      alias: ['kurangenergi', 'removeenergi', 'hapusenergi', 'delenergy'],
      category: 'owner',
      description: 'Kurangi energi user',
      usage: '.delenergi <jumlah> @user',
      example: '.delenergi 50 @user',
      isOwner: true,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 3,
      energi: 0,
      isEnabled: true
  }
  
  function formatNumber(num) {
      if (num === -1) return '∞ Unlimited'
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
              `⚡ *ᴅᴇʟ ᴇɴᴇʀɢɪ*\n\n` +
              `> \`.delenergi <jumlah>\` - dari diri sendiri\n` +
              `> \`.delenergi <jumlah> @user\` - dari user\n\n` +
              `\`Contoh: ${m.prefix}delenergi 50\``
          )
      }
      
      if (amount <= 0) {
          return m.reply(`❌ *ɢᴀɢᴀʟ*\n\n> Jumlah harus lebih dari 0`)
      }
      
      const user = db.getUser(targetJid)
      
      if (!user) {
          return m.reply(`❌ *ɢᴀɢᴀʟ*\n\n> User tidak ditemukan di database`)
      }
      
      if (user.energi === -1) {
          db.setUser(targetJid, { energi: 25 })
      }
      
      const newEnergi = db.updateEnergi(targetJid, -amount)
      
      await m.react('✅')
      
      await m.reply(
          `✅ *ᴇɴᴇʀɢɪ ᴅɪᴋᴜʀᴀɴɢɪ*\n\n` +
          `╭┈┈⬡「 📋 *ᴅᴇᴛᴀɪʟ* 」\n` +
          `┃ 👤 ᴜsᴇʀ: @${targetJid.split('@')[0]}\n` +
          `┃ ➖ ᴋᴜʀᴀɴɢ: *-${formatNumber(amount)}*\n` +
          `┃ ⚡ sɪsᴀ: *${formatNumber(newEnergi)}*\n` +
          `╰┈┈⬡`,
          { mentions: [targetJid] }
      )
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
