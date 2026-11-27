// downloader/sssthreads — fitur tambahan (plugins.zip), disesuaikan untuk WhatsApp Bot
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "sssthreads",
    "threadssave"
  ],
  "category": "downloader",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur sssthreads",
  "usage": ".sssthreads <url>"
}
const __vdir = __dirname.split('\\').join('/')
module.exports = __vx.plugin("vxnew/downloader/sssthreads", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + "/sssthreads.js"
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxImp = async (m) => { const r = require(m); return r && r.__esModule ? r : Object.assign({ default: r }, r) };
  const __vxExports = {};
  const fetch = __vxDef(require("../../lib/newlib/fetch.js"));
  
  let handler = async (m, { conn, text, usedPrefix, command }) => {
      if (!text) return m.reply(`*Format salah!*` + '\n\n' + `📌 *Contoh:* *${usedPrefix + command} https://www.threads.net/@user/post/xxxx*`)
      
      await m.react('⏳').catch(() => {})
      try {
          let apiKey = global.apikey?.vxapi
          let url = `${global.web}/api/downloader/sssthreads?apikey=${apiKey}&url=${encodeURIComponent(text.trim())}`
          let res = await fetch(url)
          let json = await res.json()
          
          if (!json.status || !json.result) throw new Error(json.error || 'Gagal memproses unduhan Threads')
          
          let resData = json.result
          let author = resData.author?.username || '-'
          let postCaption = resData.author?.caption || '-'
          let medias = resData.media || (Array.isArray(resData) ? resData : [resData])
          if (!medias.length) throw new Error('Tidak ada media ditemukan')
          
          let caption = `🧵 *${global.botname || 'BOT'} - SSSTHREADS DOWNLOADER*` + '\n\n' +
              `👤 *Author:* ${author}` + '\n' +
              `📝 *Caption:* ${postCaption}` + '\n' +
              `✨ *Request by:* ${m.pushName || 'User'}`
          
          for (let i = 0; i < medias.length; i++) {
              let item = medias[i]
              let mediaUrl = item.download || item.url || item.download_url || (typeof item === 'string' ? item : null)
              if (!mediaUrl) continue
              
              let isVideo = item.type === 'video' || /\.(mp4|mov|avi)($|\?)/i.test(mediaUrl)
              let itemCaption = medias.length > 1 ? `${caption}\n\n📌 *Media:* (${i + 1}/${medias.length})` : caption
              
              if (isVideo) {
                  await conn.sendMessage(m.chat, {
                      video: { url: mediaUrl },
                      caption: itemCaption,
                      fileName: `threads_${Date.now()}.mp4`
                  }, { quoted: m })
              } else {
                  await conn.sendMessage(m.chat, {
                      image: { url: mediaUrl },
                      caption: itemCaption
                  }, { quoted: m })
              }
          }
          await m.react('✅').catch(() => {})
      } catch (e) {
          await m.react('❌').catch(() => {})
          m.reply(`❌ *Error:* ${e.message || 'Terjadi kesalahan pada server'}`)
      }
  }
  handler.help = ['sssthreads <url>', 'threadssave <url>']
  handler.tags = ['downloader']
  handler.command = /^(sssthreads|threadssave)$/i
  
  handler.limit = true
  
  
  const __vxDefault = handler

  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  for (const k of ['before', 'all']) { if (typeof __vxExports[k] === 'function' && typeof __vxDefault === 'function' && !__vxDefault[k]) __vxDefault[k] = __vxExports[k] }
  return __vxExports
})
