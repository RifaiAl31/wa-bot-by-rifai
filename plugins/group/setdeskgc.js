// group/setdeskgc — satu file: metadata + kode fitur (gabungan dari engine3/plugins/group/setdeskgc.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "setdeskgc",
  "command": [
    "setdeskgc",
    "setdescgc",
    "setdesk"
  ],
  "category": "group",
  "desc": "Mengubah deskripsi grup",
  "usage": ".setdeskgc <deskripsi baru>",
  "owner": false,
  "group": true,
  "private": false,
  "premium": false,
  "admin": true,
  "botAdmin": true,
  "cooldown": 10,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/group").split('\\').join('/')
module.exports = __vx.plugin("group/setdeskgc", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/setdeskgc.js'
  const __vxExports = {};
  const pluginConfig = {
      name: 'setdeskgc',
      alias: ['setdesc', 'setdescgc', 'setdeskripsi', 'setdesk'],
      category: 'group',
      description: 'Mengubah deskripsi grup',
      usage: '.setdeskgc <deskripsi baru>',
      example: '.setdeskgc Grup untuk diskusi',
      isOwner: false,
      isPremium: false,
      isGroup: true,
      isPrivate: false,
      isAdmin: true,
      isBotAdmin: true,
      cooldown: 10,
      energi: 0,
      isEnabled: true
  }
  
  async function handler(m, { sock }) {
      const newDesc = m.text?.trim() || ''
      if (!m.text && m.args?.length === 0) {
          await m.reply(
              `⚠️ *ᴄᴀʀᴀ ᴘᴀᴋᴀɪ*\n\n` +
              `> \`${m.prefix}setdeskgc Deskripsi baru\`\n` +
              `> \`${m.prefix}setdeskgc clear\` - Hapus deskripsi`
          )
          return
      }
      const descToSet = newDesc.toLowerCase() === 'clear' ? '' : newDesc
      
      if (descToSet.length > 2048) {
          await m.reply(
              `⚠️ *ᴠᴀʟɪᴅᴀsɪ*\n\n` +
              `> Deskripsi maksimal 2048 karakter.`
          )
          return
      }
      
      try {
          await sock.groupUpdateDescription(m.chat, descToSet)
          
          if (descToSet) {
              await m.reply(
                  `✅ Deskripsi grup berhasil diperbarui!`
              )
          } else {
              await m.reply(
                  `✅ Deskripsi grup berhasil dihapus!`
              )
          }
      } catch (error) {
          await m.reply(
              `❌ *ɢᴀɢᴀʟ*\n\n` +
              `> Tidak dapat mengubah deskripsi grup.\n` +
              `> _${error.message}_`
          )
      }
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
