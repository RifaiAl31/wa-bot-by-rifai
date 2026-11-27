// download/snackvideodl — satu file: metadata + kode fitur (gabungan dari engine3/plugins/download/snackvideodl.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "snackvideodl",
  "command": [
    "snackvideodl",
    "svdl",
    "snackvideo"
  ],
  "category": "downloader",
  "desc": "Download video SnackVideo",
  "usage": ".svdl <url>",
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
module.exports = __vx.plugin("download/snackvideodl", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/snackvideodl.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const { snackvideo } = require("btch-downloader");
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.js"));
  const pluginConfig = {
      name: 'snackvideodl',
      alias: ['svdl', 'snackvideo', 'sv'],
      category: 'download',
      description: 'Download video SnackVideo',
      usage: '.svdl <url>',
      example: '.svdl https://www.snackvideo.com/@xxx/video/xxx',
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
              `> \`${m.prefix}svdl <url>\`\n\n` +
              `> Contoh:\n` +
              `> \`${m.prefix}svdl https://www.snackvideo.com/@xxx/video/xxx\``
          )
      }
      
      if (!url.match(/snackvideo\.com/i)) {
          return m.reply(`❌ URL tidak valid. Gunakan link SnackVideo.`)
      }
      
      await m.react('🕕')
      
      try {
          const data = await snackvideo(url)
          
          if (!data?.status || !data?.result?.videoUrl) {
              return m.reply(`❌ Gagal mengambil video. Coba link lain.`)
          }
          
          const result = data.result
          
          await sock.sendMedia(m.chat, result.videoUrl, null, m, {
              type: 'video',
              contextInfo: {
                  forwardingScore: 99,
                  isForwarded: true
              }
          })
          
      } catch (err) {
          return m.reply(te(m.prefix, m.command, m.pushName))
      }
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
