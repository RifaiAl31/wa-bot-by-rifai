// writeExif: media (gambar/video/webp) -> stiker WebP + metadata pack. Dipakai .sticker .brat .bratvid .stickertele
'use strict'
const S = require('../adapter/core.js')
const ffm = require('../ffm.js')

async function toWebp(data, mimetype = '', type = '') {
  const isVideo = /video|gif/.test(mimetype) || type === 'video'
  if (isVideo) return S.videoToWebp(data)
  if (/webp/.test(mimetype)) return data
  try {
    const sharp = require('sharp')
    return await sharp(data, { animated: false })
      .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .webp()
      .toBuffer()
  } catch {
    return ffm.run(data, 'webp', (i, o) => ['-i', i, '-vf', "scale='min(512,iw)':'min(512,ih)':force_original_aspect_ratio=decrease,pad=512:512:-1:-1:color=0x00000000", '-vcodec', 'libwebp', o])
  }
}

async function writeExif(media, meta = {}) {
  const data = Buffer.isBuffer(media) ? media : media.data
  const webp = await toWebp(data, media.mimetype || '', media.type || '')
  return S.addExif(webp, meta.packname || meta.packName || global.packname || '', meta.author || meta.packPublish || global.author || '')
}

module.exports = { __esModule: true, default: { writeExif }, writeExif }
