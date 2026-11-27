const fs = require('fs')
const os = require('os')
const path = require('path')
const { spawn, spawnSync } = require('child_process')

// Cari binary ffmpeg/ffprobe: PATH sistem -> @ffmpeg-installer -> ffmpeg-static (panel biasanya tidak punya ffmpeg sistem)
const _bin = {}
function resolveBin(name) {
  if (_bin[name]) return _bin[name]
  try { if (spawnSync(name, ['-version'], { stdio: 'ignore' }).status === 0) return (_bin[name] = name) } catch {}
  const tries = name === 'ffmpeg'
    ? [() => require('@ffmpeg-installer/ffmpeg').path, () => require('ffmpeg-static')]
    : [() => require('@ffprobe-installer/ffprobe').path, () => { const f = require('@ffmpeg-installer/ffmpeg').path; return f.replace(/ffmpeg(\.exe)?$/, (m, e) => 'ffprobe' + (e || '')) }]
  for (const t of tries) {
    try { const p = t(); if (p && fs.existsSync(p)) { try { fs.chmodSync(p, 0o755) } catch {} return (_bin[name] = p) } } catch {}
  }
  return (_bin[name] = name)
}

// Jalankan ffmpeg pada buffer masukan -> buffer keluaran. buildArgs(inFile, outFile) -> array argumen
async function run(buffer, outExt, buildArgs, timeoutMs = 90000) {
  const id = `ffm-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  const input = path.join(os.tmpdir(), `${id}.in`)
  const output = path.join(os.tmpdir(), `${id}.${outExt}`)
  try {
    fs.writeFileSync(input, buffer)
    await new Promise((resolve, reject) => {
      const p = spawn(resolveBin('ffmpeg'), ['-y', ...buildArgs(input, output)], { stdio: ['ignore', 'ignore', 'pipe'] })
      let err = ''
      p.stderr.on('data', (d) => { err = (err + d).slice(-600) })
      const t = setTimeout(() => { p.kill('SIGKILL'); reject(new Error('timeout')) }, timeoutMs)
      p.on('error', (e) => { clearTimeout(t); reject(e.code === 'ENOENT' ? new Error('nff') : e) })
      p.on('close', (c) => { clearTimeout(t); c === 0 ? resolve() : reject(new Error(`ffmpeg ${c}: ${err.trim().split('\n').slice(-3).join(' | ')}`)) })
    })
    return fs.readFileSync(output)
  } finally {
    for (const f of [input, output]) fs.rmSync(f, { force: true })
  }
}
const explain = (e) => (e.message === 'nff' ? 'ffmpeg belum terpasang di server (sudo apt install ffmpeg).' : e.message === 'timeout' ? 'Proses terlalu lama.' : 'Gagal memproses media.')

// Beberapa buffer masukan -> satu keluaran. buildArgs(inputs[], out) -> argumen ffmpeg
async function runMulti(buffers, outExt, buildArgs, timeoutMs = 120000) {
  const id = `ffm-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  const inputs = buffers.map((_, i) => path.join(os.tmpdir(), `${id}.in${i}`))
  const output = path.join(os.tmpdir(), `${id}.${outExt}`)
  try {
    buffers.forEach((b, i) => fs.writeFileSync(inputs[i], b))
    await new Promise((resolve, reject) => {
      const p = spawn(resolveBin('ffmpeg'), ['-y', ...buildArgs(inputs, output)], { stdio: ['ignore', 'ignore', 'pipe'] })
      let err = ''
      p.stderr.on('data', (d) => { err = (err + d).slice(-600) })
      const t = setTimeout(() => { p.kill('SIGKILL'); reject(new Error('timeout')) }, timeoutMs)
      p.on('error', (e) => { clearTimeout(t); reject(e.code === 'ENOENT' ? new Error('nff') : e) })
      p.on('close', (c) => { clearTimeout(t); c === 0 ? resolve() : reject(new Error(`ffmpeg ${c}: ${err.trim().split('\n').slice(-3).join(' | ')}`)) })
    })
    return fs.readFileSync(output)
  } finally {
    for (const f of [...inputs, output]) fs.rmSync(f, { force: true })
  }
}

function durationViaFfmpeg(file) {
  try {
    const r = spawnSync(resolveBin('ffmpeg'), ['-i', file], { encoding: 'utf8' })
    const m = /Duration:\s*(\d+):(\d+):(\d+(?:\.\d+)?)/.exec((r.stderr || '') + (r.stdout || ''))
    return m ? Math.round(+m[1] * 3600 + +m[2] * 60 + parseFloat(m[3])) : 0
  } catch { return 0 }
}

// Durasi media (detik, dibulatkan) lewat ffprobe. 0 kalau gagal.
async function duration(buffer) {
  const f = path.join(os.tmpdir(), `ffp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.in`)
  try {
    fs.writeFileSync(f, buffer)
    return await new Promise((resolve) => {
      const p = spawn(resolveBin('ffprobe'), ['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=nw=1:nk=1', f])
      let out = ''
      p.stdout.on('data', (d) => (out += d))
      p.on('error', () => resolve(durationViaFfmpeg(f)))
      p.on('close', () => { const v = Math.round(parseFloat(out)) || 0; resolve(v || durationViaFfmpeg(f)) })
    })
  } finally {
    fs.rmSync(f, { force: true })
  }
}

module.exports = { run, runMulti, explain, duration, resolveBin }
