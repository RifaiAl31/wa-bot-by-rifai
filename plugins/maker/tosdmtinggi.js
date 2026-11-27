// maker/tosdmtinggi — satu file: metadata + kode fitur (gabungan dari engine1/plugins/maker/tosdmtinggi.js)
const __vx = require("../../lib/adapter/e1.js")
const __meta = {
  "name": "tosdmtinggi",
  "command": [
    "tosdmtinggi",
    "tosdm",
    "dmtinggi"
  ],
  "category": "maker",
  "desc": "🎀 Bikin gambar Fake DM Tinggi biar temen kamu panik~ Hehe! 🤭",
  "usage": ".tosdm (reply/kirim gambar)",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 10,
  "energi": 5,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/maker").split('\\').join('/')
module.exports = __vx.plugin("maker/tosdmtinggi", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/tosdmtinggi.js'
  const module = { exports: {} }; const exports = module.exports;
  const config = require("../../lib/ext/config.js")
  const { default: axios } = require('axios')
  const FormData = require('form-data')
  
  const pluginConfig = {
      name: 'tosdmtinggi',
      alias: ['tosdm', 'dmtinggi'],
      category: 'maker',
      description: '🎀 Bikin gambar Fake DM Tinggi biar temen kamu panik~ Hehe! 🤭',
      usage: '.tosdm (reply/kirim gambar)',
      example: '.tosdm',
      cooldown: 10,
      energi: 5,
      isEnabled: true
  }
  
  async function handler(m, { sock }) {
      const isImage = m.isImage || (m.quoted && m.quoted.type === 'imageMessage')
  
      if (!isImage) {
          return m.reply(`✨ *WhatsApp Bot Fake DM*\n\n> Reply atau kirim gambar ya, senpai~ biar aku edit! 🎤`)
      }
  
      m.react('🕕')
  
      try {
          let buffer
          if (m.quoted && m.quoted.isMedia) {
              buffer = await m.quoted.download()
          } else if (m.isMedia) {
              buffer = await m.download()
          }
  
          if (!buffer) throw new Error('Gagal download gambar~')
  
          // 🔥 Step 1: Upload ke Catbox
          const form = new FormData()
          form.append('fileToUpload', buffer, 'image.jpg')
          form.append('reqtype', 'fileupload')
  
          const catbox = await axios.post('https://catbox.moe/user/api.php', form, {
              headers: form.getHeaders(),
              timeout: 20000 // Kasih waktu tunggu lebih lama
          }).catch(e => { throw new Error('Catbox lagi error/down nih, Senpai! 😅') })
  
          const imageUrl = catbox.data.trim()
          
          // Cek apakah hasil upload beneran link
          if (!imageUrl.startsWith('http')) {
              throw new Error('Gagal dapetin link gambar dari uploader.')
          }
  
          console.log('Link Gambar:', imageUrl) // Cek di terminal/console log kamu
  
          // 🔥 Step 2: Tembak ke API Fake DM dengan Response Type Arraybuffer (Lebih Aman)
          const apiUrl = `https://api-faa.my.id/faa/tosdmtinggi?url=${encodeURIComponent(imageUrl)}`
          
          const response = await axios.get(apiUrl, { 
              responseType: 'arraybuffer',
              headers: {
                  'User-Agent': 'Mozilla/5.0'
              }
          }).catch(e => {
              throw new Error(`API FAA Error 500 (Mungkin lagi maintenance, Senpai~ 😅)`)
          })
  
          if (!response.data) throw new Error('Hasil API kosong!')
  
          await sock.sendMessage(m.chat, {
              image: Buffer.from(response.data),
              caption: `✨ *WhatsApp Bot Fake DM*\n\n> Tadaaa~! Ini dia hasilnya, Senpai! Hehe~ 🤭💖`
          }, { quoted: m })
  
          m.react('✨')
  
      } catch (error) {
          console.error('Error Details:', error.message)
          m.react('❌')
          m.reply(`❌ *WhatsApp Bot Error*\n\n> ${error.message}`)
      }
  }
  
  module.exports = {
      config: pluginConfig,
      handler
  }
  return module.exports
})
