// downloader/spotifyv2 — fitur tambahan (plugins.zip), disesuaikan untuk WhatsApp Bot
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "spotifyv2",
    "spdlv2"
  ],
  "category": "downloader",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur spotifyv2",
  "usage": ".spotifyv2 <url>"
}
const __vdir = __dirname.split('\\').join('/')
module.exports = __vx.plugin("vxnew/downloader/spotifyv2", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + "/spotifyv2.js"
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
          let url = `${global.web}/api/downloader/spotifyv2?apikey=${apiKey}&url=${encodeURIComponent(text.trim())}`
          let res = await fetch(url)
          let json = await res.json()
          
          if (!json.status || !json.data) throw new Error(json.error || 'Gagal mengunduh lagu Spotify V2')
          
          let data = json.data
          let downloadUrl = data.downloadUrl || data.download || data.url
          if (!downloadUrl) throw new Error('Link unduhan lagu tidak ditemukan')
          
          let title = data.title || 'Spotify Track'
          let artist = data.artist || '-'
          let album = data.album || '-'
          let duration = data.duration || '-'
          let thumbnail = data.thumbnail || data.cover || ''
          
          let caption = `🟢 *${global.botname || 'BOT'} - SPOTIFY V2 DOWNLOADER*` + '\n\n' +
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
          
          let safeTitle = `${artist} - ${title}`.replace(/[\\/:*?"<>|]/g, '').trim() || 'spotify_audio'
          
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
  handler.help = ['spotifyv2 <url>', 'spdlv2 <url>']
  handler.tags = ['downloader']
  handler.command = /^(spotifyv2|spdlv2)$/i
  
  handler.limit = true
  
  
  const __vxDefault = handler

  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  for (const k of ['before', 'all']) { if (typeof __vxExports[k] === 'function' && typeof __vxDefault === 'function' && !__vxDefault[k]) __vxDefault[k] = __vxExports[k] }
  return __vxExports
})
