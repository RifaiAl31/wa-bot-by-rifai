// downloader/ytclip — potong klip (maks 60 detik) dari video YouTube: .ytclip <url> <mulai> <selesai>
// Memakai engine yt-dlp milik bot (lib/ytdlp.js: auto-install, cookies/proxy dari .ytcookies / .ytdlp, ffmpeg dari lib/ffpath.js).
const fs = require('fs')
const ytdlp = require('../../lib/ytdlp')

const busy = new Set() // satu proses per chat

// "22:00" / "1:02:03" / "90" -> detik (null kalau tidak valid)
function toSec(t) {
  const p = String(t).trim().split(':')
  if (!p.length || p.length > 3 || p.some((x) => !/^\d+$/.test(x))) return null
  const n = p.map(Number)
  if (n.length === 1) return n[0]
  if (n.length === 2) return n[1] > 59 ? null : n[0] * 60 + n[1]
  return n[1] > 59 || n[2] > 59 ? null : n[0] * 3600 + n[1] * 60 + n[2]
}
function fmt(sec) {
  const s = Math.max(0, Math.floor(sec))
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), x = s % 60
  return h ? `${h}:${String(m).padStart(2, '0')}:${String(x).padStart(2, '0')}` : `${m}:${String(x).padStart(2, '0')}`
}
function isYouTube(u) {
  let url
  try { url = new URL(u) } catch { return false }
  if (!['http:', 'https:'].includes(url.protocol)) return false
  return ['youtube.com', 'm.youtube.com', 'music.youtube.com', 'youtu.be', 'youtube-nocookie.com'].includes(url.hostname.toLowerCase().replace(/^www\./, ''))
}

module.exports = {
  name: 'ytclip',
  command: ['ytclip', 'clipyt'],
  category: 'downloader',
  desc: 'Potong klip (maks 60 detik) dari video YouTube',
  usage: '<url youtube> <mulai> <selesai>  contoh: .ytclip https://youtu.be/xxxxx 22:00 22:20',
  run: async ({ sock, msg, from, args, prefix, reply }) => {
    if (busy.has(from)) return reply('✗ Masih ada proses ytclip yang berjalan di chat ini. Tunggu sampai selesai.')
    if (args.length < 3) return reply(`✗ Format salah!\nContoh: *${prefix}ytclip https://youtu.be/xxxxx 22:00 22:20*`)
    const [url, a, b] = args
    if (!isYouTube(url)) return reply('✗ URL harus berupa link YouTube yang valid.')
    const start = toSec(a), end = toSec(b)
    if (start === null || end === null || end <= start) return reply(`✗ Waktu tidak valid. Contoh: *${prefix}ytclip URL 22:00 22:20*`)
    const len = end - start
    if (len > 60) return reply('✗ Durasi klip maksimal 60 detik.')

    busy.add(from)
    let res
    try {
      await reply('⏳ Sedang mengambil dan memotong video YouTube...')
      res = await ytdlp.clip(url, start, end)
      await sock.sendMessage(
        from,
        {
          video: fs.readFileSync(res.file),
          mimetype: 'video/mp4',
          fileName: 'ytclip.mp4',
          caption: `🎬 *${String(res.title || 'YouTube Clip').slice(0, 180)}*\n\n⏱️ Durasi Klip: ${fmt(len)}\n✂️ Rentang: ${fmt(start)} – ${fmt(end)}`
        },
        { quoted: msg }
      )
    } catch (err) {
      console.log('[ytclip] gagal:', err?.message || err)
      if (err?.message === 'RANGE') return reply(`✗ Gagal membuat klip.\n\nRentang waktu melewati durasi video (${fmt(err.videoDuration)}).`)
      return reply(`✗ Gagal membuat klip.\n\n${String(err?.message || err).slice(0, 600)}`)
    } finally {
      busy.delete(from)
      try { res?.cleanup() } catch {}
    }
  }
}
