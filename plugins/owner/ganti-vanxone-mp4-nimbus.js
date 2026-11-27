// owner/ganti-vanxone-mp4 — satu file: metadata + kode fitur (gabungan dari engine3/plugins/owner/ganti-vanxone-mp4.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "ganti-vanxone.mp4",
  "command": [
    "ganti-vanxone.mp4",
    "gantivanxonevideo",
    "setvanxonevideo",
    "gantivanxonevideo",
    "setvanxonevideo"
  ],
  "category": "owner",
  "desc": "Ganti video WhatsApp Bot.mp4",
  "usage": ".ganti-vanxone.mp4 (reply/kirim video)",
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
module.exports = __vx.plugin("owner/ganti-vanxone-mp4", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/ganti-vanxone-mp4.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const fs = __vxDef(require("fs"));
  const path = __vxDef(require("path"));
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.js"));
  const { updateAssetUrl } = require("../../lib/ext/src/lib/vanxone-uploader.js");
  const pluginConfig = {
      name: 'ganti-vanxone.mp4',
      alias: ['gantivanxonevideo', 'setvanxonevideo'],
      category: 'owner',
      description: 'Ganti video WhatsApp Bot.mp4',
      usage: '.ganti-vanxone.mp4 (reply/kirim video)',
      example: '.ganti-vanxone.mp4',
      isOwner: true,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 5,
      energi: 0,
      isEnabled: true
  }
  
  async function handler(m, { sock }) {
      const isVideo = m.type === 'videoMessage' || (m.quoted && m.quoted.type === 'videoMessage')
      
      if (!isVideo) {
          return m.reply(`🎬 *ɢᴀɴᴛɪ WhatsApp Bot.ᴍᴘ4*\n\n> Kirim/reply video untuk mengganti\n> File: assets/video/vanxone.mp4`)
      }
      
      try {
          let buffer
          if (m.quoted && m.quoted.isMedia) {
              buffer = await m.quoted.download()
          } else if (m.isMedia) {
              buffer = await m.download()
          }
          
          if (!buffer) {
              return m.reply(`❌ Gagal mendownload video`)
          }
          
          await m.reply(`⏳ Sedang mengupload gambar...`)
          try {
              const newUrl = await updateAssetUrl('vanxone-mp4', buffer, 'WhatsApp Bot.mp4')
              m.reply(`✅ *ʙᴇʀʜᴀsɪʟ*\n\n> File WhatsApp Bot.mp4 telah diganti ke URL baru:\n> ${newUrl}\n> Config telah diupdate secara realtime!`)
          } catch (e) {
              m.reply(`❌ Gagal mengupload file: ${e.message}`)
          }
      } catch (error) {
          await m.reply(te(m.prefix, m.command, m.pushName))
      }
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
