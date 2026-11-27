// clan/clanwaraccept — satu file: metadata + kode fitur (gabungan dari engine7/plugins/clan/clanwaraccept.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "clanwaraccept",
  "command": [
    "clanwaraccept",
    "acceptwar",
    "waraccept",
    "terimawar"
  ],
  "category": "rpg",
  "desc": "Terima tantangan clan war",
  "usage": ".clanwaraccept",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 10,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/clan").split('\\').join('/')
module.exports = __vx.plugin("clan/clanwaraccept", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/clanwaraccept.js'
  const __vxExports = {};
  const { getDatabase } = require("../../lib/ext/src/lib/vanxone-database.e4.js");
  const pluginConfig = {
      name: 'clanwaraccept',
      alias: ['acceptwar', 'waraccept', 'terimawar'],
      category: 'clan',
      description: 'Terima tantangan clan war',
      usage: '.clanwaraccept',
      example: '.clanwaraccept',
      isOwner: false,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 10,
      energi: 0,
      isEnabled: true
  }
  
  async function handler(m, { sock }) {
      const db = getDatabase()
      const user = db.getUser(m.sender)
      
      if (!user.clanId) {
          return m.reply(`❌ Kamu belum punya clan!`)
      }
      
      const clan = db.db.data.clans[user.clanId]
      if (!clan) {
          return m.reply(`❌ Clan tidak ditemukan!`)
      }
      
      if (clan.leader !== m.sender && clan.roles?.[m.sender] !== 'coleader') {
          return m.reply(`❌ Hanya *Leader* atau *Co-Leader* yang bisa menerima war!`)
      }
      
      if (!db.db.data.pendingWars) db.db.data.pendingWars = {}
      
      let pendingWar = null
      let pendingId = null
      
      for (const [id, war] of Object.entries(db.db.data.pendingWars)) {
          if (war.targetClanId === clan.id && war.status === 'pending') {
              pendingWar = war
              pendingId = id
              break
          }
      }
      
      if (!pendingWar) {
          return m.reply(`❌ Tidak ada tantangan war yang masuk untuk clanmu!`)
      }
      
      const attackerClan = db.db.data.clans[pendingWar.attackerClanId]
      if (!attackerClan) {
          delete db.db.data.pendingWars[pendingId]
          await db.save()
          return m.reply(`❌ Clan pengirim sudah tidak ada!`)
      }
      
      pendingWar.status = 'accepted'
      pendingWar.acceptedAt = new Date().toISOString()
      pendingWar.warStart = Date.now()
      pendingWar.warEnd = Date.now() + (24 * 60 * 60 * 1000)
      
      if (!db.db.data.activeWars) db.db.data.activeWars = {}
      const warId = `war_${Date.now()}`
      
      db.db.data.activeWars[warId] = {
          id: warId,
          attacker: pendingWar.attackerClanId,
          defender: pendingWar.targetClanId,
          startTime: pendingWar.warStart,
          endTime: pendingWar.warEnd,
          attackerScore: 0,
          defenderScore: 0,
          attackerMembers: [],
          defenderMembers: [],
          status: 'active'
      }
      
      delete db.db.data.pendingWars[pendingId]
      await db.save()
      
      let txt = `⚔️ *ᴄʟᴀɴ ᴡᴀʀ ᴀᴄᴄᴇᴘᴛᴇᴅ!*\n\n`
      txt += `╭┈┈⬡「 🎯 *ᴡᴀʀ ɪɴꜰᴏ* 」\n`
      txt += `┃ ⚔️ Attacker: *${attackerClan.name}*\n`
      txt += `┃ 🛡️ Defender: *${clan.name}*\n`
      txt += `┃ ⏰ Durasi: *24 jam*\n`
      txt += `┃ 📅 Mulai: Sekarang\n`
      txt += `╰┈┈┈┈┈┈┈┈⬡\n\n`
      txt += `> Ketik *.clanwar* untuk lihat status war!\n> Ketik *.clanwarscore* untuk lihat skor!`
      
      for (const member of clan.members) {
          await sock.sendMessage(member, { text: txt }).catch(() => {})
      }
      for (const member of attackerClan.members) {
          await sock.sendMessage(member, { text: txt }).catch(() => {})
      }
      
      await m.reply(txt)
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
