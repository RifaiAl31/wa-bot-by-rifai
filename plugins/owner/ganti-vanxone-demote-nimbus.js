// owner/ganti-vanxone-demote — satu file: metadata + kode fitur (gabungan dari engine3/plugins/owner/ganti-vanxone-demote.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "ganti-vanxone-demote.jpg",
  "command": [
    "ganti-vanxone-demote.jpg",
    "gantivanxonedemote",
    "setvanxonedemote",
    "gantivanxonedemote",
    "setvanxonedemote"
  ],
  "category": "owner",
  "desc": "Ganti gambar vanxone-demote.jpg",
  "usage": ".ganti-vanxone-demote.jpg (reply/kirim gambar)",
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
module.exports = __vx.plugin("owner/ganti-vanxone-demote", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/ganti-vanxone-demote.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const fs = __vxDef(require("fs"));
  const path = __vxDef(require("path"));
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.js"));
  const { updateAssetUrl } = require("../../lib/ext/src/lib/vanxone-uploader.js");
  const pluginConfig = {
      name: 'ganti-vanxone-demote.jpg',
      alias: ['gantivanxonedemote', 'setvanxonedemote'],
      category: 'owner',
      description: 'Ganti gambar vanxone-demote.jpg',
      usage: '.ganti-vanxone-demote.jpg (reply/kirim gambar)',
      example: '.ganti-vanxone-demote.jpg',
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
      if (!isImage) return m.reply(`🖼️ *ɢᴀɴᴛɪ VANXONE-DEMOTE.JPG*\n\n> Kirim/reply gambar untuk mengganti\n> File: assets/images/vanxone-demote.jpg`)
      try {
          let buffer = m.quoted && m.quoted.isMedia ? await m.quoted.download() : await m.download()
          if (!buffer) return m.reply('❌ Gagal mendownload gambar')
          await m.reply(`⏳ Sedang mengupload gambar...`)
          try {
              const newUrl = await updateAssetUrl('vanxone-demote', buffer, 'vanxone-demote.jpg')
              m.reply(`✅ *ʙᴇʀʜᴀsɪʟ*\n\n> Gambar vanxone-demote.jpg telah diganti ke URL baru:\n> ${newUrl}\n> Config telah diupdate secara realtime!`)
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
