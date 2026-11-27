// owner/addenergi — satu file: metadata + kode fitur (gabungan dari engine3/plugins/owner/addenergi.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "addenergi",
  "command": [
    "addenergi",
    "tambahenergi",
    "giveenergi",
    "addenergy"
  ],
  "category": "owner",
  "desc": "Tambah energi user",
  "usage": ".addenergi <jumlah> @user",
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
module.exports = __vx.plugin("owner/addenergi", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/addenergi.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const config = __vxDef(require("../../lib/ext/config.e3.js"));
  const { getDatabase } = require("../../lib/ext/src/lib/vanxone-database.js");
  const pluginConfig = {
      name: 'addenergi',
      alias: ['tambahenergi', 'giveenergi', 'addenergy'],
      category: 'owner',
      description: 'Tambah energi user',
      usage: '.addenergi <jumlah> @user',
      example: '.addenergi 100 @user',
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
  
  async function handler(m, { sock }) {
      const db = getDatabase()
      const args = m.args || []
  
      let amount = 0
      let isUnlimited = false
      let targetJid = null
  
      if (m.text?.toLowerCase().includes('--unlimited') || m.text?.toLowerCase().includes('--unli')) {
          isUnlimited = true
      }
  
      const numArg = args.find(a => !isNaN(a) && !a.includes('@') && !a.startsWith('-'))
      if (numArg) amount = parseInt(numArg)
  
      if (m.quoted) {
          targetJid = m.quoted.sender
      } else if (m.mentionedJid?.length) {
          targetJid = m.mentionedJid[0]
      } else {
          const phoneArg = args.find(a => a !== numArg && a.length > 5 && /^\d+$/.test(a.replace(/[^0-9]/g, '')))
          if (phoneArg) {
              targetJid = phoneArg.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
          }
      }
  
      if (!targetJid && (amount > 0 || isUnlimited)) {
          targetJid = m.sender
      }
  
      if (!targetJid || (!isUnlimited && amount <= 0)) {
          return m.reply(
              `⚡ *ᴀᴅᴅ ᴇɴᴇʀɢɪ*\n\n` +
              `> \`.addenergi <jumlah>\` - ke diri sendiri\n` +
              `> \`.addenergi <jumlah> @user\` - ke user\n` +
              `> \`.addenergi --unlimited\` - unlimited\n\n` +
              `\`Contoh: ${m.prefix}addenergi 100\``
          )
      }
  
      const user = db.getUser(targetJid) || db.setUser(targetJid)
  
      const effectiveUnlimited = user.energi === -1 ||
          (config.isOwner(targetJid) && (config.energi?.owner ?? -1) === -1)
  
      if (!isUnlimited && effectiveUnlimited) {
          return m.reply(
              `⚡ *INFORMASI*\n` +
              `@${targetJid.split('@')[0]} sudah memiliki energi *∞ Unlimited*\n` +
              `Tidak perlu menambahkan energi lagi`,
              { mentions: [targetJid] }
          )
      }
  
      if (isUnlimited) {
          db.setUser(targetJid, { energi: -1 })
  
          await m.react('✅')
          await m.reply(
              `✅ *Energi @${targetJid.split('@')[0]} sekarang unlimited / tidak terbatas*`,
              { mentions: [targetJid] }
          )
      } else {
          const newEnergi = db.updateEnergi(targetJid, amount)
  
          await m.react('✅')
          await m.reply(
              `✅ Energi *@${targetJid.split('@')[0]}* berhasil di tambahkan sebanyak *${formatNumber(amount)}*!\nSekarang dia mempunyai *${formatNumber(newEnergi)}* energi`,
              { mentions: [targetJid] }
          )
      }
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
