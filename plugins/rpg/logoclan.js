// clan/logoclan — satu file: metadata + kode fitur (gabungan dari engine7/plugins/clan/logoclan.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "clanlogo",
  "command": [
    "clanlogo",
    "setlogo",
    "clanicon"
  ],
  "category": "rpg",
  "desc": "Set logo clan (reply gambar)",
  "usage": ".clanlogo (reply gambar)",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 20,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/clan").split('\\').join('/')
module.exports = __vx.plugin("clan/logoclan", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/logoclan.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxUrl = require('url').pathToFileURL(__filename).href;
  const __vxExports = {};
  const fs = __vxDef(require("fs"));
  const path = __vxDef(require("path"));
  const { getDatabase } = require("../../lib/ext/src/lib/vanxone-database.e4.js");
  const { fileURLToPath } = require("node:url");
  
  
  const pluginConfig = {
      name: 'clanlogo',
      alias: ['setlogo', 'clanicon'],
      category: 'clan',
      description: 'Set logo clan (reply gambar)',
      usage: '.clanlogo (reply gambar)',
      example: '.clanlogo',
      isOwner: false,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 20,
      energi: 0,
      isEnabled: true
  }
  
  async function handler(m, { sock }) {
      const db = getDatabase()
      const user = db.getUser(m.sender)
      
      if (!user.clanId) {
          return m.reply(`❌ Kamu belum punya clan!\n> Buat clan dengan *.clancreate*`)
      }
      
      const clan = db.db.data.clans[user.clanId]
      if (!clan) {
          return m.reply(`❌ Clan tidak ditemukan!`)
      }
      
      if (clan.leader !== m.sender) {
          return m.reply(`❌ Hanya *leader* clan yang bisa set logo!`)
      }
      
      if (!m.quoted || !m.quoted.message?.imageMessage) {
          return m.reply(`🖼️ *ᴄʟᴀɴ ʟᴏɢᴏ*\n\n> Reply gambar yang ingin dijadikan logo clan!\n\n> Contoh: reply gambar lalu ketik .clanlogo`)
      }
      
      await m.reply('⏳ *Mengupload logo clan...*')
      
      const media = await m.quoted.download()
      const logoDir = path.join(__dirname, '../../temp/clan_logo')
      
      if (!fs.existsSync(logoDir)) {
          fs.mkdirSync(logoDir, { recursive: true })
      }
      
      const logoPath = path.join(logoDir, `${clan.id}.jpg`)
      fs.writeFileSync(logoPath, media)
      
      if (!clan.logo) clan.logo = {}
      clan.logo.url = logoPath
      clan.logo.updatedAt = new Date().toISOString()
      await db.save()
      
      let txt = `🖼️ *ᴄʟᴀɴ ʟᴏɢᴏ ᴜᴘᴅᴀᴛᴇᴅ!*\n\n`
      txt += `╭┈┈⬡「 📋 *ʜᴀꜱɪʟ* 」\n`
      txt += `┃ 📛 Clan: *${clan.name}*\n`
      txt += `┃ 🖼️ Logo baru berhasil disimpan!\n`
      txt += `┃ 👑 Leader: @${m.sender.split('@')[0]}\n`
      txt += `╰┈┈┈┈┈┈┈┈⬡`
      
      await m.reply(txt, { mentions: [m.sender] })
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
