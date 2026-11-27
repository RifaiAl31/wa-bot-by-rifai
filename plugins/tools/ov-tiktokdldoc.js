// download/tiktokdldoc — satu file: metadata + kode fitur (gabungan dari engine1/plugins/download/tiktokdldoc.js)
const __vx = require("../../lib/adapter/e1.js")
const __meta = {
  "name": "tiktokdldoc",
  "command": [
    "tiktokdldoc",
    "ttdoc",
    "tiktokdoc"
  ],
  "category": "download",
  "desc": "Download video TikTok sebagai dokumen",
  "usage": ".ttdoc <url>",
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
module.exports = __vx.plugin("download/tiktokdldoc", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/tiktokdldoc.js'
  const module = { exports: {} }; const exports = module.exports;
  const { f } = require("../../lib/ext/src/lib/undici.js")
  
  const pluginConfig = {
      name: ['tiktokdldoc', 'ttdoc'],
      alias: ['tiktokdoc'],
      category: 'download',
      description: 'Download video TikTok sebagai dokumen',
      usage: '.ttdoc <url>',
      example: '.ttdoc https://vt.tiktok.com/xxx',
      cooldown: 10,
      energi: 1,
      isEnabled: true
  }
  
  async function handler(m, { sock }) {
      const text = m.text?.trim()
      const prefix = m.prefix
  
      if (!text) {
          m.react('❌')
          return m.reply(`📌 Contoh: *${prefix}ttdoc https://vt.tiktok.com/...*`)
      }
  
      m.react('🕕')
  
      try {
          const res = await f(`https://api-faa.my.id/faa/tiktok?url=${encodeURIComponent(text)}`)
          if (!res?.status) return m.reply('❌ *Gomen ne~* Gagal mengambil data~ 🥺')
  
          const result = res.result
  
          const videoUrl =
              result?.alternatives?.hd ||
              result?.alternatives?.selected ||
              result?.data
  
          await sock.sendMessage(m.chat, {
              document: { url: videoUrl },
              fileName: (result.title || 'Tiktok_vx') + '.mp4',
              mimetype: 'video/mp4',
              caption: `
  🌸✨ *WhatsApp Bot Downloader (Doc)* ✨🌸
  
  > 🎬 ${result.title || 'TikTok Video'}
  > ⏱ ${result.duration}
  > 👤 ${result.author?.nickname || '-'}
              `,
              interactiveButtons: [
                  {
                      name: 'quick_reply',
                      buttonParamsJson: JSON.stringify({
                          display_text: '🎵 Audio (MP3)',
                          id: `${prefix}ttmp3 ${text}`
                      })
                  },
                  {
                      name: 'quick_reply',
                      buttonParamsJson: JSON.stringify({
                          display_text: '📥 Download Video',
                          id: `${prefix}tiktok ${text}`
                      })
                  }
              ]
          }, { quoted: m })
  
          m.react('✅')
  
      } catch (e) {
          console.error(e)
          m.react('❌')
          m.reply('Coba lagi nanti atau pakai ' + prefix + 'tt2')
      }
  }
  
  module.exports = {
      config: pluginConfig,
      handler
  }
  return module.exports
})
