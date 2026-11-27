// clan/clanpromote — satu file: metadata + kode fitur (gabungan dari engine7/plugins/clan/clanpromote.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "clanpromote",
  "command": [
    "clanpromote",
    "promoteclan",
    "setcoleader"
  ],
  "category": "rpg",
  "desc": "Naikkan jabatan member (Co-Leader/Elder)",
  "usage": ".clanpromote @user <coleader|elder>",
  "owner": false,
  "group": true,
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
module.exports = __vx.plugin("clan/clanpromote", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/clanpromote.js'
  const __vxExports = {};
  const { getDatabase } = require("../../lib/ext/src/lib/vanxone-database.e4.js");
  const pluginConfig = {
      name: 'clanpromote',
      alias: ['promoteclan', 'setcoleader'],
      category: 'clan',
      description: 'Naikkan jabatan member (Co-Leader/Elder)',
      usage: '.clanpromote @user <coleader|elder>',
      example: '.clanpromote @user coleader',
      isOwner: false,
      isPremium: false,
      isGroup: true,
      isPrivate: false,
      cooldown: 10,
      energi: 0,
      isEnabled: true
  }
  
  async function handler(m, { mention }) {
      const db = getDatabase()
      const user = db.getUser(m.sender)
      const args = m.text?.trim().split(/\s+/)
      
      let target = mention?.[0] || (args[0] ? (args[0].includes('@') ? args[0] : null) : null)
      let role = args?.find(a => ['coleader', 'elder'].includes(a.toLowerCase()))
      
      if (!target || !role) {
          return m.reply(`⭐ *ᴄʟᴀɴ ᴘʀᴏᴍᴏᴛᴇ*\n\n> Promote member ke Co-Leader atau Elder\n\n> Contoh:\n> .clanpromote @user coleader\n> .clanpromote @user elder`)
      }
      
      target = target.replace('@', '').replace(/[^0-9]/g, '') + '@s.whatsapp.net'
      
      if (!user.clanId) {
          return m.reply(`❌ Kamu belum punya clan!`)
      }
      
      const clan = db.db.data.clans[user.clanId]
      if (!clan) {
          return m.reply(`❌ Clan tidak ditemukan!`)
      }
      
      if (clan.leader !== m.sender) {
          return m.reply(`❌ Hanya *leader* clan yang bisa promote member!`)
      }
      
      if (!clan.members.includes(target)) {
          return m.reply(`❌ Target bukan member clan kamu!`)
      }
      
      if (target === m.sender) {
          return m.reply(`❌ Tidak bisa promote diri sendiri!`)
      }
      
      if (!clan.roles) clan.roles = {}
      
      clan.roles[target] = role
      await db.save()
      
      let txt = `⭐ *ᴄʟᴀɴ ᴘʀᴏᴍᴏᴛᴇ!*\n\n`
      txt += `╭┈┈⬡「 📋 *ʜᴀꜱɪʟ* 」\n`
      txt += `┃ 📛 Clan: *${clan.name}*\n`
      txt += `┃ 👤 Member: @${target.split('@')[0]}\n`
      txt += `┃ 🆙 Jabatan baru: *${role === 'coleader' ? 'Co-Leader' : 'Elder'}*\n`
      txt += `┃ 👑 Dipromote oleh: @${m.sender.split('@')[0]}\n`
      txt += `╰┈┈┈┈┈┈┈┈⬡`
      
      await m.reply(txt, { mentions: [target, m.sender] })
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
