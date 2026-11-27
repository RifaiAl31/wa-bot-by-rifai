// group/listtoxic — satu file: metadata + kode fitur (gabungan dari engine3/plugins/group/listtoxic.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "listtoxic",
  "command": [
    "listtoxic",
    "toxiclist",
    "katatoxic",
    "lihatkata"
  ],
  "category": "group",
  "desc": "Lihat daftar kata toxic",
  "usage": ".listtoxic",
  "owner": false,
  "group": true,
  "private": false,
  "premium": false,
  "admin": true,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/group").split('\\').join('/')
module.exports = __vx.plugin("group/listtoxic", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/listtoxic.js'
  const __vxExports = {};
  const { getDatabase } = require("../../lib/ext/src/lib/vanxone-database.js");
  const { DEFAULT_TOXIC_WORDS } = require("../../lib/ext/plugins/e3/group/antitoxic.js");
  const pluginConfig = {
      name: 'listtoxic',
      alias: ['toxiclist', 'katatoxic', 'lihatkata'],
      category: 'group',
      description: 'Lihat daftar kata toxic',
      usage: '.listtoxic',
      example: '.listtoxic',
      isOwner: false,
      isPremium: false,
      isGroup: true,
      isPrivate: false,
      isAdmin: true,
      cooldown: 5,
      energi: 0,
      isEnabled: true
  }
  
  async function handler(m, { sock }) {
      const db = getDatabase()
      const groupData = db.getGroup(m.chat) || {}
      
      const customWords = groupData.toxicWords || []
      const defaultWords = DEFAULT_TOXIC_WORDS || []
      
      let text = `📋 *ᴅᴀꜰᴛᴀʀ ᴋᴀᴛᴀ ᴛᴏxɪᴄ*\n\n`
      
      if (customWords.length > 0) {
          text += `╭┈┈⬡「 ✏️ *ᴄᴜsᴛᴏᴍ* (${customWords.length}) 」\n`
          for (let i = 0; i < customWords.length; i++) {
              text += `┃ ${i + 1}. ${customWords[i]}\n`
          }
          text += `╰┈┈┈┈┈┈┈┈⬡\n\n`
      }
      
      text += `╭┈┈⬡「 📦 *ᴅᴇꜰᴀᴜʟᴛ* (${defaultWords.length}) 」\n`
      
      for (let i = 0; i < defaultWords.length; i++) {
          text += `┃ ${i + 1}. ${defaultWords[i]}\n`
      }
      text += `╰┈┈┈┈┈┈┈┈⬡\n\n`
      
      text += `Total: *${customWords.length + defaultWords.length}* kata\n`
      text += `\`.addtoxic <kata>\` untuk tambah\n`
      text += `\`.deltoxic <kata>\` untuk hapus`
      
      await m.reply(text)
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
