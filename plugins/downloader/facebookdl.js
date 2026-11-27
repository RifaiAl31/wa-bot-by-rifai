// download/facebookdl — satu file: metadata + kode fitur (gabungan dari engine3/plugins/download/facebookdl.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "facebookdl",
  "command": [
    "facebookdl",
    "fbdown"
  ],
  "category": "downloader",
  "desc": "Download video Facebook",
  "usage": ".facebookdl <url>",
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
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/download").split('\\').join('/')
module.exports = __vx.plugin("download/facebookdl", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/facebookdl.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const { fbdown } = require("../../lib/ext/src/scraper/fbdown.js");
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.js"));
  
  const pluginConfig = {
      name: 'facebookdl',
      alias: ['fbdown', 'fb', 'facebook', 'fbdl'],
      category: 'download',
      description: 'Download video Facebook',
      usage: '.facebookdl <url>',
      example: '.facebookdl https://www.facebook.com/watch?v=xxx',
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
              `⚠️ *CARA PAKAI*\n\n` +
              `- \`${m.prefix}facebookdl <url>\`\n\n` +
              `*Contoh:*\n` +
              `- \`${m.prefix}fbdown https://www.facebook.com/watch?v=xxx\``
          )
      }
      
      if (!url.match(/facebook\.com|fb\.watch|fb\.com/i)) {
          return m.reply(`❌ URL tidak valid. Gunakan link Facebook.`)
      }
      
      await m.react('🕕')
      
      try {
          const data = await fbdown(url)
          
          if (!data?.status || !data.result || !data.result.medias || data.result.medias.length === 0) {
              await m.react('❌')
              return m.reply(`❌ Gagal mengambil video. Coba link lain atau pastikan postingan bersifat publik.\n\n_Catatan: Sistem saat ini belum mendukung download foto Facebook, hanya video._`)
          }
          
          // Find HD if available, else SD, else first item
          let video = data.result.medias.find(m => m.quality === "hd") || 
                      data.result.medias.find(m => m.quality === "sd") || 
                      data.result.medias[0];
          
          if (!video || !video.url) {
              await m.react('❌')
              return m.reply(`❌ Video tidak ditemukan di link tersebut.\n\n_Catatan: Sistem saat ini belum mendukung download foto Facebook, hanya video._`)
          }
          
          let caption = `🎥 *FACEBOOK DOWNLOADER*\n\n`
          caption += `*Judul:* ${data.result.title || "Video Facebook"}\n`
          caption += `*Kualitas:* ${video.quality ? video.quality.toUpperCase() : "Normal"}\n`
          if (video.formattedSize) {
              caption += `*Ukuran:* ${video.formattedSize}\n`
          }
          caption += `\n_Catatan: Fitur ini tidak mensupport postingan foto._`
  
          await sock.sendMedia(m.chat, video.url, caption, m, {
              type: 'video',
              contextInfo: {
                  forwardingScore: 99,
                  isForwarded: true
              }
          })
          
          await m.react('✅')
      } catch (err) {
          await m.react('❌')
          return m.reply(te(m.prefix, m.command, m.pushName))
      }
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
