// owner/addjpg — satu file: metadata + kode fitur (gabungan dari engine7/plugins/owner/addjpg.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "addjpg",
  "command": [
    "addjpg",
    "addimage",
    "tambahjpg",
    "setjpg"
  ],
  "category": "owner",
  "desc": "Tambah gambar baru ke folder assets/images",
  "usage": ".addjpg <nama_file.jpg> (reply gambar)",
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
module.exports = __vx.plugin("owner/addjpg", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/addjpg.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const fs = __vxDef(require("fs"));
  const path = __vxDef(require("path"));
  const config = __vxDef(require("../../lib/ext/config.e7.js"));
  const pluginConfig = {
      name: 'addjpg',
      alias: ['addimage', 'tambahjpg', 'setjpg'],
      category: 'owner',
      description: 'Tambah gambar baru ke folder assets/images',
      usage: '.addjpg <nama_file.jpg> (reply gambar)',
      example: '.addjpg WhatsApp Bot.jpg',
      isOwner: true,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 5,
      energi: 0,
      isEnabled: true
  }
  
  async function handler(m, { sock }) {
      const args = m.args || []
      const fileName = args[0]?.trim()
      
      if (!fileName || !fileName.toLowerCase().endsWith('.jpg')) {
          return m.reply(`❌ Gunakan: .addjpg <nama_file.jpg>\nContoh: .addjpg WhatsApp Bot.jpg`)
      }
      
      const isImage = m.isImage || (m.quoted && m.quoted.type === 'imageMessage')
      
      if (!isImage) {
          return m.reply(`🖼️ Reply gambar yang ingin ditambahkan.`)
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
          
          const targetPath = path.join(process.cwd(), 'assets', 'images', fileName)
          const dir = path.dirname(targetPath)
          if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
          
          fs.writeFileSync(targetPath, buffer)
          
          m.reply(`✅ *ʙᴇʀʜᴀsɪʟ*\n> Gambar telah tersimpan sebagai assets/images/${fileName}\n> Restart bot untuk melihat perubahan jika perlu.`)
          
      } catch (err) {
          m.reply(`❌ *ᴇʀʀᴏʀ*\n> ${err.message}`)
      }
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
