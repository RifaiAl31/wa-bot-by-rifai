// group/addantilink — satu file: metadata + kode fitur (gabungan dari engine3/plugins/group/addantilink.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "addantilink",
  "command": [
    "addantilink",
    "addalink",
    "addblocklink"
  ],
  "category": "group",
  "desc": "Menambah link ke daftar antilink",
  "usage": ".addantilink <domain/pattern>",
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
module.exports = __vx.plugin("group/addantilink", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/addantilink.js'
  const __vxExports = {};
  const { getDatabase } = require("../../lib/ext/src/lib/vanxone-database.js");
  const pluginConfig = {
      name: 'addantilink',
      alias: ['addalink', 'addblocklink'],
      category: 'group',
      description: 'Menambah link ke daftar antilink',
      usage: '.addantilink <domain/pattern>',
      example: '.addantilink tiktok.com',
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
      const link = m.text?.toLowerCase()
      
      if (!link) {
          return m.reply(
              `🔗 *ᴀᴅᴅ ᴀɴᴛɪʟɪɴᴋ*\n\n` +
              `> Masukkan domain/pattern link yang ingin diblokir\n\n` +
              `\`Contoh:\`\n` +
              `\`${m.prefix}addantilink tiktok.com\`\n` +
              `\`${m.prefix}addantilink chat.whatsapp.com\`\n` +
              `\`${m.prefix}addantilink instagram.com\``
          )
      }
      
      const groupData = db.getGroup(m.chat) || {}
      const antilinkList = groupData.antilinkList || []
      
      if (antilinkList.includes(link)) {
          return m.reply(`⚠️ Link \`${link}\` sudah ada di daftar antilink!`)
      }
      
      antilinkList.push(link)
      db.setGroup(m.chat, { antilinkList })
      
      m.reply(
          `✅ *ᴀɴᴛɪʟɪɴᴋ ᴅɪᴛᴀᴍʙᴀʜ*\n\n` +
          `> Link: \`${link}\`\n` +
          `> Total: *${antilinkList.length}* link\n\n` +
          `> Gunakan \`${m.prefix}listantilink\` untuk melihat daftar`
      )
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
