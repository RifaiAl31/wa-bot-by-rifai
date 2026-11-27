// clan/clanwarhistory — satu file: metadata + kode fitur (gabungan dari engine7/plugins/clan/clanwarhistory.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "clanwarhistory",
  "command": [
    "clanwarhistory",
    "warhistory",
    "historywar",
    "riwayatwar"
  ],
  "category": "rpg",
  "desc": "Lihat riwayat clan war",
  "usage": ".clanwarhistory",
  "owner": false,
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
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/clan").split('\\').join('/')
module.exports = __vx.plugin("clan/clanwarhistory", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/clanwarhistory.js'
  const __vxExports = {};
  const { getDatabase } = require("../../lib/ext/src/lib/vanxone-database.e4.js");
  const pluginConfig = {
      name: 'clanwarhistory',
      alias: ['warhistory', 'historywar', 'riwayatwar'],
      category: 'clan',
      description: 'Lihat riwayat clan war',
      usage: '.clanwarhistory',
      example: '.clanwarhistory',
      isOwner: false,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 5,
      energi: 0,
      isEnabled: true
  }
  
  async function handler(m) {
      const db = getDatabase()
      const user = db.getUser(m.sender)
      
      if (!user.clanId) {
          return m.reply(`❌ Kamu belum punya clan!`)
      }
      
      const clan = db.db.data.clans[user.clanId]
      if (!clan) {
          return m.reply(`❌ Clan tidak ditemukan!`)
      }
      
      if (!db.db.data.warHistory) db.db.data.warHistory = []
      
      const warHistory = db.db.data.warHistory
          .filter(war => war.attacker === clan.id || war.defender === clan.id)
          .slice(-10)
          .reverse()
      
      if (warHistory.length === 0) {
          return m.reply(`📜 *ʀɪᴡᴀʏᴀᴛ ᴡᴀʀ*\n\n> Clan *${clan.name}* belum memiliki riwayat perang!`)
      }
      
      let txt = `📜 *ʀɪᴡᴀʏᴀᴛ ᴡᴀʀ* [${clan.name}]\n\n`
      
      for (let i = 0; i < warHistory.length; i++) {
          const war = warHistory[i]
          const isAttacker = war.attacker === clan.id
          const opponentId = isAttacker ? war.defender : war.attacker
          const opponent = db.db.data.clans[opponentId]
          const opponentName = opponent?.name || 'Unknown Clan'
          
          const isWin = (isAttacker && war.attackerScore > war.defenderScore) || 
                        (!isAttacker && war.defenderScore > war.attackerScore)
          
          const result = isWin ? '✅ WIN' : '❌ LOSE'
          const date = new Date(war.endTime).toLocaleDateString('id-ID')
          
          txt += `╭┈┈⬡「 ${i+1} 」\n`
          txt += `┃ 📅 ${date}\n`
          txt += `┃ 🆚 Vs *${opponentName}*\n`
          txt += `┃ 📊 ${war.attackerScore} - ${war.defenderScore}\n`
          txt += `┃ 🎯 *${result}*\n`
          txt += `╰┈┈┈┈┈┈┈┈⬡\n`
          if (i < warHistory.length - 1) txt += `\n`
      }
      
      const wins = warHistory.filter(war => {
          const isAttacker = war.attacker === clan.id
          return (isAttacker && war.attackerScore > war.defenderScore) || 
                 (!isAttacker && war.defenderScore > war.attackerScore)
      }).length
      
      const totalWars = warHistory.length
      const winRate = Math.floor((wins / totalWars) * 100)
      
      txt += `\n╭┈┈⬡「 📊 *ᴛᴏᴛᴀʟ* 」\n`
      txt += `┃ 🏆 Menang: *${wins}*\n`
      txt += `┃ 📉 Kalah: *${totalWars - wins}*\n`
      txt += `┃ 📈 Win rate: *${winRate}%*\n`
      txt += `╰┈┈┈┈┈┈┈┈⬡`
      
      await m.reply(txt)
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
