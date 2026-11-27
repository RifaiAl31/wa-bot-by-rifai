// clan/clanmembers — satu file: metadata + kode fitur (gabungan dari engine3/plugins/clan/clanmembers.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "clanmembers",
  "command": [
    "clanmembers",
    "clanmember",
    "guildmembers"
  ],
  "category": "rpg",
  "desc": "Lihat daftar member clan",
  "usage": ".clanmembers",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/clan").split('\\').join('/')
module.exports = __vx.plugin("clan/clanmembers", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/clanmembers.js'
  const __vxExports = {};
  const { getDatabase } = require("../../lib/ext/src/lib/vanxone-database.js");
  const pluginConfig = {
      name: 'clanmembers',
      alias: ['clanmember', 'guildmembers'],
      category: 'clan',
      description: 'Lihat daftar member clan',
      usage: '.clanmembers',
      example: '.clanmembers',
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
  
      if (!user?.clanId) return m.reply(`❌ Kamu belum punya clan`)
      if (!db.db.data.clans) db.db.data.clans = {}
  
      const clan = db.db.data.clans[user.clanId]
      if (!clan) return m.reply(`❌ Clan tidak ditemukan`)
  
      const emblem = clan.emblem || '🏰'
      const mentions = []
  
      const memberLines = clan.members.map((jid, i) => {
          const memberUser = db.getUser(jid)
          const isLeader = jid === clan.leader
          const level = memberUser?.rpg?.level || memberUser?.level || 1
          const koin = (memberUser?.koin || 0).toLocaleString('id-ID')
          mentions.push(jid)
  
          const role = isLeader ? '👑' : '•'
          return `${role} @${jid.split('@')[0]}  Lv.${level} · Rp ${koin}`
      })
  
      await m.reply(
          `${emblem} *${clan.name}* — Members\n\n` +
          memberLines.join('\n') +
          `\n\n${clan.members.length}/50 members`,
          { mentions }
      )
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
