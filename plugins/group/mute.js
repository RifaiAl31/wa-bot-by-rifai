// group/mute — satu file: metadata + kode fitur (gabungan dari engine3/plugins/group/mute.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "mute",
  "command": [
    "bisukan"
  ],
  "category": "group",
  "desc": "Bisukan seluruh grup (hanya admin yang bisa kirim pesan)",
  "usage": ".mute",
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
module.exports = __vx.plugin("group/mute", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/mute.js'
  const __vxExports = {};
  const { getDatabase } = require("../../lib/ext/src/lib/vanxone-database.js");
  const pluginConfig = {
      name: 'mute',
      alias: ['bisukan'],
      category: 'group',
      description: 'Bisukan seluruh grup (hanya admin yang bisa kirim pesan)',
      usage: '.mute',
      example: '.mute',
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
  
      if (group.mute) return m.reply('❌ Grup sudah dalam keadaan mute.')
  
      db.setGroup(m.chat, { ...group, mute: true })
      m.reply(`✅ Grup *${groupName}* berhasil di-mute oleh @${m.sender.split('@')[0]}\n\nHanya admin yang bisa mengirim pesan.\nKetik *${m.prefix}unmute* untuk membuka kembali.`, { mentions: [m.sender] })
  }
  
  function isMuted(groupJid, db) {
      const group = db.getGroup(groupJid) || {}
      return !!group.mute
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  Object.defineProperty(__vxExports, "isMuted", { enumerable: true, get: () => isMuted });
  return __vxExports
})
