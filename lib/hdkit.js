// lib/hdkit.js — mesin HD gambar & video yang dipakai .hd .hdr .upscale .remini .unblur .hdvid
//
// Gambar : AI upscale online (iLoveIMG -> ImgLarger -> Remini). Hasil online DIVALIDASI (harus benar-benar lebih besar dari aslinya).
//          Kalau semua server online gagal/lemot, otomatis pakai mesin LOKAL (sharp) yang beneran menajamkan,
//          bukan sekadar membesarkan gambar.
// Video  : AI online (nexray) bila tersedia -> hasil dicek (rasio gambar & resolusi). Kalau rasionya melenceng ("gepeng")
//          atau gagal, otomatis dipakai mesin LOKAL (ffmpeg) yang menjaga rasio asli video.
'use strict'

const axios = require('axios')
const FormData = require('form-data')
const crypto = require('crypto')
const fs = require('fs')
const os = require('os')
const path = require('path')
const { spawn } = require('child_process')

const sharp = () => require('sharp')
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
const MAX_SIDE = 4096 // sisi terpanjang hasil gambar

const withTimeout = (p, ms, label) =>
  Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error(`${label}: timeout ${Math.round(ms / 1000)} dtk`)), ms))])
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

// ======================================================================= GAMBAR
async function imageInfo(buf) {
  const m = await sharp()(buf, { failOn: 'none' }).metadata()
  if (!m.width || !m.height) throw new Error('bukan gambar valid')
  return { w: m.width, h: m.height, hasAlpha: !!m.hasAlpha, format: m.format }
}

// Rapikan masukan: putar sesuai EXIF, frame pertama saja, ke sRGB, transparansi diratakan ke putih
async function prepare(buf) {
  const info = await imageInfo(buf)
  let s = sharp()(buf, { failOn: 'none' }).rotate().toColourspace('srgb')
  if (info.hasAlpha) s = s.flatten({ background: '#ffffff' })
  return s.png().toBuffer()
}

// --- Mesin lokal: lanczos3 + denoise ringan + kontras lokal (CLAHE) + penajaman dua tahap + warna sedikit lebih hidup
async function localEnhance(input, scale = 2) {
  const src = await prepare(input)
  const { w, h } = await imageInfo(src)
  const want = Math.max(1, Math.min(4, Number(scale) || 2))
  let f = Math.min(want, MAX_SIDE / Math.max(w, h))
  if (f < 1) f = 1 // sudah sangat besar: tidak diperbesar lagi, hanya dipertajam
  const W = Math.round(w * f)
  const H = Math.round(h * f)

  // 1) denoise halus sebelum diperbesar supaya artefak JPEG tidak ikut membesar
  let pre = sharp()(src)
  if (Math.min(w, h) < 1500) pre = pre.median(3)
  const clean = await pre.png().toBuffer()

  // 2) perbesar (dua langkah untuk skala >2 → tepi lebih bersih)
  let big = clean
  if (f > 2) {
    const mid = await sharp()(clean).resize(Math.round(w * 2), Math.round(h * 2), { kernel: 'lanczos3' }).png().toBuffer()
    big = await sharp()(mid).resize(W, H, { kernel: 'lanczos3' }).png().toBuffer()
  } else if (f > 1) {
    big = await sharp()(clean).resize(W, H, { kernel: 'lanczos3' }).png().toBuffer()
  }

  // 3) kontras lokal + penajaman: halus untuk tekstur, lebih kuat untuk tepi
  const tile = Math.max(8, Math.min(W, H, Math.round(Math.max(W, H) / 10)))
  const detail = await sharp()(big)
    .clahe({ width: tile, height: tile, maxSlope: 2 })
    .modulate({ saturation: 1.1 })
    .sharpen({ sigma: 0.7, m1: 0.6, m2: 1.6, x1: 2, y2: 12, y3: 22 })
    .sharpen({ sigma: 1.6, m1: 0.4, m2: 1.2, x1: 3, y2: 8, y3: 16 })
    .png()
    .toBuffer()
  return finalize(detail)
}

// JPEG kualitas tinggi (4:4:4) → ukuran file wajar tapi tetap jernih
const finalize = (buf) => sharp()(buf).jpeg({ quality: 95, chromaSubsampling: '4:4:4', mozjpeg: true }).toBuffer()

// --- Penyedia online (semuanya bisa gagal kapan saja; urutan dicoba satu per satu)
const ILOVE_TASK = 'r68zl88mq72xq94j2d5p66bn2z9lrbx20njsbw2qsAvgmzr11lvfhAx9kl87pp6yqgx7c8vg7sfbqnrr42qb16v0gj8jl5s0kq1kgp26mdyjjspd8c5A2wk8b4Adbm6vf5tpwbqlqdr8A9tfn7vbqvy28ylphlxdl379psxpd8r70nzs3sk1'
const ILOVE_SERVERS = ['api1g', 'api2g', 'api3g', 'api8g', 'api9g', 'api10g', 'api11g', 'api12g', 'api13g', 'api14g', 'api15g', 'api16g']

async function iloveimg(buffer, scale) {
  const page = (await axios.get('https://www.iloveimg.com/upscale-image', { headers: { 'User-Agent': UA }, timeout: 20000 })).data
  const cfg = /ilovepdfConfig\s*=\s*(\{[\s\S]*?\});/.exec(page)
  const csrf = /<meta[^>]+name="csrf-token"[^>]+content="([^"]+)"/.exec(page) || /<meta[^>]+content="([^"]+)"[^>]+name="csrf-token"/.exec(page)
  if (!cfg) throw new Error('iLoveIMG: token tidak ditemukan')
  const token = JSON.parse(cfg[1]).token
  const server = ILOVE_SERVERS[Math.floor(Math.random() * ILOVE_SERVERS.length)]
  const headers = { Authorization: 'Bearer ' + token, Origin: 'https://www.iloveimg.com', Cookie: csrf ? '_csrf=' + csrf[1] : '', 'User-Agent': UA }

  const up = new FormData()
  up.append('name', 'image.jpg')
  up.append('chunk', '0')
  up.append('chunks', '1')
  up.append('task', ILOVE_TASK)
  up.append('preview', '1')
  up.append('file', buffer, 'image.jpg')
  const uploaded = (await axios.post(`https://${server}.iloveimg.com/v1/upload`, up, { headers: { ...headers, ...up.getHeaders() }, timeout: 60000, maxBodyLength: Infinity })).data
  if (!uploaded?.server_filename) throw new Error('iLoveIMG: upload gagal')

  const form = new FormData()
  form.append('task', ILOVE_TASK)
  form.append('server_filename', uploaded.server_filename)
  form.append('scale', String(scale >= 4 ? 4 : 2))
  const res = await axios.post(`https://${server}.iloveimg.com/v1/upscale`, form, { headers: { ...headers, ...form.getHeaders() }, responseType: 'arraybuffer', timeout: 90000, maxBodyLength: Infinity })
  return Buffer.from(res.data)
}

async function imglarger(buffer, scale) {
  const base = { Origin: 'https://imgupscaler.com', Referer: 'https://imgupscaler.com/', 'User-Agent': UA }
  const form = new FormData()
  form.append('myfile', buffer, { filename: 'upload.png', contentType: 'image/png' })
  form.append('scaleRadio', String(scale >= 4 ? 4 : 2))
  const up = (await axios.post('https://get1.imglarger.com/api/UpscalerNew/UploadNew', form, { headers: { ...form.getHeaders(), ...base }, timeout: 60000, maxBodyLength: Infinity })).data
  const code = up?.data?.code
  if (up?.code !== 200 || !code) throw new Error('ImgLarger: upload gagal')
  for (let i = 0; i < 18; i++) {
    const st = (await axios.post('https://get1.imglarger.com/api/UpscalerNew/CheckStatusNew', { code, scaleRadio: scale >= 4 ? 4 : 2 }, { headers: { 'Content-Type': 'application/json', ...base }, timeout: 30000 })).data
    if (st?.code === 200 && st.data?.status === 'success') {
      const url = st.data.downloadUrls?.[0]
      if (!url) break
      return Buffer.from((await axios.get(url, { responseType: 'arraybuffer', timeout: 60000, headers: { 'User-Agent': UA } })).data)
    }
    await sleep(4000)
  }
  throw new Error('ImgLarger: tidak selesai')
}

const REMINI = 'https://a.android.api.remini.ai/v1/mobile'
async function remini(buffer) {
  const id = crypto.randomUUID().replace(/-/g, '').slice(0, 16)
  const dev = { android_id: id, aaid: crypto.randomUUID(), backup: id + '_com.bigwinepot.nwdn.international', nonBackup: crypto.randomUUID() }
  const base = (extra) => ({
    'bsp-id': 'com.bigwinepot.nwdn.international.android', 'build-number': '202514479', 'build-version': '3.7.1020', country: 'US',
    'device-manufacturer': 'Samsung', 'device-model': 'SM-G998B', 'device-type': '6.8', language: 'en', locale: 'en_US', 'os-version': '33',
    platform: 'Android', timezone: 'America/New_York', 'android-id': dev.android_id, aaid: dev.aaid, 'user-agent': 'okhttp/4.12.0', ...(extra || {})
  })
  const setup = (await axios.get('https://api.remini.ai/v1/mobile/oracle/setup', {
    timeout: 20000,
    headers: base({
      'first-install-timestamp': Math.floor(Date.now() / 1000) + 'E9', 'backup-persistent-id': dev.backup, 'non-backup-persistent-id': dev.nonBackup,
      environment: 'Production', 'settings-response-version': 'v2', 'is-app-running-in-background': 'false', 'is-old-user': 'true',
      'app-set-id': 'd44bd45a-a45d-4470-9674-7348a8e3fb71'
    })
  })).data
  const token = setup?.settings?.__identity__?.token
  if (!token) throw new Error('Remini: token tidak didapat')
  const auth = (extra) => ({ ...base(extra), 'identity-token': token })

  const md5 = crypto.createHash('md5').update(buffer).digest('base64')
  const info = await imageInfo(buffer).catch(() => ({}))
  const task = (await axios.post(REMINI + '/tasks', {
    image_content_type: 'image/jpeg', image_md5: md5, feature: { type: 'enhance', models: [] },
    metadata: { size: buffer.length, width: info.w, height: info.h }, options: { high_quality_output: false, save_input: true }
  }, { headers: auth({ 'content-type': 'application/json; charset=UTF-8' }), timeout: 30000 })).data
  if (!task?.task_id || !task.upload_url || !task.upload_headers) throw new Error('Remini: task tidak valid')

  await axios.put(task.upload_url, buffer, { headers: { ...task.upload_headers, 'Content-Length': String(buffer.length), 'User-Agent': 'okhttp/4.12.0' }, timeout: 60000, maxBodyLength: Infinity })
  await axios.post(REMINI + '/tasks/' + task.task_id + '/process', null, { headers: auth({ 'content-length': '0' }), timeout: 30000 })
  for (let i = 0; i < 16; i++) {
    await sleep(4000)
    const st = (await axios.get(REMINI + '/tasks/' + task.task_id, { headers: auth(), timeout: 30000 })).data
    if (st?.status === 'completed') {
      const url = st.result?.outputs?.[0]?.url
      if (!url) break
      return Buffer.from((await axios.get(url, { responseType: 'arraybuffer', timeout: 60000 })).data)
    }
    if (st?.status === 'failed' || st?.status === 'error') throw new Error('Remini: task gagal')
  }
  throw new Error('Remini: tidak selesai')
}

// izuka-api & nexadev: endpoint yang sama dengan fitur hd2 / hd3 / hd8 lama (digabung ke sini supaya tidak ada fitur kembar)
async function izukaImglarger(buffer, scale) {
  const form = new FormData()
  form.append('image', buffer, { filename: 'image.jpg', contentType: 'image/jpeg' })
  form.append('type', 'upscale')
  form.append('scale', String(scale >= 4 ? 4 : 2))
  const d = (await axios.post('https://my.izuka-api.xyz/api/tools/imglarger', form, { headers: form.getHeaders(), timeout: 60000, maxBodyLength: Infinity })).data
  if (!d || !d.status || !d.result) throw new Error('izuka-imglarger: respons kosong')
  return Buffer.from((await axios.get(String(d.result), { responseType: 'arraybuffer', timeout: 60000 })).data)
}

async function izukaUnblur(buffer) {
  const form = new FormData()
  form.append('image', buffer, { filename: 'image.jpg', contentType: 'image/jpeg' })
  const d = (await axios.post('https://my.izuka-api.xyz/api/tools/unblur', form, { headers: form.getHeaders(), timeout: 60000, maxBodyLength: Infinity })).data
  const url = d && d.status && d.result && d.result.output_url && d.result.output_url[0]
  if (!url) throw new Error('izuka-unblur: respons kosong')
  return Buffer.from((await axios.get(String(url), { responseType: 'arraybuffer', timeout: 60000 })).data)
}

async function nexadev(buffer, scale) {
  const link = await require('./upload').uploadBuffer(buffer, `hd-${Date.now()}.jpg`)
  if (!/^https?:\/\//.test(link)) throw new Error('nexadev: upload gagal')
  const r = await axios.get(`https://api.nexadev.my.id/api/upscale1?url=${encodeURIComponent(link)}&resolusi=${scale >= 4 ? 4 : 2}`, { responseType: 'arraybuffer', timeout: 60000 })
  return Buffer.from(r.data)
}

// urutan: yang paling sering sukses dulu; semuanya dibatasi waktu
const PROVIDERS = [
  ['iLoveIMG', (b, s) => withTimeout(iloveimg(b, s), 55000, 'iLoveIMG')],
  ['ImgLarger', (b, s) => withTimeout(imglarger(b, s), 65000, 'ImgLarger')],
  ['Izuka', (b, s) => withTimeout(izukaImglarger(b, s), 50000, 'Izuka')],
  ['Nexadev', (b, s) => withTimeout(nexadev(b, s), 50000, 'Nexadev')],
  ['Remini', (b) => withTimeout(remini(b), 75000, 'Remini')],
  ['Izuka-Unblur', (b) => withTimeout(izukaUnblur(b), 50000, 'Izuka-Unblur')]
]

// Hasil online dianggap sah hanya kalau gambarnya valid & lebih besar dari aslinya
async function validUpscale(out, srcInfo) {
  if (!Buffer.isBuffer(out) || out.length < 2000) return null
  try {
    const i = await imageInfo(out)
    if (i.w * i.h < srcInfo.w * srcInfo.h * 1.3) return null
    return i
  } catch { return null }
}

// Utama: { buffer, mime, engine, from:{w,h}, to:{w,h} }
async function enhanceImage(input, { scale = 2, online = true, budgetMs = 170000, log = () => {} } = {}) {
  const src = await prepare(input)
  const srcInfo = await imageInfo(src)
  if (online) {
    const deadline = Date.now() + budgetMs
    for (const [name, fn] of PROVIDERS) {
      if (Date.now() > deadline) { log('[HD] waktu server online habis, pakai mesin lokal'); break }
      try {
        const out = await fn(src, scale)
        const info = await validUpscale(out, srcInfo)
        if (!info) throw new Error('hasil tidak valid / tidak lebih besar')
        // batasi sisi terpanjang & kompres ringan supaya aman dikirim
        const buf = Math.max(info.w, info.h) > MAX_SIDE
          ? await finalize(await sharp()(out).resize(MAX_SIDE, MAX_SIDE, { fit: 'inside', kernel: 'lanczos3' }).toBuffer())
          : (info.format === 'jpeg' ? out : await finalize(out))
        const meta = await imageInfo(buf)
        return { buffer: buf, mime: 'image/jpeg', engine: name, from: { w: srcInfo.w, h: srcInfo.h }, to: { w: meta.w, h: meta.h } }
      } catch (e) {
        log(`[HD] ${name} gagal: ${e.message}`)
      }
    }
  }
  const buf = await localEnhance(src, scale)
  const meta = await imageInfo(buf)
  return { buffer: buf, mime: 'image/jpeg', engine: 'lokal', from: { w: srcInfo.w, h: srcInfo.h }, to: { w: meta.w, h: meta.h } }
}

// ======================================================================= VIDEO
const TARGET_SHORT = { '720p': 720, '1080p': 1080, '2k': 1440, '4k': 2160 }

function run(cmd, args, { timeout = 600000, input } = {}) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { stdio: ['ignore', 'pipe', 'pipe'] })
    let out = ''
    let err = ''
    p.stdout.on('data', (d) => (out += d))
    p.stderr.on('data', (d) => { err = (err + d).slice(-800) })
    const t = setTimeout(() => { p.kill('SIGKILL'); reject(new Error('timeout')) }, timeout)
    p.on('error', (e) => { clearTimeout(t); reject(e.code === 'ENOENT' ? new Error('nff') : e) })
    p.on('close', (c) => { clearTimeout(t); c === 0 ? resolve(out) : reject(new Error(`${cmd} ${c}: ${err.trim().split('\n').slice(-3).join(' | ')}`)) })
  })
}

// Ukuran TAMPIL video (sudah memperhitungkan rotasi HP & pixel tidak persegi)
async function probeVideo(file) {
  const raw = await run('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height,sample_aspect_ratio,duration:stream_side_data=rotation:stream_tags=rotate:format=duration', '-of', 'json', file], { timeout: 30000 })
  const j = JSON.parse(raw || '{}')
  const s = (j.streams || [])[0]
  if (!s || !s.width || !s.height) throw new Error('tidak ada stream video')
  let rot = 0
  const sd = (s.side_data_list || []).find((x) => x.rotation !== undefined)
  if (sd) rot = Math.abs(Number(sd.rotation)) % 180
  else if (s.tags && s.tags.rotate) rot = Math.abs(Number(s.tags.rotate)) % 180
  let w = s.width
  let h = s.height
  const sar = /^(\d+):(\d+)$/.exec(s.sample_aspect_ratio || '')
  if (sar && Number(sar[2]) > 0 && Number(sar[1]) > 0) w = Math.round((w * Number(sar[1])) / Number(sar[2]))
  if (rot === 90) [w, h] = [h, w]
  return { w, h, duration: Number(s.duration || (j.format && j.format.duration)) || 0, ar: w / h }
}

function tmpFile(ext) {
  return path.join(os.tmpdir(), `hdv-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`)
}

// Mesin lokal: ukuran dibesarkan dengan MENJAGA rasio asli (sisi pendek = target, sisi lain mengikuti), tanpa pixel gepeng.
async function localEnhanceVideo(inFile, res = '1080p', info) {
  const target = TARGET_SHORT[res] || 1080
  const iv = info || (await probeVideo(inFile))
  const outW = iv.w <= iv.h ? Math.max(iv.w, target) : null
  const outH = iv.w <= iv.h ? null : Math.max(iv.h, target)
  // bagian yang tidak dikunci dihitung dari rasio tampil asli, dibulatkan genap (wajib untuk yuv420p)
  const W = outW || Math.round((outH * iv.ar) / 2) * 2
  const H = outH || Math.round(outW / iv.ar / 2) * 2
  const out = tmpFile('mp4')
  const vf = [
    'scale=iw*sar:ih:flags=lanczos', // buang pixel tidak persegi (sumber utama video "gepeng")
    `scale=${W}:${H}:flags=lanczos`,
    'setsar=1',
    'hqdn3d=1.5:1.2:5:5',
    'unsharp=5:5:0.9:5:5:0.0',
    'eq=contrast=1.04:saturation=1.1'
  ].join(',')
  const args = ['-y', '-i', inFile, '-map', '0:v:0', '-map', '0:a?', '-vf', vf, '-r', '30',
    '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '20', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart', out]
  try {
    await run('ffmpeg', args, { timeout: 900000 })
    return { file: out, w: W, h: H }
  } catch (e) {
    fs.rmSync(out, { force: true })
    throw e
  }
}

// Hasil online yang rasionya melenceng diluruskan ke rasio asli (tanpa memotong)
async function fixAspect(file, srcInfo) {
  const cur = await probeVideo(file)
  const diff = Math.abs(cur.ar - srcInfo.ar) / srcInfo.ar
  if (diff < 0.02 && cur.w >= srcInfo.w * 0.95) return { file, fixed: false, w: cur.w, h: cur.h }
  if (cur.h < srcInfo.h * 0.95 && cur.w < srcInfo.w * 0.95) throw new Error('resolusi hasil lebih kecil dari asli')
  const H = Math.max(cur.h, srcInfo.h)
  const W = Math.round((H * srcInfo.ar) / 2) * 2
  const out = tmpFile('mp4')
  await run('ffmpeg', ['-y', '-i', file, '-map', '0:v:0', '-map', '0:a?', '-vf', `scale=iw*sar:ih,scale=${W}:${Math.round(H / 2) * 2}:flags=lanczos,setsar=1`,
    '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '20', '-pix_fmt', 'yuv420p', '-c:a', 'copy', '-movflags', '+faststart', out], { timeout: 600000 })
  return { file: out, fixed: true, w: W, h: Math.round(H / 2) * 2 }
}

// input: Buffer video. fetchRemote: async (buffer) => Buffer hasil AI online (opsional). Mengembalikan { buffer, engine, from, to }
async function enhanceVideo(input, { res = '1080p', fetchRemote, maxLocalSeconds = 75, log = () => {} } = {}) {
  const src = tmpFile('mp4')
  const tmps = [src]
  try {
    fs.writeFileSync(src, input)
    const info = await probeVideo(src)

    if (fetchRemote) {
      let rf
      try {
        const remoteBuf = await withTimeout(fetchRemote(input), 20000, 'AI online')
        rf = tmpFile('mp4'); tmps.push(rf)
        fs.writeFileSync(rf, remoteBuf)
        const fx = await fixAspect(rf, info)
        if (fx.file !== rf) tmps.push(fx.file)
        return { buffer: fs.readFileSync(fx.file), engine: fx.fixed ? 'AI online + koreksi rasio' : 'AI online', from: { w: info.w, h: info.h }, to: { w: fx.w, h: fx.h } }
      } catch (e) {
        log(`[HDVID] online gagal/tidak lolos cek: ${e.message}`)
      }
    }

    if (info.duration && info.duration > maxLocalSeconds) throw new Error(`Video ${Math.round(info.duration)} detik terlalu panjang untuk mesin lokal (maks ${maxLocalSeconds} detik).`)
    const r = await localEnhanceVideo(src, res, info)
    tmps.push(r.file)
    return { buffer: fs.readFileSync(r.file), engine: 'lokal', from: { w: info.w, h: info.h }, to: { w: r.w, h: r.h } }
  } finally {
    for (const f of tmps) fs.rmSync(f, { force: true })
  }
}

module.exports = { enhanceImage, localEnhance, enhanceVideo, localEnhanceVideo, probeVideo, imageInfo, TARGET_SHORT }
