// fun/burik — satu file: metadata + kode fitur (gabungan dari engine7/plugins/fun/burik.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "burik",
  "command": [
    "burik",
    "rusak",
    "jelek"
  ],
  "category": "fun",
  "desc": "Membuat foto menjadi burik/rusak",
  "usage": ".burik (reply foto)",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/fun").split('\\').join('/')
module.exports = __vx.plugin("fun/burik", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/burik.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const sharp = __vxDef(require("sharp"));
  const config = __vxDef(require("../../lib/ext/config.e7.js"));
  const pluginConfig = {
      name: 'burik',
      alias: ['rusak', 'jelek'],
      category: 'fun',
      description: 'Membuat foto menjadi burik/rusak',
      usage: '.burik (reply foto)',
      example: '.burik (reply foto)',
      isOwner: false,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 5,
      energi: 1,
      isEnabled: true
  }
  
  async function handler(m, { sock }) {
      try {
          const isQuotedImage = m.isQuoted && m.quoted?.isImage
          const isDirectImage = m.isImage
  
          if (!isQuotedImage && !isDirectImage) {
              return await m.reply('❗ Reply atau kirim sebuah foto terlebih dahulu!')
          }
  
          await m.reply('⏳ Sedang memproses foto...')
  
          const target = isQuotedImage ? m.quoted : m
          const buffer = await target.download()
          if (!buffer) return await m.reply('❌ Gagal mengunduh foto!')
  
          const resultBuffer = await sharp(buffer)
              .resize({ width: 100, height: 100, fit: 'inside' })
              .jpeg({ quality: 15 })
              .toBuffer()
          await m.replyImage(resultBuffer, '📸 Foto burik berhasil dibuat!')
  
      } catch (error) {
          console.error('Burik Plugin Error:', error)
          await m.reply(`❌ *GAGAL*\n\n> ${error.message}`)
      }
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
