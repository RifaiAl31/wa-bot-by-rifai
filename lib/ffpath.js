// lib/ffpath.js — pastikan `ffmpeg`/`ffprobe` selalu bisa dipanggil oleh SEMUA fitur.
// Panel (Pterodactyl dll) biasanya tidak punya ffmpeg sistem; binary bawaan npm dimasukkan ke PATH.
'use strict'
const fs = require('fs')
const path = require('path')
const { spawnSync } = require('child_process')

function has(cmd) { try { return spawnSync(cmd, ['-version'], { stdio: 'ignore' }).status === 0 } catch { return false } }

function install() {
  if (has('ffmpeg')) return 'sistem'
  const cands = []
  try { cands.push(require('@ffmpeg-installer/ffmpeg').path) } catch {}
  try { cands.push(require('ffmpeg-static')) } catch {}
  for (const bin of cands) {
    if (!bin || !fs.existsSync(bin)) continue
    try { fs.chmodSync(bin, 0o755) } catch {}
    const dir = path.dirname(bin)
    // beberapa paket menamai binary bukan "ffmpeg": buat tautan supaya `ffmpeg` terpanggil
    const want = path.join(dir, process.platform === 'win32' ? 'ffmpeg.exe' : 'ffmpeg')
    if (!fs.existsSync(want)) { try { fs.symlinkSync(bin, want) } catch { try { fs.copyFileSync(bin, want); fs.chmodSync(want, 0o755) } catch {} } }
    process.env.PATH = dir + path.delimiter + (process.env.PATH || '')
    if (has('ffmpeg')) return 'bawaan'
  }
  console.log('[FFMPEG] ffmpeg tidak ditemukan. Fitur audio/video/stiker animasi butuh ffmpeg: `apt install ffmpeg` atau `npm i @ffmpeg-installer/ffmpeg`.')
  return null
}
module.exports = { install, has }
