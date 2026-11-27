// group/unmute — satu file: metadata + kode fitur (gabungan dari engine3/plugins/group/unmute.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "unmute",
  "command": [
    "unbisukan"
  ],
  "category": "group",
  "desc": "Membuka mute grup",
  "usage": ".unmute",
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
module.exports = __vx.plugin("group/unmute", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/unmute.js'
  const __vxExports = {};
  const { getDatabase } = require("../../lib/ext/src/lib/vanxone-database.js");
  const pluginConfig = {
      name: 'unmute',
      alias: ['unbisukan'],
      category: 'group',
      description: 'Membuka mute grup',
      usage: '.unmute',
      example: '.unmute',
      isOwner: false,
      isPremium: false,
      isGroup: true,
      isPrivate: false,
      isAdmin: true,
      isBotAdmin: false,
      cooldown: 5,
      energi: 0,
      isEnabled: true
  }
  
  function handler(m, { sock }) {
      const db = getDatabase()
      const group = db.getGroup(m.chat) || {}
      const groupName = m.groupMetadata.subject
  
      if (!group.mute) return m.reply('❌ Grup tidak sedang di-mute.')
  
      db.setGroup(m.chat, { ...group, mute: false })
      m.reply(`✅ Grup *${groupName}* berhasil di-unmute oleh @${m.sender.split('@')[0]}\n\nSemua member sekarang bisa mengirim pesan.`, { mentions: [m.sender] })
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
