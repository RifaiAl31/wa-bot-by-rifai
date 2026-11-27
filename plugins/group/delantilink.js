// group/delantilink — satu file: metadata + kode fitur (gabungan dari engine3/plugins/group/delantilink.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "delantilink",
  "command": [
    "delantilink",
    "delalink",
    "delblocklink",
    "remantilink"
  ],
  "category": "group",
  "desc": "Menghapus link dari daftar antilink",
  "usage": ".delantilink <domain/pattern>",
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
module.exports = __vx.plugin("group/delantilink", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/delantilink.js'
  const __vxExports = {};
  const { getDatabase } = require("../../lib/ext/src/lib/vanxone-database.js");
  const pluginConfig = {
      name: 'delantilink',
      alias: ['delalink', 'delblocklink', 'remantilink'],
      category: 'group',
      description: 'Menghapus link dari daftar antilink',
      usage: '.delantilink <domain/pattern>',
      example: '.delantilink tiktok.com',
      isOwner: false,
      isPremium: false,
      isGroup: true,
      isPrivate: false,
      isAdmin: true,
      cooldown: 5,
      energi: 0,
      isEnabled: true
  }
  
  function handler(m) {
      const db = getDatabase()
      const link = m.args.join(' ')?.trim()?.toLowerCase()
      
      if (!link) {
          const groupData = db.getGroup(m.chat) || {}
          const antilinkList = groupData.antilinkList || []
          
          if (antilinkList.length === 0) {
              return m.reply(`📋 Daftar antilink kosong!`)
          }
          
          let txt = `🔗 *ᴅᴀꜰᴛᴀʀ ᴀɴᴛɪʟɪɴᴋ*\n\n`
          antilinkList.forEach((l, i) => {
              txt += `> ${i + 1}. \`${l}\`\n`
          })
          txt += `\n> Total: *${antilinkList.length}* link`
          txt += `\n\n\`${m.prefix}delantilink <domain>\` untuk hapus`
          
          return m.reply(txt)
      }
      
      const groupData = db.getGroup(m.chat) || {}
      const antilinkList = groupData.antilinkList || []
      
      const index = antilinkList.findIndex(l => l === link)
      
      if (index === -1) {
          return m.reply(`⚠️ Link \`${link}\` tidak ditemukan di daftar antilink!`)
      }
      
      antilinkList.splice(index, 1)
      db.setGroup(m.chat, { antilinkList })
      
      m.reply(
          `✅ *ᴀɴᴛɪʟɪɴᴋ ᴅɪʜᴀᴘᴜs*\n\n` +
          `> Link: \`${link}\`\n` +
          `> Sisa: *${antilinkList.length}* link`
      )
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
