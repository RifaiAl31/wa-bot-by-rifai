// downloads/gimage — satu file: metadata + kode fitur (gabungan dari engine7/plugins/downloads/gimage.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "gimage",
  "command": [
    "gimage",
    "image"
  ],
  "category": "search",
  "desc": "Mencari dan mendownload gambar dari Google",
  "usage": ".gimage [nama gambar]",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 3,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/downloads").split('\\').join('/')
module.exports = __vx.plugin("downloads/gimage", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/gimage.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const axios = __vxDef(require("axios"));
  const config = __vxDef(require("../../lib/ext/config.e7.js"));
  const pluginConfig = {
      name: 'gimage',
      alias: ['googleimage', 'image'],
      category: 'downloads',
      description: 'Mencari dan mendownload gambar dari Google',
      usage: '.gimage [nama gambar]',
      example: '.gimage pemandangan aesthetic',
      isOwner: false,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 5,
      energi: 3,
      isEnabled: true
  }
  
  async function handler(m, { sock, text }) {
      if (!text) return m.reply(`⚠️ *Input Salah*\n\nPenggunaan: *${pluginConfig.usage}*\nContoh: ${pluginConfig.example}`)
  
      await m.reply('⏳ *Sedang mencari gambar...*')
  
      try {
          // Menggunakan public scrapper API untuk mengambil gambar dari Google Images
          const response = await axios.get(`https://api.vreden.web.id/api/gimage?query=${encodeURIComponent(text)}`)
          
          // Memastikan struktur response API valid
          if (!response.data || response.data.status !== 200 || !response.data.result) {
              return await m.reply('❌ Gambar tidak ditemukan atau API sedang gangguan.')
          }
  
          const images = response.data.result
          if (images.length === 0) return await m.reply('❌ Tidak ada hasil gambar.')
  
          // Mengambil gambar pertama secara acak dari 3 hasil teratas agar lebih bervariasi
          const randomIndex = Math.floor(Math.random() * Math.min(images.length, 3))
          const imageUrl = images[randomIndex]
  
          // Mengirimkan gambar menggunakan socket Baileys bawaan bot-mu
          await sock.sendMessage(m.chat, { 
              image: { url: imageUrl }, 
              caption: `✨ *Hasil Pencarian Gambar:* "${text}"` 
          }, { quoted: m })
  
      } catch (error) {
          console.error('Google Image Plugin Error:', error)
          await m.reply(`❌ *GAGAL*\n\n> ${error.message}`)
      }
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
