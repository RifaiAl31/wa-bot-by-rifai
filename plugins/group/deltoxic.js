// group/deltoxic — satu file: metadata + kode fitur (gabungan dari engine3/plugins/group/deltoxic.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "deltoxic",
  "command": [
    "deltoxic",
    "hapustoxic",
    "remtoxic",
    "removetoxic"
  ],
  "category": "group",
  "desc": "Hapus kata toxic dari daftar",
  "usage": ".deltoxic <kata>",
  "owner": false,
  "group": true,
  "private": false,
  "premium": false,
  "admin": true,
  "botAdmin": false,
  "cooldown": 3,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/group").split('\\').join('/')
module.exports = __vx.plugin("group/deltoxic", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/deltoxic.js'
  const __vxExports = {};
  const { getDatabase } = require("../../lib/ext/src/lib/vanxone-database.js");
  const pluginConfig = {
      name: 'deltoxic',
      alias: ['hapustoxic', 'remtoxic', 'removetoxic'],
      category: 'group',
      description: 'Hapus kata toxic dari daftar',
      usage: '.deltoxic <kata>',
      example: '.deltoxic kata_kasar',
      isOwner: false,
      isPremium: false,
      isGroup: true,
      isPrivate: false,
      isAdmin: true,
      cooldown: 3,
      energi: 0,
      isEnabled: true
  }
  
  async function handler(m, { sock }) {
      const db = getDatabase()
      const word = m.args.join(' ').trim().toLowerCase()
      
      if (!word) {
          return m.reply(
              `🗑️ *ᴅᴇʟ ᴛᴏxɪᴄ*\n\n` +
              `> Gunakan: \`.deltoxic <kata>\`\n\n` +
              `\`Contoh: ${m.prefix}deltoxic katakasar\``
          )
      }
      
      const groupData = db.getGroup(m.chat) || {}
      const toxicWords = groupData.toxicWords || []
      
      const index = toxicWords.indexOf(word)
      
      if (index === -1) {
          return m.reply(`❌ *ɢᴀɢᴀʟ*\n\n> Kata \`${word}\` tidak ada di daftar`)
      }
      
      toxicWords.splice(index, 1)
      db.setGroup(m.chat, { toxicWords })
      
      m.react('✅')
      
      await m.reply(
          `✅ *ᴋᴀᴛᴀ ᴛᴏxɪᴄ ᴅɪʜᴀᴘᴜs*\n\n` +
          `╭┈┈⬡「 📋 *ᴅᴇᴛᴀɪʟ* 」\n` +
          `┃ 📝 ᴋᴀᴛᴀ: \`${word}\`\n` +
          `┃ 📊 sɪsᴀ: \`${toxicWords.length}\` kata\n` +
          `╰┈┈⬡`
      )
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
