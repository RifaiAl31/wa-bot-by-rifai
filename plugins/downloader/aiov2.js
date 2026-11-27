// downloader/aiov2 — fitur tambahan (plugins.zip), disesuaikan untuk WhatsApp Bot
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "aiov2",
    "aiodlv2"
  ],
  "category": "downloader",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur aiov2",
  "usage": ".aiov2 <url>"
}
const __vdir = __dirname.split('\\').join('/')
module.exports = __vx.plugin("vxnew/downloader/aiov2", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + "/aiov2.js"
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxImp = async (m) => { const r = require(m); return r && r.__esModule ? r : Object.assign({ default: r }, r) };
  const __vxExports = {};
  const fetch = __vxDef(require("../../lib/newlib/fetch.js"));
  
  let handler = async (m, { conn, text, usedPrefix, command }) => {
      if (!text) return m.reply(`*Format salah!*` + '\n\n' + `📌 *Contoh:* *${usedPrefix + command} https://...*`)
      
      await m.react('⏳').catch(() => {})
      try {
          let apiKey = global.apikey?.vxapi
          let url = `${global.web}/api/downloader/aiov2?apikey=${apiKey}&url=${encodeURIComponent(text.trim())}`
          let res = await fetch(url)
          let json = await res.json()
          
          if (!json.status) throw new Error(json.error || 'Gagal memproses link AIO V2')
          
          let title = json.title || json.result?.title || 'AIO Media'
          let medias = json.medias || json.result?.medias || (json.url ? [{ url: json.url }] : [])
          if (!medias.length) throw new Error('Tidak ada media ditemukan')
          
          let first = medias[0]
          let mediaUrl = typeof first === 'string' ? first : (first.url || first.download_url)
          if (!mediaUrl) throw new Error('Link unduhan tidak valid')
          
          let isVideo = first.type === 'video' || /\.(mp4|mov|avi)($|\?)/i.test(mediaUrl) || medias.some(m => (m.type === 'video' || m.extension === 'mp4'))
          let caption = `🌐 *${global.botname || 'BOT'} - ALL IN ONE V2 DOWNLOADER*` + '\n\n' +
              `📌 *Judul:* ${title}` + '\n' +
              `✨ *Request by:* ${m.pushName || 'User'}`
          
          if (isVideo) {
              await conn.sendMessage(m.chat, {
                  video: { url: mediaUrl },
                  caption: caption,
                  fileName: `${title.slice(0, 30) || 'media'}.mp4`
              }, { quoted: m })
          } else {
              await conn.sendMessage(m.chat, {
                  image: { url: mediaUrl },
                  caption: caption
              }, { quoted: m })
          }
          
          await m.react('✅').catch(() => {})
      } catch (e) {
          await m.react('❌').catch(() => {})
          m.reply(`❌ *Error:* ${e.message || 'Terjadi kesalahan pada server'}`)
      }
  }
  handler.help = ['aiov2 <url>', 'aiodlv2 <url>']
  handler.tags = ['downloader']
  handler.command = /^(aiov2|aiodlv2)$/i
  
  handler.limit = true
  
  
  const __vxDefault = handler

  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  for (const k of ['before', 'all']) { if (typeof __vxExports[k] === 'function' && typeof __vxDefault === 'function' && !__vxDefault[k]) __vxDefault[k] = __vxExports[k] }
  return __vxExports
})
