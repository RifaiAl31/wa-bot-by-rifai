// toVN: audio -> voice note (opus/ogg); generateWaveform: gelombang suara 64 titik untuk pesan suara
'use strict'
const ffm = require('../ffm.js')

async function toVN(buffer) {
  return ffm.run(Buffer.from(buffer), 'opus', (i, o) => ['-i', i, '-vn', '-c:a', 'libopus', '-b:a', '64k', '-ar', '48000', '-ac', '1', '-f', 'ogg', o])
}

async function generateWaveform(buffer, bars = 64) {
  const pcm = await ffm.run(Buffer.from(buffer), 'pcm', (i, o) => ['-i', i, '-vn', '-f', 's16le', '-ac', '1', '-ar', '8000', o])
  const n = Math.floor(pcm.length / 2)
  const out = new Uint8Array(bars)
  if (!n) return out
  const step = Math.max(1, Math.floor(n / bars))
  let max = 1
  const raw = []
  for (let b = 0; b < bars; b++) {
    let peak = 0
    for (let k = b * step; k < Math.min(n, (b + 1) * step); k++) peak = Math.max(peak, Math.abs(pcm.readInt16LE(k * 2)))
    raw.push(peak)
    max = Math.max(max, peak)
  }
  raw.forEach((v, b) => { out[b] = Math.round((v / max) * 100) })
  return out
}

const api = { toVN, generateWaveform }
module.exports = { __esModule: true, default: api, ...api }
