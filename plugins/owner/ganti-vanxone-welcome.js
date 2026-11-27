// owner/ganti-vanxone-welcome — satu file: metadata + kode fitur (gabungan dari engine3/plugins/owner/ganti-vanxone-welcome.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "ganti-vanxone-welcome.jpg",
  "command": [
    "ganti-vanxone-welcome.jpg",
    "gantiwelcome",
    "setvanxonewelcome"
  ],
  "category": "owner",
  "desc": "Ganti gambar vanxone-welcome.jpg (thumbnail welcome)",
  "usage": ".ganti-vanxone-welcome.jpg (reply/kirim gambar)",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/owner").split('\\').join('/')
module.exports = __vx.plugin("owner/ganti-vanxone-welcome", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/ganti-vanxone-welcome.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const fs = __vxDef(require("fs"));
  const path = __vxDef(require("path"));
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.js"));
  const { updateAssetUrl } = require("../../lib/ext/src/lib/vanxone-uploader.js");
  const pluginConfig = {
      name: 'ganti-vanxone-welcome.jpg',
      alias: ['gantiwelcome', 'setvanxonewelcome'],
      category: 'owner',
      description: 'Ganti gambar vanxone-welcome.jpg (thumbnail welcome)',
      usage: '.ganti-vanxone-welcome.jpg (reply/kirim gambar)',
      example: '.ganti-vanxone-welcome.jpg',
      isOwner: true,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 5,
      energi: 0,
      isEnabled: true
  }
  
  async function handler(m, { sock }) {
      const isImage = m.isImage || (m.quoted && m.quoted.type === 'imageMessage')
      
      if (!isImage) {
          return m.reply(`🖼️ *ɢᴀɴᴛɪ WhatsApp Bot-ᴡᴇʟᴄᴏᴍᴇ.ᴊᴘɢ*\n\n> Kirim/reply gambar untuk mengganti\n> File: assets/images/vanxone-welcome.jpg`)
      }
      
      try {
          let buffer
          if (m.quoted && m.quoted.isMedia) {
              buffer = await m.quoted.download()
          } else if (m.isMedia) {
              buffer = await m.download()
          }
          
          if (!buffer) {
              return m.reply(`❌ Gagal mendownload gambar`)
          }
          
          await m.reply(`⏳ Sedang mengupload gambar...`)
          try {
              const newUrl = await updateAssetUrl('vanxone-welcome', buffer, 'vanxone-welcome.jpg')
              m.reply(`✅ *ʙᴇʀʜᴀsɪʟ*\n\n> Gambar vanxone-welcome.jpg telah diganti ke URL baru:\n> ${newUrl}\n> Config telah diupdate secara realtime!`)
          } catch (e) {
              m.reply(`❌ Gagal mengupload gambar: ${e.message}`)
          }
      } catch (error) {
          await m.reply(te(m.prefix, m.command, m.pushName))
      }
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
