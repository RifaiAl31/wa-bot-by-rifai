// webp2png / webp2mp4: konversi lokal (ffmpeg/sharp) lalu unggah -> URL
'use strict'
const ffm = require('../ffm.js')
const { uploader } = require('./upload.js')

async function webp2png(buffer) {
  let png
  try { png = await require('sharp')(buffer).png().toBuffer() } catch { png = await ffm.run(buffer, 'png', (i, o) => ['-i', i, o]) }
  return uploader(png)
}
async function webp2mp4(buffer) {
  const mp4 = await ffm.run(buffer, 'mp4', (i, o) => ['-i', i, '-movflags', 'faststart', '-pix_fmt', 'yuv420p', '-vf', 'scale=trunc(iw/2)*2:trunc(ih/2)*2', o])
  return uploader(mp4)
}
module.exports = { __esModule: true, webp2png, webp2mp4 }
