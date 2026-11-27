// downloader/threadsv2 — fitur tambahan (plugins.zip), disesuaikan untuk WhatsApp Bot
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "threadsv2",
    "thdlv2"
  ],
  "category": "downloader",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur threadsv2",
  "usage": ".threadsv2 <url>"
}
const __vdir = __dirname.split('\\').join('/')
module.exports = __vx.plugin("vxnew/downloader/threadsv2", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + "/threadsv2.js"
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxImp = async (m) => { const r = require(m); return r && r.__esModule ? r : Object.assign({ default: r }, r) };
  const __vxExports = {};
  const fetch = __vxDef(require("../../lib/newlib/fetch.js"));
  
  let handler = async (m, { conn, text, usedPrefix, command }) => {
      if (!text) return m.reply(`*Format salah!*` + '\n\n' + `📌 *Contoh:* *${usedPrefix + command} https://www.threads.net/@user/post/xxxx*`)
      
      await m.react('⏳').catch(() => {})
      try {
          let apiKey = global.apikey?.vxapi
          let url = `${global.web}/api/downloader/threadsv2?apikey=${apiKey}&url=${encodeURIComponent(text.trim())}`
          let res = await fetch(url)
          let json = await res.json()
          
          if (!json.status || !json.result || !json.result.length) {
              throw new Error(json.error || json.detail || 'Gagal memproses data postingan Threads V2')
          }
          
          let user = json.user || {}
          let post = json.post || {}
          let author = user.username || '-'
          let fullName = user.full_name || ''
          let postCaption = post.caption || '-'
          let likes = post.like_count ? post.like_count.toLocaleString() : '-'
          
          let caption = `🧵 *${global.botname || 'BOT'} - THREADS DOWNLOADER V2*` + '\n\n' +
              `👤 *Author:* ${author} ${fullName ? '(' + fullName + ')' : ''}` + '\n' +
              `📝 *Caption:* ${postCaption}` + '\n' +
              `❤️ *Likes:* ${likes}` + '\n' +
              `✨ *Request by:* ${m.pushName || 'User'}`
          
          for (let i = 0; i < json.result.length; i++) {
              let item = json.result[i]
              let mediaUrl = item.url || item.download_url
              if (!mediaUrl) continue
              
              let isVideo = item.type === 'video' || /\.(mp4|mov|avi)($|\?)/i.test(mediaUrl)
              let itemCaption = json.result.length > 1 ? `${caption}\n\n📌 *Media:* (${i + 1}/${json.result.length})` : caption
              
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
  handler.help = ['threadsv2 <url>', 'thdlv2 <url>']
  handler.tags = ['downloader']
  handler.command = /^(threadsv2|thdlv2)$/i
  
  handler.limit = true
  
  
  const __vxDefault = handler

  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  for (const k of ['before', 'all']) { if (typeof __vxExports[k] === 'function' && typeof __vxDefault === 'function' && !__vxDefault[k]) __vxDefault[k] = __vxExports[k] }
  return __vxExports
})
