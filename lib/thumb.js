// =====================================================================
//  lib/thumb.js — FOTO THUMBNAIL BOT + GIF thumbnail (diatur lewat settings.js)
//
//   global.thumbnail     foto bot: link https://... ATAU path file lokal (mis. './media/thumbnail.jpg'). Kosong = gambar bawaan.
//   global.thumbnailGif  true = menu memakai GIF/video (global.thumbnailvid) | false = hanya foto
//   global.thumbnailvid  GIF/video .mp4: link https://... ATAU path file lokal (mis. './media/thumbnail.mp4')
//
//  Semua fungsi di sini TIDAK PERNAH melempar error: link mati / file tidak ada / gagal unduh -> otomatis
//  memakai gambar bawaan (media/thumbnail.jpg), sehingga menu tidak lagi error gara-gara thumbnail.
// =====================================================================
'use strict'

const fs = require('fs')
const path = require('path')

const ROOT = path.join(__dirname, '..')
const BUNDLED = [
  path.join(ROOT, 'media', 'thumbnail.jpg')
]
const MAX_IMAGE = 8 * 1024 * 1024
const MAX_VIDEO = 14 * 1024 * 1024
const TTL = 30 * 60 * 1000 // link jarak jauh diunduh ulang tiap 30 menit

const cache = new Map() // kunci sumber -> { buf, at }
const inflight = new Map()

const isUrl = (s) => /^https?:\/\//i.test(String(s || '').trim())
const clean = (s) => String(s || '').trim().replace(/^file:\/\//i, '')

// path lokal relatif -> dari folder bot
function localPath(s) {
  const p = clean(s)
  if (!p || isUrl(p)) return ''
  const abs = path.isAbsolute(p) ? p : path.resolve(ROOT, p)
  try { return fs.statSync(abs).isFile() ? abs : '' } catch { return '' }
}

async function fetchBuf(url, max, ms = 15000) {
  const res = await fetch(url, { signal: AbortSignal.timeout(ms), headers: { 'user-agent': 'Mozilla/5.0 WhatsApp Bot' }, redirect: 'follow' })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const len = Number(res.headers.get('content-length') || 0)
  if (len && len > max) throw new Error('file terlalu besar')
  const buf = Buffer.from(await res.arrayBuffer())
  if (buf.length < 100) throw new Error('file kosong')
  if (buf.length > max) throw new Error('file terlalu besar')
  const type = String(res.headers.get('content-type') || '')
  if (/text\/html|application\/json/i.test(type)) throw new Error('bukan gambar/video (' + type + ')')
  return buf
}

// muat satu sumber (link / path) -> Buffer | null. Hasil di-cache.
async function load(src, max) {
  const key = clean(src)
  if (!key) return null
  const hit = cache.get(key)
  if (hit && (!isUrl(key) || Date.now() - hit.at < TTL)) return hit.buf
  if (inflight.has(key)) return inflight.get(key)
  const job = (async () => {
    try {
      let buf = null
      if (isUrl(key)) buf = await fetchBuf(key, max)
      else {
        const p = localPath(key)
        if (p) {
          const st = fs.statSync(p)
          if (st.size > 100 && st.size <= max) buf = fs.readFileSync(p)
        }
      }
      if (buf) cache.set(key, { buf, at: Date.now() })
      return buf
    } catch (err) {
      if (!load.warned) load.warned = new Set()
      if (!load.warned.has(key)) { load.warned.add(key); console.log(`[THUMB] gagal memuat "${key.slice(0, 90)}": ${err.message} — memakai gambar bawaan`) }
      return hit ? hit.buf : null // pakai salinan lama kalau ada
    } finally {
      inflight.delete(key)
    }
  })()
  inflight.set(key, job)
  return job
}

function bundled() {
  for (const f of BUNDLED) {
    const hit = cache.get(f)
    if (hit) return hit.buf
    try {
      const buf = fs.readFileSync(f)
      cache.set(f, { buf, at: Date.now() })
      return buf
    } catch {}
  }
  // 1x1 piksel gelap: jalan terakhir supaya pemanggil tidak pernah mendapat undefined
  return Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64')
}

// foto thumbnail bot (Buffer) — SELALU ada hasilnya
async function image() {
  return (await load(global.thumbnail, MAX_IMAGE)) || bundled()
}

// foto thumbnail kecil (JPEG, sisi terpanjang <= size) untuk jpegThumbnail / link preview
async function small(size = 300) {
  const buf = await image()
  try {
    return await require('sharp')(buf).resize(size, size, { fit: 'cover' }).jpeg({ quality: 70 }).toBuffer()
  } catch {
    return buf
  }
}

// GIF/video thumbnail: { buffer, mimetype } atau null kalau dimatikan / tidak ada
const gifOn = () => global.thumbnailGif !== false && !!clean(global.thumbnailvid || global.thumbnailGifSrc)
async function gif() {
  if (!gifOn()) return null
  const buf = await load(global.thumbnailvid || global.thumbnailGifSrc, MAX_VIDEO)
  if (!buf) return null
  const head = buf.slice(0, 12).toString('latin1')
  if (/^GIF8/.test(head)) return { buffer: buf, mimetype: 'image/gif', isGifImage: true }
  return { buffer: buf, mimetype: 'video/mp4' }
}

// konten media untuk menu: { video, gifPlayback } kalau GIF aktif dan ada, jika tidak { image }
async function menuMedia() {
  const g = await gif()
  if (g && !g.isGifImage) return { video: g.buffer, gifPlayback: true, mimetype: g.mimetype }
  return { image: await image() }
}

// link publik thumbnail ('' kalau berupa file lokal) — untuk externalAdReply.thumbnailUrl
const publicUrl = () => (isUrl(global.thumbnail) ? clean(global.thumbnail) : '')

// pasang pembantu global untuk plugin hasil porting (engine/*): global.getThumbnail() dll
function install() {
  global.getThumbnail = image
  global.getThumbnailSmall = small
  global.getMenuMedia = menuMedia
  global.getThumbGif = gif
}

function reset() {
  cache.clear()
  if (load.warned) load.warned.clear()
}

// simpan Buffer ke media/ lalu kembalikan path relatif ('./media/xxx') — dipakai .ubah saat unggah ke GitHub gagal
function saveLocal(buf, name) {
  const dir = path.join(ROOT, 'media')
  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(path.join(dir, name), buf)
  return './media/' + name
}

// ubah satu variabel global.* di settings.js (tambahkan barisnya kalau belum ada). Mengembalikan true kalau berhasil.
function setSetting(name, value) {
  const file = path.join(ROOT, 'settings.js')
  let src = fs.readFileSync(file, 'utf8')
  const lit = typeof value === 'string' ? `'${value.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'` : String(value)
  const re = new RegExp(`^(\\s*global\\.${name}\\s*=\\s*)(?:'[^'\\n]*'|"[^"\\n]*"|\`[^\`\\n]*\`|true|false|null|[\\w.\\-]+)`, 'm')
  if (re.test(src)) src = src.replace(re, (_, pre) => pre + lit)
  else if (/global\.thumbnail\s*=.*\n/.test(src)) src = src.replace(/(global\.thumbnail\s*=.*\n)/, `$1global.${name} = ${lit}\n`)
  else src += `\nglobal.${name} = ${lit}\n`
  fs.writeFileSync(file, src)
  global[name] = value
  reset()
  return true
}

module.exports = { image, small, gif, gifOn, menuMedia, publicUrl, install, reset, saveLocal, setSetting, isUrl, localPath, bundled, load }
