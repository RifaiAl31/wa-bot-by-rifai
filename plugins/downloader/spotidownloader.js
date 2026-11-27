// downloader/spotidownloader — fitur tambahan (plugins.zip), disesuaikan untuk WhatsApp Bot
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "spotidownloader",
    "spdl2"
  ],
  "category": "downloader",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur spotidownloader",
  "usage": ".spotidownloader <url>"
}
const __vdir = __dirname.split('\\').join('/')
module.exports = __vx.plugin("vxnew/downloader/spotidownloader", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + "/spotidownloader.js"
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxImp = async (m) => { const r = require(m); return r && r.__esModule ? r : Object.assign({ default: r }, r) };
  const __vxExports = {};
  const fetch = __vxDef(require("../../lib/newlib/fetch.js"));
  const axios = __vxDef(require("axios"));
  
  let handler = async (m, { conn, text, usedPrefix, command }) => {
      if (!text) return m.reply(`*Format salah!*` + '\n\n' + `📌 *Contoh:* *${usedPrefix + command} https://open.spotify.com/track/xxxx*`)
      
      await m.react('⏳').catch(() => {})
      try {
          let apiKey = global.apikey?.vxapi
          let url = `${global.web}/api/downloader/spotidownloader?apikey=${apiKey}&url=${encodeURIComponent(text.trim())}`
          let res = await fetch(url)
          let json = await res.json()
          
          if (!json.status || !json.result) throw new Error(json.error || 'Gagal memproses SpotiDownloader')
          
          let resData = json.result
          let downloadUrl = resData.download_url || resData.download || resData.url || resData.link
          if (!downloadUrl) throw new Error('Link unduhan audio tidak ditemukan')
          
          let title = resData.title || resData.name || 'Spotify Track'
          let artist = resData.artist || resData.artists || '-'
          let album = resData.album || '-'
          let duration = resData.duration || '-'
          let thumbnail = resData.thumbnail || resData.cover || ''
          
          let caption = `🟢 *${global.botname || 'BOT'} - SPOTIDOWNLOADER*` + '\n\n' +
              `🎵 *Judul:* ${title}` + '\n' +
              `👤 *Artis:* ${artist}` + '\n' +
              `💿 *Album:* ${album}` + '\n' +
              `⏱️ *Durasi:* ${duration}` + '\n' +
              `✨ *Request by:* ${m.pushName || 'User'}`
          
          await conn.sendMessage(m.chat, { react: { text: '📥', key: m.key } })
          
          let audioRes = await axios.get(downloadUrl, {
              responseType: 'arraybuffer',
              timeout: 120000,
              headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
          })
          
          let safeTitle = `${artist} - ${title}`.replace(/[\\/:*?"<>|]/g, '').trim() || 'spotidownloader_audio'
          
          await conn.sendMessage(m.chat, {
              audio: Buffer.from(audioRes.data),
              mimetype: 'audio/mpeg',
              ptt: false,
              fileName: `${safeTitle}.mp3`}, { quoted: m })
          
          await m.react('✅').catch(() => {})
      } catch (e) {
          await m.react('❌').catch(() => {})
          m.reply(`❌ *Error:* ${e.message || 'Terjadi kesalahan pada server'}`)
      }
  }
  handler.help = ['spotidownloader <url>', 'spdl2 <url>']
  handler.tags = ['downloader']
  handler.command = /^(spotidownloader|spdl2)$/i
  
  handler.limit = true
  
  
  const __vxDefault = handler

  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  for (const k of ['before', 'all']) { if (typeof __vxExports[k] === 'function' && typeof __vxDefault === 'function' && !__vxDefault[k]) __vxDefault[k] = __vxExports[k] }
  return __vxExports
})
