// tools/gepeng — satu file: metadata + kode fitur (gabungan dari engine1/plugins/tools/gepeng.js)
const __vx = require("../../lib/adapter/e1.js")
const __meta = {
  "name": "gepeng",
  "command": [
    "gepeng",
    "geoghast",
    "peng"
  ],
  "category": "tools",
  "desc": "Bot otomatis menggepengkan gambar (compress height)",
  "usage": ".gepeng",
  "owner": false,
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
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/tools").split('\\').join('/')
module.exports = __vx.plugin("tools/gepeng", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/gepeng.js'
  const module = { exports: {} }; const exports = module.exports;
  const fs = require('fs')
  const path = require('path')
  const Jimp = require('jimp') // pastikan sudah install jimp: npm i jimp
  
  const pluginConfig = {
      name: 'gepeng',
      alias: ['geoghast', 'peng'],
      category: 'tools',
      description: 'Bot otomatis menggepengkan gambar (compress height)',
      usage: '.gepeng',
      example: '.gepeng (reply gambar)',
      isOwner: false,
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
          return m.reply(
  `📌 *Gepeng Image*
  
  > Reply gambar dengan command:
  > \`.gepeng\` - Bot akan mengubah gambar menjadi gepeng (height dikompres)
  
  ✨ Powered by WhatsApp Bot Idol ✨`
          )
      }
  
      m.react('🕕') // reaction processing
  
      let buffer
      try {
          if (m.quoted && m.quoted.isMedia) {
              buffer = await m.quoted.download()
          } else if (m.isMedia) {
              buffer = await m.download()
          } else {
              throw new Error('Gagal download gambar')
          }
      } catch (e) {
          m.react('❌')
          return m.reply(`❌ *WhatsApp Bot Error*\n\n> ${e.message}`)
      }
  
      try {
          const image = await Jimp.read(buffer)
          const newHeight = Math.floor(image.bitmap.height * 0.5) // 50% height
          image.resize(image.bitmap.width, newHeight) // width tetap, height dikompres
  
          const outBuffer = await image.getBufferAsync(Jimp.MIME_PNG)
  
          const caption =
  `╭━─❖「 🖼️ GEPENG IMAGE 」❖─━╮
  ┃ 📝 Dari: ${m.quoted?.filename || 'gambar'}
  ┃ 📏 Ukuran asli: ${image.bitmap.width}x${image.bitmap.height}
  ┃ 📏 Ukuran gepeng: ${image.bitmap.width}x${newHeight}
  ╰─❖ Selamat menikmati hasil gepeng! ❖─╯
  ✨ Powered by WhatsApp Bot Idol ✨`
  
          m.react('✨')
  
          await sock.sendMessage(m.chat, {
              image: outBuffer,
              caption
          }, { quoted: m })
  
      } catch (e) {
          console.error(e)
          m.react('❌')
          return m.reply(`❌ *WhatsApp Bot Error*\n\n> Gagal memproses gambar`)
      }
  }
  
  module.exports = { config: pluginConfig, handler }
  return module.exports
})
