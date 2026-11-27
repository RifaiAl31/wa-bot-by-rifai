// downloader/starmaxfilm-dl — fitur tambahan (plugins.zip), disesuaikan untuk WhatsApp Bot
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "starmaxfilmdl",
    "starmaxfilm"
  ],
  "category": "downloader",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur starmaxfilmdl",
  "usage": ".starmaxfilmdl <url>"
}
const __vdir = __dirname.split('\\').join('/')
module.exports = __vx.plugin("vxnew/downloader/starmaxfilm-dl", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + "/starmaxfilm-dl.js"
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxImp = async (m) => { const r = require(m); return r && r.__esModule ? r : Object.assign({ default: r }, r) };
  const __vxExports = {};
  const fetch = __vxDef(require("../../lib/newlib/fetch.js"));
  
  let handler = async (m, { conn, text, usedPrefix, command }) => {
      if (!text) return m.reply(`*Format salah!*` + '\n\n' + `📌 *Contoh:* *${usedPrefix + command} https://starmaxfilm...*`)
      
      await m.react('⏳').catch(() => {})
      try {
          let apiKey = global.apikey?.vxapi
          let url = `${global.web}/api/downloader/starmaxfilm-dl?apikey=${apiKey}&url=${encodeURIComponent(text.trim())}`
          let res = await fetch(url)
          let json = await res.json()
          
          if (!json.status || !json.result) throw new Error(json.error || 'Gagal memproses film Starmax')
          
          let resData = json.result
          let downloadList = resData.downloads || []
          let downloadUrl = (downloadList.length > 0 ? downloadList[0].url : null) || resData.download_url || resData.url
          if (!downloadUrl) throw new Error('Link unduhan film Starmax tidak ditemukan')
          
          let title = resData.title || 'Starmax Movie'
          let rating = resData.rating || '-'
          let quality = (downloadList.length > 0 ? downloadList[0].resolution : null) || resData.quality || '-'
          let provider = (downloadList.length > 0 ? downloadList[0].provider : null) || '-'
          
          let caption = `🎥 *${global.botname || 'BOT'} - STARMAX FILM DOWNLOADER*` + '\n\n' +
              `🎬 *Judul:* ${title}` + '\n' +
              `⭐ *Rating:* ${rating}` + '\n' +
              `📺 *Kualitas:* ${quality}` + '\n' +
              `🌐 *Server:* ${provider}` + '\n' +
              `✨ *Request by:* ${m.pushName || 'User'}`
          
          await conn.sendMessage(m.chat, {
              video: { url: downloadUrl },
              caption: caption,
              fileName: `${title.slice(0, 30) || 'film'}.mp4`
          }, { quoted: m }).catch(async () => {
              await conn.sendMessage(m.chat, {
                  document: { url: downloadUrl },
                  fileName: `${title.slice(0, 30) || 'film'}.mp4`,
                  mimetype: 'video/mp4',
                  caption: caption
              }, { quoted: m })
          })
          
          await m.react('✅').catch(() => {})
      } catch (e) {
          await m.react('❌').catch(() => {})
          m.reply(`❌ *Error:* ${e.message || 'Terjadi kesalahan pada server'}`)
      }
  }
  handler.help = ['starmaxfilmdl <url>', 'starmaxfilm <url>']
  handler.tags = ['downloader']
  handler.command = /^(starmaxfilmdl|starmaxfilm)$/i
  
  handler.limit = true
  
  
  const __vxDefault = handler

  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  for (const k of ['before', 'all']) { if (typeof __vxExports[k] === 'function' && typeof __vxDefault === 'function' && !__vxDefault[k]) __vxDefault[k] = __vxExports[k] }
  return __vxExports
})
