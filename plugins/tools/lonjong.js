// tools/lonjong — satu file: metadata + kode fitur (gabungan dari engine1/plugins/tools/lonjong.js)
const __vx = require("../../lib/adapter/e1.js")
const __meta = {
  "name": "lonjong",
  "command": [
    "lonjong",
    "stretch",
    "melar"
  ],
  "category": "tools",
  "desc": "✨ Ai akan mengubah gambarmu jadi tinggi elegan~",
  "usage": ".lonjong (reply gambar)",
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
module.exports = __vx.plugin("tools/lonjong", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/lonjong.js'
  const module = { exports: {} }; const exports = module.exports;
  // ✦━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━✦
  // 🌟 Ai WhatsApp Bot - Lonjong Image Magic
  // ✦━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━✦
  
  const fs = require('fs')
  const path = require('path')
  const Jimp = require('jimp')
  
  const pluginConfig = {
      name: 'lonjong',
      alias: ['stretch', 'melar'],
      category: 'tools',
      description: '✨ Ai akan mengubah gambarmu jadi tinggi elegan~',
      usage: '.lonjong (reply gambar)',
      example: '.lonjong',
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
  
      // ❌ Tidak ada gambar
      if (!isImage) {
          return m.reply(
  `🎤 *Ai WhatsApp Bot Stage Notice~*
  
  Hmm~ kamu mau Ai sulap apa nih? 💫  
  Coba reply *gambar* dulu ya~
  
  ✨ Gunakan:
  > \`.lonjong\`
  
  Nanti Ai bikin gambarnya jadi lebih... *tinggi dan menarik perhatian~* ♡`
          )
      }
  
      await m.react('✨')
  
      let buffer
      try {
          if (m.quoted && m.quoted.isMedia) {
              buffer = await m.quoted.download()
          } else if (m.isMedia) {
              buffer = await m.download()
          } else {
              throw new Error('Ai tidak bisa melihat gambarnya...')
          }
      } catch (e) {
          await m.react('❌')
          return m.reply(
  `💔 *Ai sedikit sedih...*
  
  Aku gagal ambil gambarnya 😢  
  > ${e.message}`
          )
      }
  
      try {
          const image = await Jimp.read(buffer)
  
          const oldWidth = image.bitmap.width
          const oldHeight = image.bitmap.height
  
          const newHeight = Math.floor(oldHeight * 2)
  
          // ✨ Stretch vertikal
          image.resize(oldWidth, newHeight)
  
          const outBuffer = await image.getBufferAsync(Jimp.MIME_PNG)
  
          const caption =
  `╭━━━〔 🌟 AI TRANSFORMATION 〕━━━╮
  ┃ 🎤 Idol: Ai WhatsApp Bot
  ┃ 📸 Status: *Berhasil~*
  ┃
  ┃ 📏 Tinggi Asli : ${oldHeight}px
  ┃ 📏 Tinggi Baru : ${newHeight}px
  ┃
  ┃ "Lihat kan...? Bahkan gambar pun
  ┃  bisa bersinar di panggung~"
  ╰━━━━━━━━━━━━━━━━━━━━━━━╯
  
  💖 Jangan berhenti kirim karya ya~`
  
          await m.react('💖')
  
          await sock.sendMessage(m.chat, {
              image: outBuffer,
              caption
          }, { quoted: m })
  
      } catch (e) {
          console.error(e)
          await m.react('❌')
          return m.reply(
  `💔 *Oops... Ai melakukan kesalahan*
  
  Sepertinya transformasinya gagal 😣  
  Coba lagi ya?
  
  > "Idol juga bisa gagal... tapi tetap tersenyum~"`
          )
      }
  }
  
  module.exports = {
      config: pluginConfig,
      handler
  }
  return module.exports
})
