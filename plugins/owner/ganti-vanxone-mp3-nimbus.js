// owner/ganti-vanxone-mp3 — satu file: metadata + kode fitur (gabungan dari engine3/plugins/owner/ganti-vanxone-mp3.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "ganti-vanxone.mp3",
  "command": [
    "ganti-vanxone.mp3",
    "gantivanxoneaudio",
    "setvanxoneaudio",
    "gantivanxoneaudio",
    "setvanxoneaudio"
  ],
  "category": "owner",
  "desc": "Ganti audio WhatsApp Bot.mp3",
  "usage": ".ganti-vanxone.mp3 (reply/kirim audio)",
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
module.exports = __vx.plugin("owner/ganti-vanxone-mp3", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/ganti-vanxone-mp3.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const fs = __vxDef(require("fs"));
  const path = __vxDef(require("path"));
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.js"));
  const { updateAssetUrl } = require("../../lib/ext/src/lib/vanxone-uploader.js");
  const pluginConfig = {
      name: 'ganti-vanxone.mp3',
      alias: ['gantivanxoneaudio', 'setvanxoneaudio'],
      category: 'owner',
      description: 'Ganti audio WhatsApp Bot.mp3',
      usage: '.ganti-vanxone.mp3 (reply/kirim audio)',
      example: '.ganti-vanxone.mp3',
      isOwner: true,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 5,
      energi: 0,
      isEnabled: true
  }
  
  async function handler(m, { sock }) {
      const isAudio = m.type === 'audioMessage' || (m.quoted && m.quoted.type === 'audioMessage')
      
      if (!isAudio) {
          return m.reply(`🎵 *ɢᴀɴᴛɪ WhatsApp Bot.ᴍᴘ3*\n\n> Kirim/reply audio untuk mengganti\n> File: assets/audio/vanxone.mp3`)
      }
      
      try {
          let buffer
          if (m.quoted && m.quoted.isMedia) {
              buffer = await m.quoted.download()
          } else if (m.isMedia) {
              buffer = await m.download()
          }
          
          if (!buffer) {
              return m.reply(`❌ Gagal mendownload audio`)
          }
          
          await m.reply(`⏳ Sedang mengupload gambar...`)
          try {
              const newUrl = await updateAssetUrl('vanxone-mp3', buffer, 'WhatsApp Bot.mp3')
              m.reply(`✅ *ʙᴇʀʜᴀsɪʟ*\n\n> File WhatsApp Bot.mp3 telah diganti ke URL baru:\n> ${newUrl}\n> Config telah diupdate secara realtime!`)
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
