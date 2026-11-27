// downloader/reelsvideo — fitur tambahan (plugins.zip), disesuaikan untuk WhatsApp Bot
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "reelsvideo",
    "reelsdl"
  ],
  "category": "downloader",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur reelsvideo",
  "usage": ".reelsvideo <url>"
}
const __vdir = __dirname.split('\\').join('/')
module.exports = __vx.plugin("vxnew/downloader/reelsvideo", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + "/reelsvideo.js"
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxImp = async (m) => { const r = require(m); return r && r.__esModule ? r : Object.assign({ default: r }, r) };
  const __vxExports = {};
  const fetch = __vxDef(require("../../lib/newlib/fetch.js"));
  
  let handler = async (m, { conn, text, usedPrefix, command }) => {
      if (!text) return m.reply(`*Format salah!*` + '\n\n' + `📌 *Contoh:* *${usedPrefix + command} https://www.instagram.com/reel/xxxx*`)
      
      await m.react('⏳').catch(() => {})
      try {
          let apiKey = global.apikey?.vxapi
          let url = `${global.web}/api/downloader/reelsvideo?apikey=${apiKey}&url=${encodeURIComponent(text.trim())}`
          let res = await fetch(url)
          let json = await res.json()
          
          if (!json.status || !json.result) throw new Error(json.error || 'Gagal memproses video Instagram Reels')
          
          let videoUrl = json.result.download_url || json.result.video_url || json.result.url || json.result
          if (typeof videoUrl === 'object') videoUrl = videoUrl.url || videoUrl.download_url
          if (!videoUrl) throw new Error('Link video Reels tidak ditemukan')
          
          let caption = `🎬 *${global.botname || 'BOT'} - INSTAGRAM REELS DOWNLOADER*` + '\n\n' +
              `✨ *Request by:* ${m.pushName || 'User'}`
          
          await conn.sendMessage(m.chat, {
              video: { url: videoUrl },
              caption: caption,
              fileName: `reels_${Date.now()}.mp4`
          }, { quoted: m })
          
          await m.react('✅').catch(() => {})
      } catch (e) {
          await m.react('❌').catch(() => {})
          m.reply(`❌ *Error:* ${e.message || 'Terjadi kesalahan pada server'}`)
      }
  }
  handler.help = ['reelsvideo <url>', 'reelsdl <url>']
  handler.tags = ['downloader']
  handler.command = /^(reelsvideo|reelsdl)$/i
  
  handler.limit = true
  
  
  const __vxDefault = handler

  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  for (const k of ['before', 'all']) { if (typeof __vxExports[k] === 'function' && typeof __vxDefault === 'function' && !__vxDefault[k]) __vxDefault[k] = __vxExports[k] }
  return __vxExports
})
