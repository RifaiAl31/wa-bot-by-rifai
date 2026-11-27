// clan/clanbank — satu file: metadata + kode fitur (gabungan dari engine7/plugins/clan/clanbank.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "clanbank",
  "command": [
    "clanbank",
    "kasclan",
    "clanbalance"
  ],
  "category": "rpg",
  "desc": "Cek saldo kas clan",
  "usage": ".clanbank",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 3,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/clan").split('\\').join('/')
module.exports = __vx.plugin("clan/clanbank", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/clanbank.js'
  const __vxExports = {};
  const { getDatabase } = require("../../lib/ext/src/lib/vanxone-database.e4.js");
  const pluginConfig = {
      name: 'clanbank',
      alias: ['kasclan', 'clanbalance'],
      category: 'clan',
      description: 'Cek saldo kas clan',
      usage: '.clanbank',
      example: '.clanbank',
      isOwner: false,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 3,
      energi: 0,
      isEnabled: true
  }
  
  async function handler(m) {
      const db = getDatabase()
      const user = db.getUser(m.sender)
      
      if (!user.clanId) {
          return m.reply(`❌ Kamu belum punya clan!\n> Buat clan dengan *.clancreate*`)
      }
      
      const clan = db.db.data.clans[user.clanId]
      if (!clan) {
          return m.reply(`❌ Clan tidak ditemukan!`)
      }
      
      const totalDonations = clan.bank || 0
      const topDonors = Object.entries(clan.donations || {})
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
      
      let txt = `🏦 *ᴋᴀꜱ ᴄʟᴀɴ*\n\n`
      txt += `╭┈┈⬡「 📊 *ɪɴꜰᴏ* 」\n`
      txt += `┃ 📛 Clan: *${clan.name}*\n`
      txt += `┃ 💰 Total kas: *Rp ${totalDonations.toLocaleString('id-ID')}*\n`
      txt += `╰┈┈┈┈┈┈┈┈⬡\n\n`
      
      if (topDonors.length > 0) {
          txt += `╭┈┈⬡「 🎖️ *ᴛᴏᴘ ᴅᴏɴᴀᴛᴏʀ* 」\n`
          for (let i = 0; i < topDonors.length; i++) {
              const [donorId, amount] = topDonors[i]
              const donorData = db.getUser(donorId)
              const name = donorData?.name || donorId.split('@')[0]
              const medal = i === 0 ? '🏆' : i === 1 ? '🥈' : i === 2 ? '🥉' : '📌'
              txt += `┃ ${medal} ${i+1}. *${name}*\n`
              txt += `┃    └ Rp ${amount.toLocaleString('id-ID')}\n`
          }
          txt += `╰┈┈┈┈┈┈┈┈⬡`
      }
      
      await m.reply(txt)
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
