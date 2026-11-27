// group/listantilink — satu file: metadata + kode fitur (gabungan dari engine3/plugins/group/listantilink.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "listantilink",
  "command": ["listantilink", "antilinklist"],
  "category": "group",
  "desc": "Melihat daftar link yang diblokir",
  "usage": ".listantilink",
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
module.exports = __vx.plugin("group/listantilink", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/listantilink.js'
  const __vxExports = {};
  const { getDatabase } = require("../../lib/ext/src/lib/vanxone-database.js");
  const pluginConfig = {
      name: 'listantilink',
      alias: ['antilinklist', 'cekantilink'],
      category: 'group',
      description: 'Melihat daftar link yang diblokir',
      usage: '.listantilink',
      example: '.listantilink',
      isOwner: false,
      isPremium: false,
      isGroup: true,
      isPrivate: false,
      isAdmin: true,
      cooldown: 5,
      energi: 0,
      isEnabled: true
  }
  
  const DEFAULT_BLOCKED_LINKS = [
      'chat.whatsapp.com',
      'wa.me',
      'bit.ly',
      't.me',
      'telegram.me',
      'discord.gg',
      'discord.com/invite'
  ]
  
  function handler(m) {
      const db = getDatabase()
      const groupData = db.getGroup(m.chat) || {}
      const customList = groupData.antilinkList || []
      
      let txt = `🔗 *ᴅᴀꜰᴛᴀʀ ᴀɴᴛɪʟɪɴᴋ*\n\n`
      
      txt += `╭┈┈⬡「 📌 *ᴅᴇꜰᴀᴜʟᴛ* 」\n`
      DEFAULT_BLOCKED_LINKS.forEach((l, i) => {
          txt += `┃ ${i + 1}. \`${l}\`\n`
      })
      txt += `╰┈┈┈┈┈┈┈┈⬡\n\n`
      
      if (customList.length > 0) {
          txt += `╭┈┈⬡「 ➕ *ᴄᴜsᴛᴏᴍ* 」\n`
          customList.forEach((l, i) => {
              txt += `┃ ${i + 1}. \`${l}\`\n`
          })
          txt += `╰┈┈┈┈┈┈┈┈⬡\n\n`
      }
      
      txt += `> Default: *${DEFAULT_BLOCKED_LINKS.length}* link\n`
      txt += `> Custom: *${customList.length}* link\n\n`
      txt += `\`${m.prefix}addantilink <link>\` untuk tambah\n`
      txt += `\`${m.prefix}delantilink <link>\` untuk hapus`
      
      m.reply(txt)
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  Object.defineProperty(__vxExports, "DEFAULT_BLOCKED_LINKS", { enumerable: true, get: () => DEFAULT_BLOCKED_LINKS });
  return __vxExports
})
