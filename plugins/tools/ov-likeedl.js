// download/likeedl — satu file: metadata + kode fitur (gabungan dari engine1/plugins/download/likeedl.js)
const __vx = require("../../lib/adapter/e1.js")
const __meta = {
  "name": "likeedl",
  "command": [
    "likeedl",
    "lkdl",
    "likee",
    "lk"
  ],
  "category": "download",
  "desc": "Download video Likee",
  "usage": ".lkdl <url>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 10,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  },
  "override": true
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/download").split('\\').join('/')
module.exports = __vx.plugin("download/likeedl", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/likeedl.js'
  const module = { exports: {} }; const exports = module.exports;
  const likee = require("../../lib/ext/src/scraper/likee.js")
  
  const pluginConfig = {
      name: 'likeedl',
      alias: ['lkdl', 'likee', 'lk'],
      category: 'download',
      description: 'Download video Likee',
      usage: '.lkdl <url>',
      example: '.lkdl https://likee.video/@xxx',
      isOwner: false,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 10,
      energi: 1,
      isEnabled: true
  }
  
  async function handler(m, { sock }) {
      const url = m.text?.trim()
      
      if (!url) {
          return m.reply(
              `⚠️ *ᴄᴀʀᴀ ᴘᴀᴋᴀɪ*\n\n` +
              `> \`${m.prefix}lkdl <url>\`\n\n` +
              `> Contoh:\n` +
              `> \`${m.prefix}lkdl https://likee.video/@xxx\``
          )
      }
      
      if (!url.match(/likee\.(video|com)/i)) {
          return m.reply(`❌ *Ehh~* URL tidak valid. Gunakan link Likee~ 🥺`)
      }
      
      await m.react('🕕')
      
      try {
          const data = await likee(url)
          
          if (!data) {
              return m.reply(`❌ *Gomen ne~* Gagal mengambil video. Coba link lain~ 🥺`)
          }
          
          const videoUrl = data.without_watermark || data.with_watermark
          
          if (!videoUrl) {
              return m.reply(`❌ *Ehh~* Video tidak ditemukan~ 🥺`)
          }
          
          await sock.sendMedia(m.chat, videoUrl, null, m, {
              type: 'video',
              contextInfo: {
                  forwardingScore: 99,
                  isForwarded: true
              }
          })
          
          await m.react('✅')
          
      } catch (err) {
          return m.reply(`❌ *Gomen ne~* ✦\n\n> ${err.message}\n\n_Ai udah coba yang terbaik tapi gagal juga... coba lagi nanti ya~ 🌸_`)
      }
  }
  
  module.exports = {
      config: pluginConfig,
      handler
  }
  
  return module.exports
})
