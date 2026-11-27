// owner/addkoin — satu file: metadata + kode fitur (gabungan dari engine3/plugins/owner/addkoin.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "addkoin",
  "command": [
    "addkoin",
    "tambahkoin",
    "givekoin",
    "addcoin",
    "adddcoin"
  ],
  "category": "owner",
  "desc": "Tambah koin user (max 9 Triliun)",
  "usage": ".addkoin <jumlah> @user",
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
module.exports = __vx.plugin("owner/addkoin", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/addkoin.js'
  const __vxExports = {};
  const { getDatabase } = require("../../lib/ext/src/lib/vanxone-database.js");
  const pluginConfig = {
      name: 'addkoin',
      alias: ['tambahkoin', 'givekoin', 'addcoin', 'adddcoin'],
      category: 'owner',
      description: 'Tambah koin user (max 9 Triliun)',
      usage: '.addkoin <jumlah> @user',
      example: '.addkoin 100000 @user',
      isOwner: true,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 3,
      energi: 0,
      isEnabled: true
  }
  
  const MAX_KOIN = 9000000000000
  function formatKoin(num) {
      if (num === -1) return '∞ Unlimited'
      if (num >= 1000000000000) return (num / 1000000000000).toFixed(2) + 'T'
      if (num >= 1000000000) return (num / 1000000000).toFixed(2) + 'B'
      if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M'
      if (num >= 1000) return (num / 1000).toFixed(2) + 'K'
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  }
  
  async function handler(m, { sock }) {
      const db = getDatabase()
      const args = m.args || []
  
      const numArg = args.find(a => !isNaN(a) && !a.startsWith('@'))
      let amount = parseInt(numArg) || 0
  
      let targetJid = null
      if (m.quoted) {
          targetJid = m.quoted.sender
      } else if (m.mentionedJid?.length) {
          targetJid = m.mentionedJid[0]
      }
  
      if (!targetJid && amount > 0) {
          targetJid = m.sender
      }
  
      if (!targetJid || amount <= 0) {
          return m.reply(
              `💰 *ᴀᴅᴅ ᴋᴏɪɴ*\n\n` +
              `> \`.addkoin <jumlah>\` - ke diri sendiri\n` +
              `> \`.addkoin <jumlah> @user\` - ke orang lain\n` +
              `> Max: 9.000.000.000.000 (9T)\n\n` +
              `\`Contoh: ${m.prefix}addkoin 100000\``
          )
      }
  
      if (amount > MAX_KOIN) amount = MAX_KOIN
  
      const user = db.getUser(targetJid) || db.setUser(targetJid)
  
      if (user.koin === -1) {
          return m.reply(
              `💰 *INFORMATION*\n` +
              `@${targetJid.split('@')[0]} sudah memiliki koin *∞ Unlimited*\n` +
              `Tidak perlu menambahkan koin lagi`,
              { mentions: [targetJid] }
          )
      }
  
      const newKoin = db.updateKoin(targetJid, amount)
  
      await m.react('✅')
      await m.reply(
          `✅ Berhasil menambahkan koin *@${targetJid.split('@')[0]}* sebanyak *${formatKoin(amount)}*`,
          { mentions: [targetJid] }
      )
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
