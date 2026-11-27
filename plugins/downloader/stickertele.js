// downloader/stickertele — fitur tambahan (plugins.zip), disesuaikan untuk WhatsApp Bot
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "stickertele",
    "telesticker"
  ],
  "category": "downloader",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur stickertele",
  "usage": ".stickertele <url>"
}
const __vdir = __dirname.split('\\').join('/')
module.exports = __vx.plugin("vxnew/downloader/stickertele", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + "/stickertele.js"
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxImp = async (m) => { const r = require(m); return r && r.__esModule ? r : Object.assign({ default: r }, r) };
  const __vxExports = {};
  const fetch = __vxDef(require("../../lib/newlib/fetch.js"));
  
  let handler = async (m, { conn, text, usedPrefix, command }) => {
      if (!text) return m.reply(`*Format salah!*` + '\n\n' + `📌 *Contoh:* *${usedPrefix + command} https://t.me/addstickers/xxxx*`)
      
      await m.react('⏳').catch(() => {})
      try {
          let apiKey = global.apikey?.vxapi
          let url = `${global.web}/api/downloader/stickertele?apikey=${apiKey}&url=${encodeURIComponent(text.trim())}`
          let res = await fetch(url)
          let json = await res.json()
          
          if (!json.status || !json.data) throw new Error(json.error || 'Gagal mengambil sticker Telegram')
          
          let data = json.data
          let stickers = data.stickers || []
          if (!stickers.length) throw new Error('Tidak ada stiker ditemukan dalam pack ini')
          
          await m.reply(`🏷️ *${global.botname || 'BOT'} - TELEGRAM STICKER DOWNLOADER*\n\n📦 Menemukan *${stickers.length}* stiker dari pack *${data.title || 'Telegram'}* (${data.type || 'Biasa'}). Mengirim 5 stiker pertama...`)
          
          for (let i = 0; i < Math.min(stickers.length, 5); i++) {
              let stUrl = stickers[i].url || stickers[i]
              if (!stUrl) continue
              await conn.sendMessage(m.chat, {
                  image: { url: stUrl },
                  caption: `🏷️ *Sticker ${i + 1}/${stickers.length}* ${stickers[i].emoji || ''}`
              }, { quoted: m }).catch(() => {})
          }
          await m.react('✅').catch(() => {})
      } catch (e) {
          await m.react('❌').catch(() => {})
          m.reply(`❌ *Error:* ${e.message || 'Terjadi kesalahan pada server'}`)
      }
  }
  handler.help = ['stickertele <url>', 'telesticker <url>']
  handler.tags = ['downloader']
  handler.command = /^(stickertele|telesticker|tgsticker)$/i
  
  handler.limit = true
  
  
  const __vxDefault = handler

  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  for (const k of ['before', 'all']) { if (typeof __vxExports[k] === 'function' && typeof __vxDefault === 'function' && !__vxDefault[k]) __vxDefault[k] = __vxExports[k] }
  return __vxExports
})
