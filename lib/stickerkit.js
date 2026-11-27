// lib/stickerkit.js — pembuat stiker terpusat: gambar/video/GIF -> WEBP 512x512 + metadata pack/author (EXIF).
'use strict'
const core = require("./adapter/core.js")

const isWebp = (b) => Buffer.isBuffer(b) && b.length > 12 && b.toString('ascii', 0, 4) === 'RIFF' && b.toString('ascii', 8, 12) === 'WEBP'

async function imageToWebp(buf, { crop = false, quality = 80 } = {}) {
  const sharp = require('sharp')
  return sharp(buf, { animated: false })
    .rotate()
    .resize(512, 512, { fit: crop ? 'cover' : 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .webp({ quality })
    .toBuffer()
}

// Video/GIF -> WEBP animasi (maks 6 detik). Kalau hasil > ~900KB, diulang dengan kualitas lebih rendah supaya diterima WhatsApp.
async function videoToWebp(buf) {
  let out = await core.videoToWebp(buf)
  if (out.length > 900 * 1024) {
    const ffm = require("./ffm.js")
    out = await ffm.run(buf, 'webp', (i, o) => ['-i', i, '-vcodec', 'libwebp', '-vf',
      "scale=320:320:force_original_aspect_ratio=decrease,fps=10,pad=320:320:-1:-1:color=white@0.0", '-loop', '0', '-t', '5', '-q:v', '40', '-an', '-vsync', '0', o], 120000)
  }
  return out
}

async function stamp(webp, packname, author) {
  try { return await core.addExif(webp, packname, author) } catch (e) { console.log('[STIKER] exif gagal:', e.message); return webp }
}

// kind: 'image' | 'video' | 'webp'
async function make(buf, kind, { packname, author, crop } = {}) {
  let webp
  if (isWebp(buf)) webp = buf
  else if (kind === 'video') webp = await videoToWebp(buf)
  else webp = await imageToWebp(buf, { crop })
  return stamp(webp, packname, author)
}

module.exports = { make, imageToWebp, videoToWebp, stamp, isWebp }
