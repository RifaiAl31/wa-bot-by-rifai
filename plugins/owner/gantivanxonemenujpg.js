// owner/gantivanxonemenujpg — satu file: metadata + kode fitur (gabungan dari engine7/plugins/owner/gantivanxonemenujpg.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "ganti-vanxone-menu.jpg",
  "command": [
    "ganti-vanxone-menu.jpg",
    "ganvanxonemenu",
    "setvanxonemenu"
  ],
  "category": "owner",
  "desc": "Ganti gambar WhatsApp Bot.jpg (thumbnail menu)",
  "usage": ".ganti-vanxone-menu.jpg (reply/kirim gambar)",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/owner").split('\\').join('/')
module.exports = __vx.plugin("owner/gantivanxonemenujpg", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/gantivanxonemenujpg.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const fs = __vxDef(require("fs"));
  const path = __vxDef(require("path"));
  const pluginConfig = {
      name: 'ganti-vanxone-menu.jpg',
      alias: ['ganvanxonemenu', 'setvanxonemenu'],
      category: 'owner',
      description: 'Ganti gambar WhatsApp Bot.jpg (thumbnail menu)',
      usage: '.ganti-vanxone-menu.jpg (reply/kirim gambar)',
      example: '.ganti-vanxone-menu.jpg',
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
          return m.reply(`🖼️ *ɢᴀɴᴛɪ WhatsApp Bot.jpg*\n\n> Kirim/reply gambar untuk mengganti\n> File: assets/images/vanxone.jpg`)
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
          
          const targetPath = path.join(process.cwd(), 'assets', 'images', 'WhatsApp Bot.jpg')
          
          const dir = path.dirname(targetPath)
          if (!fs.existsSync(dir)) {
              fs.mkdirSync(dir, { recursive: true })
          }
          
          fs.writeFileSync(targetPath, buffer)
          
          m.reply(`✅ *ʙᴇʀʜᴀsɪʟ*\n\n> Gambar WhatsApp Bot.jpg telah diganti\n> Restart bot untuk melihat perubahan`)
          
      } catch (error) {
          m.reply(`❌ *ᴇʀʀᴏʀ*\n\n> ${error.message}`)
      }
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
