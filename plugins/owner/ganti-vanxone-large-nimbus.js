// owner/ganti-vanxone-large — satu file: metadata + kode fitur (gabungan dari engine3/plugins/owner/ganti-vanxone-large.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "vanxone-large",
  "command": [
    "vanxone-large",
    "setvanxonelarge",
    "gantivanxonelarge",
    "setvanxonelarge",
    "gantivanxonelarge"
  ],
  "category": "owner",
  "desc": "Preset: Ganti gambar WhatsApp Bot.jpg, serta vanxone-v7 hingga vanxone-v11.jpg sekaligus",
  "usage": ".vanxone-large (reply/kirim gambar)",
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
module.exports = __vx.plugin("owner/ganti-vanxone-large", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/ganti-vanxone-large.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const fs = __vxDef(require("fs"));
  const path = __vxDef(require("path"));
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.js"));
  const pluginConfig = {
      name: 'vanxone-large',
      alias: ['setvanxonelarge', 'gantivanxonelarge'],
      category: 'owner',
      description: 'Preset: Ganti gambar WhatsApp Bot.jpg, serta vanxone-v7 hingga vanxone-v11.jpg sekaligus',
      usage: '.vanxone-large (reply/kirim gambar)',
      example: '.vanxone-large',
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
          return m.reply(`🖼️ *WhatsApp Bot ʟᴀʀɢᴇ ᴘʀᴇsᴇᴛ*\n\n> Kirim/reply gambar untuk mengganti kumpulan foto besar (WhatsApp Bot.jpg, vanxone-v8.jpg, vanxone-v10.jpg) sekaligus.\n> Pastikan rasio gambar sesuai dengan yang diinginkan.`)
      }
      
      await m.react('🕕')
      
      try {
          let buffer
          if (m.quoted && m.quoted.isMedia) {
              buffer = await m.quoted.download()
          } else if (m.isMedia) {
              buffer = await m.download()
          }
          
          if (!buffer) {
              await m.react('❌')
              return m.reply(`❌ Gagal mendownload gambar`)
          }
          
          const targetImages = [
              'WhatsApp Bot.jpg',
              'vanxone-v8.jpg',
              'vanxone-v10.jpg'
          ]
          
          const assetsDir = path.join(process.cwd(), 'assets', 'images')
          if (!fs.existsSync(assetsDir)) {
              fs.mkdirSync(assetsDir, { recursive: true })
          }
          
          for (const imgName of targetImages) {
              const targetPath = path.join(assetsDir, imgName)
              fs.writeFileSync(targetPath, buffer)
          }
          
          await m.react('✅')
          m.reply(`✅ *ʙᴇʀʜᴀsɪʟ*\n\n> Gambar bundle *vanxone-large* berhasil diganti secara massal.\n> Mencakup: ${targetImages.join(', ')}\n> Restart bot jika gambar tidak langsung berubah.`)
          
      } catch (error) {
          await m.react('☢')
          await m.reply(te(m.prefix, m.command, m.pushName))
      }
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
