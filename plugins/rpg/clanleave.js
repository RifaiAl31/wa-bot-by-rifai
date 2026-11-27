// clan/clanleave — satu file: metadata + kode fitur (gabungan dari engine3/plugins/clan/clanleave.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "clanleave",
  "command": [
    "clanleave",
    "leaveclan",
    "guildleave"
  ],
  "category": "rpg",
  "desc": "Keluar dari clan",
  "usage": ".clanleave",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 10,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/clan").split('\\').join('/')
module.exports = __vx.plugin("clan/clanleave", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/clanleave.js'
  const __vxExports = {};
  const { getDatabase } = require("../../lib/ext/src/lib/vanxone-database.js");
  const pluginConfig = {
      name: 'clanleave',
      alias: ['leaveclan', 'guildleave'],
      category: 'clan',
      description: 'Keluar dari clan',
      usage: '.clanleave',
      example: '.clanleave',
      isOwner: false,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 10,
      energi: 0,
      isEnabled: true
  }
  
  async function handler(m) {
      const db = getDatabase()
      const user = db.getUser(m.sender)
  
      if (!user?.clanId) return m.reply(`❌ Kamu belum punya clan`)
      if (!db.db.data.clans) db.db.data.clans = {}
  
      const clan = db.db.data.clans[user.clanId]
      if (!clan) {
          db.setUser(m.sender, { clanId: null })
          db.save()
          return m.reply(`❌ Clan tidak ditemukan, data dibersihkan`)
      }
  
      if (clan.leader === m.sender) {
          if (clan.members.length > 1) {
              return m.reply(
                  `❌ Kamu adalah leader!\n\n` +
                  `Transfer dulu: *.clantransfer @user*\n` +
                  `Atau kick semua member terlebih dahulu`
              )
          }
          delete db.db.data.clans[user.clanId]
          db.setUser(m.sender, { clanId: null })
          db.save()
  
          const emblem = clan.emblem || '🏰'
          return m.reply(`${emblem} Clan *${clan.name}* telah dibubarkan`)
      }
  
      clan.members = clan.members.filter(jid => jid !== m.sender)
      db.setUser(m.sender, { clanId: null })
      db.save()
  
      await m.reply(`👋 Kamu keluar dari *${clan.name}*`)
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
