// download/ttslide — satu file: metadata + kode fitur (gabungan dari engine7/plugins/download/ttslide.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "ttslide",
  "command": [
    "tiktokslide"
  ],
  "category": "downloader",
  "desc": "Mengambil semua gambar dari TikTok photo/slideshow",
  "usage": ".ttslide <url>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 15,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/download").split('\\').join('/')
module.exports = __vx.plugin("download/ttslide", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/ttslide.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  /*
    Fitur tambahan hasil audit FURINA V17 → WhatsApp Bot.
  */
  
  const axios = __vxDef(require("axios"));
  
  const pluginConfig = {
      name: 'ttslide',
      alias: ['tiktokslide'],
      category: 'download',
      description: 'Mengambil semua gambar dari TikTok photo/slideshow',
      usage: '.ttslide <url>',
      example: '.ttslide https://vt.tiktok.com/xxxx/',
      cooldown: 15,
      energi: 1,
      isEnabled: true
  }
  
  const API_URL = 'https://btch.us.kg/download/tiktokslide'
  
  async function handler(m, { sock }) {
      const url = m.text?.trim()
      if (!url) return m.reply(`Contoh: ${m.prefix}ttslide https://vt.tiktok.com/xxxx/`)
      if (!/tiktok\.com/i.test(url)) return m.reply('❌ URL harus dari TikTok.')
  
      try {
          m.react('⏳')
          const { data } = await axios.get(API_URL, {
              params: { url },
              timeout: 30000,
              headers: { 'User-Agent': 'Mozilla/5.0' }
          })
          const images = data?.result?.images
          if (!Array.isArray(images) || images.length === 0) throw new Error('Gambar slideshow tidak ditemukan')
          const caption = data?.result?.title || 'TikTok Slideshow'
          for (const image of images) {
              if (!image) continue
              await sock.sendMessage(m.chat, { image: { url: image }, caption }, { quoted: m })
          }
          m.react('✅')
      } catch (error) {
          console.error('[ttslide]', error)
          m.react('❌')
          return m.reply('❌ Gagal mengambil TikTok slideshow. API mungkin sedang bermasalah.')
      }
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
