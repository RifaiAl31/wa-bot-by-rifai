// clan/claninvite — satu file: metadata + kode fitur (gabungan dari engine3/plugins/clan/claninvite.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "claninvite",
  "command": [
    "claninvite",
    "inviteclan"
  ],
  "category": "rpg",
  "desc": "Invite & langsung tambahkan user ke clan",
  "usage": ".claninvite @user",
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
module.exports = __vx.plugin("clan/claninvite", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/claninvite.js'
  const __vxExports = {};
  const { getDatabase } = require("../../lib/ext/src/lib/vanxone-database.js");
  const pluginConfig = {
      name: 'claninvite',
      alias: ['inviteclan'],
      category: 'clan',
      description: 'Invite & langsung tambahkan user ke clan',
      usage: '.claninvite @user',
      example: '.claninvite @user',
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
      if (!clan) return m.reply(`❌ Clan tidak ditemukan`)
  
      const target = m.mentionedJid?.[0] || m.quoted?.sender
      if (!target) {
          return m.reply(
              `📨 *CLAN INVITE*\n\n` +
              `Tag atau reply user yang mau diundang\n\n` +
              `Contoh: *.claninvite @user*`
          )
      }
  
      if (target === m.sender) return m.reply(`❌ Tidak bisa invite diri sendiri`)
  
      const targetUser = db.getUser(target)
      if (targetUser?.clanId) return m.reply(`❌ User tersebut sudah punya clan`)
      if (clan.members.length >= 50) return m.reply(`❌ Clan sudah penuh (50/50)`)
  
      clan.members.push(target)
      db.setUser(target, { clanId: user.clanId })
      db.save()
  
      const emblem = clan.emblem || '🏰'
  
      await m.reply(
          `${emblem} *INVITED!*\n\n` +
          `@${target.split('@')[0]} bergabung ke *${clan.name}*\n` +
          `Members: ${clan.members.length}/50`,
          { mentions: [m.sender, target] }
      )
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
