// clan/clandesc — satu file: metadata + kode fitur (gabungan dari engine7/plugins/clan/clandesc.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "clandesc",
  "command": [
    "clandesc",
    "editdesc",
    "clandescription"
  ],
  "category": "rpg",
  "desc": "Edit deskripsi clan",
  "usage": ".clandesc <deskripsi>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 15,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/clan").split('\\').join('/')
module.exports = __vx.plugin("clan/clandesc", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/clandesc.js'
  const __vxExports = {};
  const { getDatabase } = require("../../lib/ext/src/lib/vanxone-database.e4.js");
  const pluginConfig = {
      name: 'clandesc',
      alias: ['editdesc', 'clandescription'],
      category: 'clan',
      description: 'Edit deskripsi clan',
      usage: '.clandesc <deskripsi>',
      example: '.clandesc Clan pejuang sejati',
      isOwner: false,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 15,
      energi: 0,
      isEnabled: true
  }
  
  const MAX_DESC = 100
  
  async function handler(m) {
      const db = getDatabase()
      const user = db.getUser(m.sender)
      const description = m.text?.trim()
      
      if (!description) {
          return m.reply(`📝 *ᴄʟᴀɴ ᴅᴇꜱᴄʀɪᴘᴛɪᴏɴ*\n\n> Masukkan deskripsi clan baru!\n> Maksimal ${MAX_DESC} karakter\n\n> Contoh: .clandesc Clan pejuang sejati`)
      }
      
      if (description.length > MAX_DESC) {
          return m.reply(`❌ Deskripsi maksimal ${MAX_DESC} karakter!`)
      }
      
      if (!user.clanId) {
          return m.reply(`❌ Kamu belum punya clan!\n> Buat clan dengan *.clancreate*`)
      }
      
      const clan = db.db.data.clans[user.clanId]
      if (!clan) {
          return m.reply(`❌ Clan tidak ditemukan!`)
      }
      
      if (clan.leader !== m.sender) {
          return m.reply(`❌ Hanya *leader* clan yang bisa edit deskripsi!`)
      }
      
      clan.description = description
      await db.save()
      
      let txt = `📝 *ᴄʟᴀɴ ᴅᴇꜱᴄʀɪᴘᴛɪᴏɴ ᴜᴘᴅᴀᴛᴇᴅ!*\n\n`
      txt += `╭┈┈⬡「 📋 *ʜᴀꜱɪʟ* 」\n`
      txt += `┃ 📛 Nama clan: *${clan.name}*\n`
      txt += `┃ 📝 Deskripsi baru:\n`
      txt += `┃ ✨ *${description}*\n`
      txt += `┃ 👑 Leader: @${m.sender.split('@')[0]}\n`
      txt += `╰┈┈┈┈┈┈┈┈⬡`
      
      await m.reply(txt, { mentions: [m.sender] })
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
