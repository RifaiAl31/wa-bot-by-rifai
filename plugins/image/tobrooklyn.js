// canvas/tobrooklyn — satu file: metadata + kode fitur (gabungan dari engine1/plugins/canvas/tobrooklyn.js)
const __vx = require("../../lib/adapter/e1.js")
const __meta = {
  "name": "tobrooklyn",
  "command": [
    "tobrooklyn",
    "brooklyn",
    "filterbrooklyn"
  ],
  "category": "image",
  "desc": "Membuat filter Brooklyn pada gambar",
  "usage": ".tobrooklyn (reply gambar)",
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
module.exports = __vx.plugin("canvas/tobrooklyn", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/tobrooklyn.js'
  const module = { exports: {} }; const exports = module.exports;
  const axios = require('axios')
  const config = require("../../lib/ext/config.js")
  
  const pluginConfig = {
      name: 'tobrooklyn',
      alias: ['brooklyn', 'filterbrooklyn'],
      category: 'canvas',
      description: 'Membuat filter Brooklyn pada gambar',
      usage: '.tobrooklyn (reply gambar)',
      example: '.tobrooklyn',
      isOwner: false,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 10,
      energi: 1,
      isEnabled: true
  }
  
  async function uploadToTmpfiles(buffer) {
      const FormData = require('form-data')
      const formData = new FormData()
      formData.append('file', buffer, { filename: 'image.jpg' })
      
      const res = await axios.post('https://tmpfiles.org/api/v1/upload', formData, {
          headers: formData.getHeaders(),
          timeout: 60000
      })
      
      if (res.data?.data?.url) {
          return res.data.data.url.replace('tmpfiles.org/', 'tmpfiles.org/dl/')
      }
      throw new Error('Upload gagal')
  }
  
  async function handler(m, { sock }) {
      const isImage = m.isImage || (m.quoted && m.quoted.type === 'imageMessage')
      
      if (!isImage) {
          return m.reply(
              `🌁 *ʙʀᴏᴏᴋʟʏɴ ꜰɪʟᴛᴇʀ*\n\n` +
              `╭┈┈⬡「 📋 *ᴄᴀʀᴀ ᴘᴀᴋᴀɪ* 」\n` +
              `┃ ◦ Reply gambar dengan \`${m.prefix}tobrooklyn\`\n` +
              `┃ ◦ Kirim gambar dengan caption \`${m.prefix}tobrooklyn\`\n` +
              `╰┈┈⬡`
          )
      }
      
      m.react('🌁')
      
      try {
          let buffer
          if (m.quoted && m.quoted.isMedia) {
              buffer = await m.quoted.download()
          } else if (m.isMedia) {
              buffer = await m.download()
          }
          
          if (!buffer || buffer.length === 0) {
              throw new Error('Gagal download gambar')
          }
          
          const imageUrl = await uploadToTmpfiles(buffer)
          const apiKey = config.APIkey?.lolhuman
          
          if (!apiKey) {
              throw new Error('API Key tidak ditemukan di config')
          }
          
          const apiUrl = `https://api.lolhuman.xyz/api/filter/brooklyn?apikey=${apiKey}&img=${encodeURIComponent(imageUrl)}`
          
          await sock.sendMedia(m.chat, apiUrl, null, m, {
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
