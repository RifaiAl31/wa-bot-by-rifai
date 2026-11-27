// downloader/vidssave — fitur tambahan (plugins.zip), disesuaikan untuk WhatsApp Bot
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "vidssave",
    "vidssavedl"
  ],
  "category": "downloader",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur vidssave",
  "usage": ".vidssave <url>"
}
const __vdir = __dirname.split('\\').join('/')
module.exports = __vx.plugin("vxnew/downloader/vidssave", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + "/vidssave.js"
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxImp = async (m) => { const r = require(m); return r && r.__esModule ? r : Object.assign({ default: r }, r) };
  const __vxExports = {};
  const fetch = __vxDef(require("../../lib/newlib/fetch.js"));
  
  let handler = async (m, { conn, text, usedPrefix, command }) => {
      if (!text) return m.reply(`*Format salah!*` + '\n\n' + `📌 *Contoh:* *${usedPrefix + command} https://...*`)
      
      await m.react('⏳').catch(() => {})
      try {
          let apiKey = global.apikey?.vxapi
          let url = `${global.web}/api/downloader/vidssave?apikey=${apiKey}&url=${encodeURIComponent(text.trim())}`
          let res = await fetch(url)
          let json = await res.json()
          
          if (!json.status || !json.result) throw new Error(json.error || 'Gagal memproses VidsSave')
          
          let resData = json.result
          let videoUrl = resData.video || resData.download_url || resData.url || (Array.isArray(resData) ? resData[0]?.url : null)
          if (!videoUrl) throw new Error('Link video tidak ditemukan')
          
          let title = resData.title || 'VidsSave Video'
          let caption = `🎬 *${global.botname || 'BOT'} - VIDSSAVE DOWNLOADER*` + '\n\n' +
              `📌 *Judul:* ${title}` + '\n' +
              `✨ *Request by:* ${m.pushName || 'User'}`
          
          await conn.sendMessage(m.chat, {
              video: { url: videoUrl },
              caption: caption,
              fileName: `${title.slice(0, 30) || 'video'}.mp4`
          }, { quoted: m })
          
          await m.react('✅').catch(() => {})
      } catch (e) {
          await m.react('❌').catch(() => {})
          m.reply(`❌ *Error:* ${e.message || 'Terjadi kesalahan pada server'}`)
      }
  }
  handler.help = ['vidssave <url>', 'vidssavedl <url>']
  handler.tags = ['downloader']
  handler.command = /^(vidssave|vidssavedl)$/i
  
  handler.limit = true
  
  
  const __vxDefault = handler

  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  for (const k of ['before', 'all']) { if (typeof __vxExports[k] === 'function' && typeof __vxDefault === 'function' && !__vxDefault[k]) __vxDefault[k] = __vxExports[k] }
  return __vxExports
})
