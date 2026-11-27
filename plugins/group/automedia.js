// group/automedia — satu file: metadata + kode fitur (gabungan dari engine3/plugins/group/automedia.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "automedia",
  "command": [
    "automedia",
    "automedi"
  ],
  "category": "group",
  "desc": "Toggle auto media - otomatis jadikan sticker jadi gambar/video",
  "usage": ".automedia on/off",
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
module.exports = __vx.plugin("group/automedia", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/automedia.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const config = __vxDef(require("../../lib/ext/config.e3.js"));
  const { getDatabase } = require("../../lib/ext/src/lib/vanxone-database.js");
  const pluginConfig = {
      name: 'automedia',
      alias: ['automedi', 'am'],
      category: 'group',
      description: 'Toggle auto media - otomatis jadikan sticker jadi gambar/video',
      usage: '.automedia on/off',
      example: '.automedia on',
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
      const args = m.args || []
      const groupData = db.getGroup(m.chat) || {}
      const current = groupData.automedia ?? false
      const arg = args[0]?.toLowerCase()
      
      if (!arg) {
          const status = current ? '✅ Aktif' : '❌ Nonaktif'
          return m.reply(
              `🎬 *ᴀᴜᴛᴏᴍᴇᴅɪᴀ*\n\n` +
              `> Status: ${status}\n\n` +
              `> Gunakan:\n` +
              `> \`${m.prefix}automedia on\` - aktifkan\n` +
              `> \`${m.prefix}automedia off\` - nonaktifkan\n\n` +
              `> _Otomatis jadikan sticker jadi gambar_\n` +
              `> Video gak jadi bang`
          )
      }
      
      if (arg === 'on' || arg === '1' || arg === 'aktif') {
          if (current) {
              return m.reply(`🎬 *ᴀᴜᴛᴏᴍᴇᴅɪᴀ*\n\n> Sudah aktif!`)
          }
          db.setGroup(m.chat, { automedia: true })
          await db.save()
          return m.reply(`🎬 *ᴀᴜᴛᴏᴍᴇᴅɪᴀ*\n\n> ✅ Berhasil diaktifkan!\n> Sticker akan otomatis jadi gambar/video`)
      }
      
      if (arg === 'off' || arg === '0' || arg === 'nonaktif') {
          if (!current) {
              return m.reply(`🎬 *ᴀᴜᴛᴏᴍᴇᴅɪᴀ*\n\n> Sudah nonaktif!`)
          }
          db.setGroup(m.chat, { automedia: false })
          await db.save()
          return m.reply(`🎬 *ᴀᴜᴛᴏᴍᴇᴅɪᴀ*\n\n> ❌ Berhasil dinonaktifkan!`)
      }
      
      return m.reply(`❌ Gunakan: \`${m.prefix}automedia on/off\``)
  }
  
  async function autoMediaHandler(m, sock) {
      try {
          if (!m) return false
          if (!m.isGroup) return false
          if (m.isCommand) return false
          if (m.fromMe === true) return false
          
          const db = getDatabase()
          const groupData = db.getGroup(m.chat) || {}
          
          if (!groupData.automedia) return false
          
          const msg = m.message
          if (!msg) return false
          
          const hasSticker = msg.stickerMessage
          if (!hasSticker) return false
          
          if (hasSticker.isAnimated) return false
          
          const buffer = await m.download()
          if (!buffer || buffer.length === 0) return false
          
          await sock.sendMedia(m.chat, buffer, null, m, { 
              type: 'image',
          })
          
          return true
      } catch (err) {
          return false
      }
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  Object.defineProperty(__vxExports, "autoMediaHandler", { enumerable: true, get: () => autoMediaHandler });
  return __vxExports
})
