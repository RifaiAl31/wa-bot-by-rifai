// canvas/fakeimgios — satu file: metadata + kode fitur (gabungan dari engine1/plugins/canvas/fakeimgios.js)
const __vx = require("../../lib/adapter/e1.js")
const __meta = {
  "name": "fakeimgios",
  "command": [
    "fakeimgios",
    "imgios"
  ],
  "category": "image",
  "desc": "Membuat gambar ss ios",
  "usage": ".fakeimgios",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 10,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/canvas").split('\\').join('/')
module.exports = __vx.plugin("canvas/fakeimgios", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/fakeimgios.js'
  const module = { exports: {} }; const exports = module.exports;
  const axios = require('axios')
  const config = require("../../lib/ext/config.js")
  const { uploadToTmpFiles } = require("../../lib/ext/src/lib/sea.js")
  
  const pluginConfig = {
      name: 'fakeimgios',
      alias: ['imgios'],
      category: 'canvas',
      description: 'Membuat gambar ss ios',
      usage: '.fakeimgios',
      example: '.fakeimgios',
      isOwner: false,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 10,
      energi: 1,
      isEnabled: true
  }
  
  async function handler(m, { sock }) {
       const isImage = m.isImage || (m.quoted && m.quoted.isImage)
          
          if (!isImage) {
              m.react('❌')
              return m.reply(
                  `📷 *FAKE IMG IOS*\n\n` +
                  `Tolong Reply gambar nya`
              )
          }
          
          let imageBuffer
          if (m.isImage && m.download) {
              imageBuffer = await m.download()
          } else if (m.quoted && m.quoted.isImage && m.quoted.download) {
              imageBuffer = await m.quoted.download()
          }
          
          if (!imageBuffer) {
              m.react('❌')
              return m.reply(`❌ *Gomen ne~* ✦\n\n> Tidak bisa download gambar~ 🥺`)
          }
      
      m.react('🕕')
      
      try {
          const gmbr = await uploadToTmpFiles(imageBuffer, {
              filename: 'image.jpg',
              contentType: 'image/jpeg'
          })
          await sock.sendMedia(m.chat, `https://kazztzyy.my.id/api/maker/img2ios?image=${encodeURIComponent(gmbr.directUrl)}`, null, m, {
              type: 'image',
          })
          
          m.react('✅')
          
      } catch (error) {
          m.react('❌')
          m.reply(`❌ *Gomen ne~* ✦\n\n> ${error.message}\n\n_Ai udah coba yang terbaik tapi gagal juga... coba lagi nanti ya~ 🌸_`)
      }
  }
  
  module.exports = {
      config: pluginConfig,
      handler
  }
  return module.exports
})
