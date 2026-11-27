// owner/ganti-pp-kosong — satu file: metadata + kode fitur (gabungan dari engine3/plugins/owner/ganti-pp-kosong.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "ganti-pp-kosong.jpg",
  "command": [
    "ganti-pp-kosong.jpg",
    "gantippkosong",
    "setppkosong"
  ],
  "category": "owner",
  "desc": "Ganti gambar pp-kosong.jpg",
  "usage": ".ganti-pp-kosong.jpg (reply/kirim gambar)",
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
module.exports = __vx.plugin("owner/ganti-pp-kosong", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/ganti-pp-kosong.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const fs = __vxDef(require("fs"));
  const path = __vxDef(require("path"));
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.js"));
  const { updateAssetUrl } = require("../../lib/ext/src/lib/vanxone-uploader.js");
  const pluginConfig = {
      name: 'ganti-pp-kosong.jpg',
      alias: ['gantippkosong', 'setppkosong'],
      category: 'owner',
      description: 'Ganti gambar pp-kosong.jpg',
      usage: '.ganti-pp-kosong.jpg (reply/kirim gambar)',
      example: '.ganti-pp-kosong.jpg',
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
      if (!isImage) return m.reply(`🖼️ *ɢᴀɴᴛɪ PP-KOSONG.JPG*\n\n> Kirim/reply gambar untuk mengganti\n> File: assets/images/pp-kosong.jpg`)
      try {
          let buffer = m.quoted && m.quoted.isMedia ? await m.quoted.download() : await m.download()
          if (!buffer) return m.reply('❌ Gagal mendownload gambar')
          await m.reply(`⏳ Sedang mengupload gambar...`)
          try {
              const newUrl = await updateAssetUrl('pp-kosong', buffer, 'pp-kosong.jpg')
              m.reply(`✅ *ʙᴇʀʜᴀsɪʟ*\n\n> Gambar pp-kosong.jpg telah diganti ke URL baru:\n> ${newUrl}\n> Config telah diupdate secara realtime!`)
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
