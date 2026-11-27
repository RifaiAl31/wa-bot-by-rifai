// tools/textidentify — satu file: metadata + kode fitur (gabungan dari engine1/plugins/tools/textidentify.js)
const __vx = require("../../lib/adapter/e1.js")
const __meta = {
  "name": "textidentify",
  "command": [
    "textidentify",
    "scantext",
    "identifytext"
  ],
  "category": "tools",
  "desc": "Mengambil/membaca teks dari gambar (OCR)",
  "usage": ".textidentify (reply/kirim gambar)",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 10,
  "energi": 2,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/tools").split('\\').join('/')
module.exports = __vx.plugin("tools/textidentify", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/textidentify.js'
  const module = { exports: {} }; const exports = module.exports;
  const { downloadMediaMessage } = require("../../lib/baileys-compat.js")
  
  const pluginConfig = {
      name: 'textidentify',
      alias: ['scantext', 'identifytext'],
      category: 'tools',
      description: 'Mengambil/membaca teks dari gambar (OCR)',
      usage: '.textidentify (reply/kirim gambar)',
      example: '.textidentify',
      isOwner: false,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 10,
      energi: 2,
      isEnabled: true
  }
  
  async function handler(m, { sock }) {
      try {
          const isImage = m.type === 'imageMessage'
          const isQuotedImage = m.quoted?.type === 'imageMessage'
  
          if (!isImage && !isQuotedImage) {
              return await m.reply(
                  '📸 *TEXT IDENTIFY*\n\n' +
                  'Kirim atau reply gambar yang mengandung teks, lalu gunakan perintah ini!\n\n' +
                  '> Contoh: Kirim gambar + caption `.textidentify`\n' +
                  '> Atau: Reply gambar lalu ketik `.textidentify`'
              )
          }
  
          await m.reply('🔍 *Sedang membaca teks dari gambar...*\n> Mohon tunggu sebentar~')
  
          // Download gambar pakai downloadMediaMessage dari vx
          const msg = isQuotedImage ? m.quoted : m
          const buffer = await downloadMediaMessage(msg, 'buffer', {})
  
          if (!buffer || buffer.length === 0) {
              return await m.reply('❌ *Gomen ne~* ✦\n\n> Tidak bisa mengunduh gambar. Coba lagi~ 🥺')
          }
  
          // Import Tesseract.js v7 (ESM via dynamic import)
          const { createWorker } = await import('tesseract.js')
  
          const worker = await createWorker('eng+ind')
          const { data: { text, confidence } } = await worker.recognize(buffer)
          await worker.terminate()
  
          const hasil = text?.trim()
  
          if (!hasil) {
              return await m.reply(
                  '❌ *Tidak ada teks terdeteksi*\n\n' +
                  '> Pastikan gambar jelas dan teksnya terbaca!'
              )
          }
  
          const akurasi = confidence ? `${Math.round(confidence)}%` : 'N/A'
  
          await m.reply(
              `📝 *TEXT IDENTIFY*\n` +
              `━━━━━━━━━━━━━━━\n` +
              `${hasil}\n` +
              `━━━━━━━━━━━━━━━\n` +
              `> 🎯 Akurasi: ${akurasi}`
          )
  
      } catch (error) {
          console.error('TextIdentify Plugin Error:', error)
          await m.reply(`❌ *Gomen ne~* ✦\n\n> ${error.message}\n\n_Ai udah coba yang terbaik tapi gagal juga... coba lagi nanti ya~ 🌸_`)
      }
  }
  
  module.exports = {
      config: pluginConfig,
      handler
  }
  return module.exports
})
