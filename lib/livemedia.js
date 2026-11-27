// =====================================================================
//  lib/livemedia.js — pengambilan MEDIA untuk kartu rich (play2, ytlive, spotifylive, ttlive)
//
//  Semua media (audio / video / sampul / lirik) diambil di SERVER BOT lalu DITANAM langsung di kartu
//  (data URI), jadi kartu tidak butuh tunnel / server relay / jaringan apa pun di dalam WhatsApp.
//  Ukuran kartu dibatasi (WhatsApp membuang kartu rich yang terlalu besar tanpa pesan error).
// =====================================================================
'use strict'

const axios = require('axios')
const lazy = (p) => { try { return require(p) } catch { return null } }
const yt = require('./youtube')
const ffm = lazy('./ffm')
const scriptmind = lazy('./scriptmind')
const ytultra = lazy('./ytultra')
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'

// bitrate MP3 yang VALID: 22,05 kHz (<=32k) memakai MPEG-2 (8/16/24/32), 44,1 kHz memakai MPEG-1 (40..160)
const snapKbps = (k) => {
  const set = k <= 32 ? [8, 16, 24, 32] : [40, 48, 56, 64, 80, 96, 112, 128, 160]
  let best = set[0]
  for (const v of set) if (v <= k) best = v
  return best
}

const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')
const toSec = (d) => String(d || '').split(':').reverse().reduce((a, v, i) => a + (parseInt(v, 10) || 0) * 60 ** i, 0)
const mmss = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`
const jsonForScript = (o) => JSON.stringify(o).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029')

// "Artis - Judul (Official Video) | Lyrics" -> { artist, track }
function splitTitle(title, channel) {
  let t = String(title || '')
    .replace(/[\[(【][^\])】]*(official|video|lyrics?|lirik|audio|mv|clip|visualizer|hd|4k|remaster|live|sound|fyp|tiktok|viral)[^\])】]*[\])】]/gi, ' ')
    .replace(/\b(official\s*(music\s*)?(video|audio)|lyric\s*video|video\s*clip|lirik|lyrics?)\b/gi, ' ')
    .replace(/\s*[|｜•]\s*.*$/, '')
    .replace(/\s{2,}/g, ' ')
    .trim()
  let artist = String(channel || '').replace(/\s*-\s*Topic$/i, '').replace(/VEVO$/i, '').replace(/\s*official\s*$/i, '').trim()
  const m = t.match(/^(.{2,60}?)\s+[-–—]\s+(.{2,100})$/)
  if (m) { artist = m[1].trim(); t = m[2].trim() }
  return { artist, track: t.replace(/\s+(ft|feat)\.?\s.*$/i, '').trim() }
}

// ---------------------------------------------------------------- pencarian video
async function findVideo(query) {
  if (/^https?:\/\//i.test(query)) {
    const id = yt.videoIdFrom(query)
    if (!id) throw new Error('Link YouTube tidak valid.')
    let info = null
    try { info = await yt.infoFromUrl(query) } catch {}
    return { id, url: yt.watchUrl(id), title: info?.title || query, channel: info?.channel || info?.author || '', duration: info?.duration || '' }
  }
  try {
    const yts = require('yt-search')
    const r = await yts(query)
    const v = r.videos && r.videos[0]
    if (v) return { id: v.videoId, url: v.url, title: v.title, channel: v.author?.name || '', duration: v.timestamp || '' }
  } catch {}
  const [it] = await yt.search(query, 1)
  return { id: it.id, url: it.url || yt.watchUrl(it.id), title: it.title, channel: it.channel, duration: it.duration }
}

// ---------------------------------------------------------------- ambil audio (beberapa jalur cadangan)
// Berkas harus benar-benar audio (bukan halaman error HTML/JSON dari API). Dicek lewat "magic bytes".
function looksAudio(b) {
  if (!b || b.length < 12) return false
  const s4 = b.slice(0, 4).toString('latin1')
  if (s4 === 'OggS' || s4 === 'RIFF' || s4 === 'fLaC' || s4.startsWith('ID3')) return true
  if (b.slice(4, 8).toString('latin1') === 'ftyp') return true // mp4/m4a
  if (b[0] === 0x1a && b[1] === 0x45 && b[2] === 0xdf && b[3] === 0xa3) return true // webm/mkv
  if (b[0] === 0xff && (b[1] & 0xe0) === 0xe0) return true // mp3/aac (frame sync)
  return false
}

// convert(buf) dipanggil untuk tiap sumber; kalau melempar error, sumber itu dianggap rusak dan lanjut ke sumber berikutnya.
async function getAudio(video, convert) {
  const tries = []
  const grab = async (u) => {
    const r = await axios.get(u, { responseType: 'arraybuffer', timeout: 120000, maxContentLength: 60 * 1024 * 1024, headers: { 'User-Agent': UA } })
    const ct = String(r.headers?.['content-type'] || '')
    if (/text\/|json|html|xml/i.test(ct)) throw new Error(`bukan audio (${ct.split(';')[0]})`)
    const b = Buffer.from(r.data)
    if (b.length < 20000) throw new Error('berkas terlalu kecil')
    if (!looksAudio(b)) throw new Error('isi berkas bukan audio')
    return b
  }
  if (scriptmind) tries.push(['scriptmind', async () => grab((await scriptmind.resolve(video.url)).audio)])
  if (ytultra) tries.push(['ytultra', async () => {
    const { medias } = await ytultra.fetchMedias(video.url)
    const m = ytultra.pick(medias, { audio: true })
    if (!m) throw new Error('tidak ada audio')
    return grab(m.url)
  }])
  tries.push(['azbry', async () => {
    const res = await axios.get(`https://api.azbry.com/api/download/ytmp3?url=${encodeURIComponent(video.url)}`, { timeout: 45000 })
    const link = res.data?.result?.download
    if (!res.data?.status || !link) throw new Error('API tidak mengembalikan link')
    return grab(link)
  }])
  // cadangan terakhir: engine yt-dlp milik bot (tanpa server pihak ketiga)
  tries.push(['yt-dlp', async () => {
    const r = await require('./ytdlp').download(video.url, { audio: true })
    try {
      const f = r.files.find((x) => x.kind === 'audio') || r.files[0]
      const b = require('fs').readFileSync(f.file)
      if (!looksAudio(b)) throw new Error('isi berkas bukan audio')
      return b
    } finally { r.cleanup() }
  }])
  const fails = []
  for (const [name, fn] of tries) {
    try {
      const buf = await fn()
      const out = convert ? await convert(buf) : null
      return { buf, out }
    } catch (e) {
      console.log(`[LIVEMEDIA] sumber ${name} ditolak: ${e.message}`)
      fails.push(`${name}: ${e.message}`)
    }
  }
  throw new Error('Semua sumber audio gagal (' + fails.join('; ') + ')')
}

// potong + kecilkan supaya muat di kartu. Mengembalikan { data: Buffer, sec, ext, mime }
function sniffMime(b) {
  const h = b.slice(0, 12)
  if (h.slice(4, 8).toString('latin1') === 'ftyp') return 'audio/mp4'
  if (h.slice(0, 4).toString('latin1') === 'OggS') return 'audio/ogg'
  if (h[0] === 0x1a && h[1] === 0x45 && h[2] === 0xdf && h[3] === 0xa3) return 'audio/webm'
  if (h.slice(0, 4).toString('latin1') === 'RIFF') return 'audio/wav'
  return 'audio/mpeg'
}

// Batas ukuran audio di kartu (KB). Kartu rich yang terlalu besar DIBUANG diam-diam oleh WhatsApp
// (pesan "terkirim" tapi tidak muncul), jadi lagu panjang dipadatkan supaya muat DENGAN DURASI PENUH.
// Lagu yang sudah kecil dipakai apa adanya. Ubah lewat global.play2 = { maxKB: 1500 } kalau kartu besar masih sampai.
async function makeClip(buf, sec, kbps, maxKB = 640) {
  let total = 0
  if (ffm) { try { total = (await ffm.duration(buf)) || 0 } catch {} }
  const len = sec > 0 ? Math.min(sec, total || sec) : total
  const fits = buf.length <= maxKB * 1024
  // Kartu hanya andal memutar MP3: format lain (webm/m4a/ogg) sering gagal di WebView -> "Audio gagal: EncodingError"
  const isMp3 = sniffMime(buf) === 'audio/mpeg' && (buf.slice(0, 3).toString('latin1') === 'ID3' || (buf[0] === 0xff && (buf[1] & 0xe0) === 0xe0))
  if (!(kbps > 0) && !(sec > 0) && fits && isMp3) return { data: buf, sec: len, mime: 'audio/mpeg' }
  if (ffm) {
    // bitrate yang muat di batas ukuran (opus jauh lebih bagus daripada mp3 di bitrate rendah)
    let k = kbps > 0 ? kbps : Math.floor((maxKB * 1024 * 8) / 1000 / Math.max(10, len || 240) * 0.94)
    k = Math.max(12, Math.min(k, 160))
    k = snapKbps(k)
    const trims = sec > 0 ? ['-t', String(sec)] : []
    try {
      const out = await ffm.run(buf, 'mp3', (i, o) => ['-i', i, ...trims, '-vn', '-map_metadata', '-1', '-ac', k >= 96 ? '2' : '1', '-ar', k <= 32 ? '22050' : '44100', '-c:a', 'libmp3lame', '-b:a', `${k}k`, o], 300000)
      return { data: out, sec: len, mime: 'audio/mpeg', kbps: k }
    } catch (e) { console.log('[LIVEMEDIA] ffmpeg gagal:', e.message) }
    try {
      const out = await ffm.run(buf, 'ogg', (i, o) => ['-i', i, ...trims, '-vn', '-map_metadata', '-1', '-ac', k >= 96 ? '2' : '1', '-c:a', 'libopus', '-b:a', `${k}k`, '-vbr', 'constrained', '-application', 'audio', o], 300000)
      return { data: out, sec: len, mime: 'audio/ogg', kbps: k }
    } catch (e) { console.log('[LIVEMEDIA] opus gagal, coba mp3:', e.message) }
  }
  // ffmpeg tidak tersedia/gagal: hanya berkas yang memang audio yang boleh dikirim apa adanya
  if (!looksAudio(buf)) throw new Error('data audio rusak / bukan audio')
  return { data: buf, sec: len, mime: sniffMime(buf) }
}

// ---------------------------------------------------------------- sampul
async function getCover(id) {
  let buf = null
  try { buf = await yt.thumbBuffer(id, 640, 640) } catch {}
  if (!buf) {
    try { buf = Buffer.from((await axios.get(yt.thumbOf(id), { responseType: 'arraybuffer', timeout: 15000 })).data) } catch {}
  }
  if (!buf) return ''
  try {
    const out = await require('sharp')(buf).resize(360, 360, { fit: 'cover' }).jpeg({ quality: 62 }).toBuffer()
    return `data:image/jpeg;base64,${out.toString('base64')}`
  } catch {
    return buf.length < 60000 ? `data:image/jpeg;base64,${buf.toString('base64')}` : ''
  }
}

// ---------------------------------------------------------------- lirik
function parseLrc(lrc) {
  const out = []
  for (const raw of String(lrc || '').split(/\r?\n/)) {
    const stamps = [...raw.matchAll(/\[(\d{1,3}):(\d{2})(?:[.:](\d{1,3}))?\]/g)]
    if (!stamps.length) continue
    const text = raw.replace(/\[[^\]]*\]/g, '').trim()
    for (const s of stamps) {
      const frac = s[3] ? Number('0.' + s[3]) : 0
      out.push({ t: Number(s[1]) * 60 + Number(s[2]) + frac, s: text })
    }
  }
  out.sort((a, b) => a.t - b.t)
  return out
}

async function getLyrics(video) {
  const { artist, track } = splitTitle(video.title, video.channel)
  const dur = toSec(video.duration)
  const H = { headers: { 'User-Agent': 'WhatsAppBot-play2/1.0' }, timeout: 15000 }
  const pick = (list) => {
    if (!Array.isArray(list) || !list.length) return null
    const withSync = list.filter((x) => x.syncedLyrics)
    const pool = withSync.length ? withSync : list.filter((x) => x.plainLyrics)
    if (!pool.length) return null
    if (dur) pool.sort((a, b) => Math.abs((a.duration || 0) - dur) - Math.abs((b.duration || 0) - dur))
    const best = pool[0]
    if (dur && best.duration && Math.abs(best.duration - dur) > 25) return null // beda terlalu jauh = lagu lain
    return best
  }
  const attempts = [
    () => axios.get('https://lrclib.net/api/get', { ...H, params: { track_name: track, artist_name: artist, duration: dur || undefined } }).then((r) => [r.data]),
    () => axios.get('https://lrclib.net/api/search', { ...H, params: { track_name: track, artist_name: artist } }).then((r) => r.data),
    () => axios.get('https://lrclib.net/api/search', { ...H, params: { q: `${artist} ${track}`.trim() } }).then((r) => r.data),
    () => axios.get('https://lrclib.net/api/search', { ...H, params: { q: String(video.title).slice(0, 80) } }).then((r) => r.data)
  ]
  for (const a of attempts) {
    try {
      const hit = pick(await a())
      if (hit) {
        const synced = hit.syncedLyrics ? parseLrc(hit.syncedLyrics) : []
        if (synced.length >= 3) return { mode: 'sync', lines: synced, title: hit.trackName, artist: hit.artistName }
        if (hit.plainLyrics) return { mode: 'plain', lines: String(hit.plainLyrics).split(/\r?\n/).map((s) => ({ s: s.trim() })), title: hit.trackName, artist: hit.artistName }
      }
    } catch {}
  }
  // cadangan: lirik biasa (tanpa timestamp)
  try {
    const r = await axios.get('https://api-faa.my.id/faa/lyrics', { params: { q: `${artist} ${track}`.trim() }, timeout: 15000 })
    const txt = r.data?.result?.lyrics
    if (r.data?.status && txt) return { mode: 'plain', lines: String(txt).split(/\r?\n/).map((s) => ({ s: s.trim() })) }
  } catch {}
  return { mode: 'none', lines: [] }
}


// ---------------------------------------------------------------- gambar kecil (sampul / thumbnail hasil cari)
async function imgUri(buf, size = 360, quality = 62) {
  if (!buf || !buf.length) return ''
  try {
    const out = await require('sharp')(buf).resize(size, size, { fit: 'cover' }).jpeg({ quality }).toBuffer()
    return `data:image/jpeg;base64,${out.toString('base64')}`
  } catch {
    return buf.length < 40000 ? `data:image/jpeg;base64,${buf.toString('base64')}` : ''
  }
}
async function imgFromUrl(url, size = 360, quality = 62) {
  if (!url) return ''
  try {
    const r = await axios.get(url, { responseType: 'arraybuffer', timeout: 15000, headers: { 'User-Agent': UA } })
    return await imgUri(Buffer.from(r.data), size, quality)
  } catch { return '' }
}

// ---------------------------------------------------------------- YouTube: daftar hasil cari
async function ytSearch(query, n = 6) {
  const out = []
  try {
    const r = await require('yt-search')(query)
    for (const v of (r.videos || []).slice(0, n)) out.push({ id: v.videoId, url: v.url, title: v.title, channel: v.author?.name || '', duration: v.timestamp || '', thumb: v.thumbnail || v.image || '' })
  } catch {}
  if (!out.length) {
    const list = await yt.search(query, n)
    for (const it of list) out.push({ id: it.id, url: it.url || yt.watchUrl(it.id), title: it.title, channel: it.channel, duration: it.duration, thumb: yt.thumbOf(it.id) })
  }
  return out
}

// ---------------------------------------------------------------- video: kecilkan supaya muat di kartu
// Hasil: { data: Buffer(mp4 h264+aac), sec, mime, w, h, kbps }. Video penuh dikirim terpisah sebagai pesan video biasa.
async function videoPreview(buf, { maxKB = 900, maxSec = 45 } = {}) {
  if (!ffm) throw new Error('ffmpeg tidak tersedia')
  let total = 0
  try { total = (await ffm.duration(buf)) || 0 } catch {}
  const sec = Math.max(5, Math.min(maxSec, total || maxSec))
  let budget = Math.floor((maxKB * 1024 * 8) / 1000 / sec * 0.86) // kbps total (video+audio)
  for (let attempt = 0; attempt < 3; attempt++) {
    const aK = budget < 90 ? 16 : 24
    const vK = Math.max(40, budget - aK)
    const h = vK < 110 ? 240 : vK < 260 ? 288 : 360
    const out = await ffm.run(buf, 'mp4', (i, o) => [
      '-i', i, '-t', String(sec), '-map_metadata', '-1',
      '-vf', `scale=-2:${h},fps=20`, '-c:v', 'libx264', '-profile:v', 'baseline', '-level', '3.0', '-pix_fmt', 'yuv420p',
      '-preset', 'veryfast', '-b:v', `${vK}k`, '-maxrate', `${Math.round(vK * 1.25)}k`, '-bufsize', `${vK * 2}k`,
      '-c:a', 'aac', '-ac', '1', '-ar', '22050', '-b:a', `${aK}k`, '-movflags', '+faststart', o
    ], 300000)
    if (out.length <= maxKB * 1024 || attempt === 2) return { data: out, sec, mime: 'video/mp4', h, kbps: vK + aK, fits: out.length <= maxKB * 1024 }
    budget = Math.floor(budget * (maxKB * 1024) / out.length * 0.9) // terlalu besar -> turunkan bitrate lalu ulangi
  }
}

// video YouTube penuh (maks ~360p) lewat engine yt-dlp bawaan bot
async function ytVideoBuffer(url) {
  const d = require('./ytdlp')
  const r = await d.download(url, { audio: false, height: 360 })
  try {
    const f = (r.files || []).find((x) => x.kind !== 'audio') || (r.files || [])[0]
    if (!f) throw new Error('berkas video tidak ditemukan')
    return { buf: require('fs').readFileSync(f.file), title: r.title || '' }
  } finally { try { r.cleanup() } catch {} }
}

// ---------------------------------------------------------------- Spotify
// cari lewat Spotify Web API (Client Credentials). Isi global.spotify = { clientId, clientSecret } untuk memakai kunci sendiri.
let _spTok = null
const spKeys = () => Object.assign({ clientId: 'd0b7f73c049d4f079d2c42e15f10568f', clientSecret: '63a72d79d7744e33906c6fb0c048cb82' }, global.spotify || {})
async function spToken() {
  if (_spTok && Date.now() < _spTok.exp) return _spTok.v
  const k = spKeys()
  const { data } = await axios.post('https://accounts.spotify.com/api/token', 'grant_type=client_credentials', {
    headers: { Authorization: 'Basic ' + Buffer.from(`${k.clientId}:${k.clientSecret}`).toString('base64'), 'Content-Type': 'application/x-www-form-urlencoded' },
    timeout: 20000
  })
  _spTok = { v: data.access_token, exp: Date.now() + data.expires_in * 1000 - 8000 }
  return _spTok.v
}
const spFmt = (t) => ({
  id: t.id, url: t.external_urls?.spotify || `https://open.spotify.com/track/${t.id}`, title: t.name,
  artist: (t.artists || []).map((a) => a.name).join(', '), album: t.album?.name || '', durMs: t.duration_ms || 0,
  duration: mmss((t.duration_ms || 0) / 1000), thumb: (t.album?.images || []).slice(-1)[0]?.url || '', cover: t.album?.images?.[0]?.url || ''
})
async function spSearch(query, n = 6) {
  try {
    const tk = await spToken()
    const { data } = await axios.get('https://api.spotify.com/v1/search', { params: { q: query, type: 'track', limit: n }, headers: { Authorization: `Bearer ${tk}` }, timeout: 20000 })
    const items = (data?.tracks?.items || []).map(spFmt)
    if (items.length) return items
  } catch (e) { console.log('[LIVEMEDIA] Spotify API gagal, pakai YouTube:', e.message) }
  // cadangan: cari di YouTube lalu anggap hasilnya "lagu"
  return (await ytSearch(query + ' audio', n)).map((v) => { const s = splitTitle(v.title, v.channel); return { id: v.id, url: v.url, title: s.track || v.title, artist: s.artist || v.channel, album: '', durMs: toSec(v.duration) * 1000, duration: v.duration, thumb: v.thumb, cover: v.thumb, viaYt: true } })
}
async function spTrackFromUrl(url) {
  const id = String(url).match(/track\/([A-Za-z0-9]+)/)?.[1]
  if (!id) throw new Error('Link Spotify tidak valid (harus link track).')
  try {
    const tk = await spToken()
    const { data } = await axios.get(`https://api.spotify.com/v1/tracks/${id}`, { headers: { Authorization: `Bearer ${tk}` }, timeout: 20000 })
    return spFmt(data)
  } catch (e) {
    console.log('[LIVEMEDIA] Spotify API gagal untuk link, coba oEmbed:', e.message)
    // cadangan tanpa kunci: oEmbed publik memberi judul -> cari lagi
    const { data } = await axios.get('https://open.spotify.com/oembed', { params: { url: `https://open.spotify.com/track/${id}` }, timeout: 15000 })
    const hit = (await spSearch(String(data?.title || id), 1))[0]
    if (!hit) throw new Error('Lagu dari link itu tidak ditemukan.')
    return hit
  }
}

async function grabAudio(u, headers = {}) {
  const r = await axios.get(u, { responseType: 'arraybuffer', timeout: 120000, maxContentLength: 60 * 1024 * 1024, maxRedirects: 10, headers: { 'User-Agent': UA, ...headers } })
  const ct = String(r.headers?.['content-type'] || '')
  if (/text\/|json|html|xml/i.test(ct)) throw new Error(`bukan audio (${ct.split(';')[0]})`)
  const b = Buffer.from(r.data)
  if (b.length < 20000) throw new Error('berkas terlalu kecil')
  if (!looksAudio(b)) throw new Error('isi berkas bukan audio')
  return b
}

// audio lagu Spotify: dlapi -> azbry -> (cadangan) audio YouTube "artis judul". convert(buf) per sumber, seperti getAudio().
async function spAudio(track, convert) {
  const tries = []
  const dl = lazyDlapi()
  if (track.url && !track.viaYt) {
    tries.push(['dlapi', async () => grabAudio(await dl.convert(track.url, 'mp3'))])
    tries.push(['azbry', async () => {
      const r = await axios.get('https://api.azbry.com/api/download/spotify', { params: { url: track.url }, timeout: 45000 })
      const link = r.data?.downloadLink || r.data?.rawLink
      if (!r.data?.status || !link) throw new Error('API tidak mengembalikan link')
      return grabAudio(link, { Referer: 'https://musicfab.org/' })
    }])
  }
  const fails = []
  for (const [name, fn] of tries) {
    try { const buf = await fn(); return { buf, out: convert ? await convert(buf) : null, via: name } } catch (e) { console.log(`[LIVEMEDIA] spotify ${name} ditolak: ${e.message}`); fails.push(`${name}: ${e.message}`) }
  }
  // cadangan terakhir: audio YouTube dari judul lagu
  const hits = await ytSearch(`${track.artist} ${track.title} audio`, 3)
  if (!hits.length) throw new Error('Semua sumber audio Spotify gagal (' + fails.join('; ') + ')')
  const r = await getAudio(hits[0], convert)
  return { ...r, via: 'youtube' }
}
function lazyDlapi() {
  const c = axios.create({ headers: { Authorization: 'Bearer pGLXoCsVu0hcstAecIDwlrlbcrUzv0e1cWBJ0yuB', 'Content-Type': 'application/json', 'User-Agent': 'Spotmate/1.0' }, timeout: 30000 })
  return {
    async convert(url, format = 'mp3') {
      const { data: init } = await c.post('https://master.dlapi.app/api/v1/convert', { url, format })
      if (init?.download_url) return init.download_url
      const id = init?.task_id || init?.id
      if (!id) throw new Error('tidak ada task id')
      for (let i = 0; i < 40; i++) {
        await new Promise((r) => setTimeout(r, 3000))
        const { data: s } = await c.get(`https://master.dlapi.app/api/v1/tasks/${id}`)
        if (s?.status === 'finished' || s?.status === 'completed') return s.result?.download_url || s.download_url
        if (s?.status === 'failed') throw new Error('proses di server gagal')
      }
      throw new Error('timeout')
    }
  }
}

// ---------------------------------------------------------------- TikTok (tikwm.com)
const twAbs = (u) => (u && u.startsWith('/') ? `https://www.tikwm.com${u}` : u)
async function ttSearch(query, n = 6) {
  const { data } = await axios.post('https://www.tikwm.com/api/feed/search', new URLSearchParams({ keywords: query, count: String(n), cursor: '0', hd: '1' }), { headers: { 'User-Agent': UA }, timeout: 25000 })
  const vids = data?.data?.videos || []
  if (!vids.length) throw new Error(data?.msg && data.code !== 0 ? `TikTok: ${data.msg}` : 'Tidak ada hasil TikTok.')
  return vids.slice(0, n).map((v) => ({
    id: v.video_id, url: `https://www.tiktok.com/@${v.author?.unique_id || 'user'}/video/${v.video_id}`, title: v.title || '(tanpa judul)',
    author: v.author?.nickname || v.author?.unique_id || '', duration: v.duration ? mmss(v.duration) : '', sec: v.duration || 0,
    thumb: twAbs(v.cover || v.origin_cover), play: twAbs(v.hdplay || v.play), music: twAbs(v.music_info?.play || v.music)
  }))
}
async function ttInfo(url) {
  const { data } = await axios.post('https://www.tikwm.com/api/', new URLSearchParams({ url, hd: '1' }), { headers: { 'User-Agent': UA }, timeout: 25000 })
  if (!data || data.code !== 0 || !data.data) throw new Error(`Gagal mengambil data TikTok${data?.msg ? ': ' + data.msg : '.'}`)
  const d = data.data
  return { id: d.id, url, title: d.title || '', author: d.author?.nickname || d.author?.unique_id || '', sec: d.duration || 0, duration: d.duration ? mmss(d.duration) : '', thumb: twAbs(d.cover || d.origin_cover), play: twAbs(d.hdplay || d.play), music: twAbs(d.music), images: Array.isArray(d.images) ? d.images.map(twAbs) : [] }
}
async function ttVideoBuffer(info) {
  if (!info.play) throw new Error('video TikTok tidak punya link unduh (mungkin slide foto)')
  const r = await axios.get(info.play, { responseType: 'arraybuffer', timeout: 90000, maxContentLength: 120 * 1024 * 1024, headers: { 'User-Agent': UA, Referer: 'https://www.tiktok.com/' } })
  const b = Buffer.from(r.data)
  if (b.length < 20000) throw new Error('video TikTok terlalu kecil / rusak')
  return b
}

module.exports = {
  esc, toSec, mmss, jsonForScript, splitTitle, findVideo, looksAudio, getAudio, sniffMime, makeClip, getCover, parseLrc, getLyrics,
  imgUri, imgFromUrl, ytSearch, videoPreview, ytVideoBuffer, spSearch, spTrackFromUrl, spAudio, ttSearch, ttInfo, ttVideoBuffer, snapKbps
}
