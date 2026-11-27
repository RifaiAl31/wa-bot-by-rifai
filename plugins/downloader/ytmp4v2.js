// downloader/ytmp4v2 — fitur tambahan (plugins.zip), disesuaikan untuk WhatsApp Bot
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "ytmp4v2",
    "ytvv2"
  ],
  "category": "downloader",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur ytmp4v2",
  "usage": ".ytmp4v2 <url>"
}
const __vdir = __dirname.split('\\').join('/')
module.exports = __vx.plugin("vxnew/downloader/ytmp4v2", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + "/ytmp4v2.js"
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxImp = async (m) => { const r = require(m); return r && r.__esModule ? r : Object.assign({ default: r }, r) };
  const __vxExports = {};
  const fetch = __vxDef(require("../../lib/newlib/fetch.js"));
  
  let handler = async (m, { conn, text, usedPrefix, command }) => {
      if (!text) return m.reply(`*Format salah!*` + '\n\n' + `📌 *Contoh:* *${usedPrefix + command} https://www.youtube.com/watch?v=xxxx*`)
      
      await m.react('⏳').catch(() => {})
      try {
          let apiKey = global.apikey?.vxapi
          let apiUrl = `${global.web}/api/downloader/ytmp4v2?apikey=${apiKey}&url=${encodeURIComponent(text.trim())}`
          let res = await fetch(apiUrl)
          let json = await res.json()
          
          if (!json.status || !json.result || !Array.isArray(json.result) || json.result.length === 0) {
              throw new Error(json.error || 'Gagal mengunduh video YouTube V2')
          }
          
          let bestVideo = json.result.find(v => v.quality === '720p' || v.quality === '1080p') || json.result[0]
          let videoUrl = bestVideo.url
          
          if (!videoUrl) throw new Error('Link video tidak ditemukan')
          
          let caption = `🎬 *${global.botname || 'BOT'} - YOUTUBE MP4 V2*` + '\n\n' +
              `📺 *Kualitas:* ${bestVideo.quality || 'Standard'}` + '\n' +
              `✨ *Request by:* ${m.pushName || 'User'}`
          
          await conn.sendMessage(m.chat, {
              video: { url: videoUrl },
              caption: caption,
              fileName: `youtube_${Date.now()}.mp4`
          }, { quoted: m })
          
          await m.react('✅').catch(() => {})
      } catch (e) {
          await m.react('❌').catch(() => {})
          m.reply(`❌ *Error:* ${e.message || 'Terjadi kesalahan pada server'}`)
      }
  }
  handler.help = ['ytmp4v2 <url>']
  handler.tags = ['downloader']
  handler.command = /^(ytmp4v2|ytvv2)$/i
  
  handler.limit = true
  
  
  const __vxDefault = handler

  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  for (const k of ['before', 'all']) { if (typeof __vxExports[k] === 'function' && typeof __vxDefault === 'function' && !__vxDefault[k]) __vxDefault[k] = __vxExports[k] }
  return __vxExports
})
