'use strict'

const fs = require('fs')
const os = require('os')
const path = require('path')
const { spawn, spawnSync } = require('child_process')

const ALLOWED_HOSTS = {
  youtube: new Set([
    'youtube.com', 'www.youtube.com', 'm.youtube.com', 'music.youtube.com',
    'youtu.be', 'www.youtu.be', 'youtube-nocookie.com', 'www.youtube-nocookie.com'
  ]),
  tiktok: new Set([
    'tiktok.com', 'www.tiktok.com', 'm.tiktok.com', 'vm.tiktok.com', 'vt.tiktok.com'
  ])
}
const MAX_FILE_BYTES = 25 * 1024 * 1024
const MAX_DURATION_SECONDS = 15 * 60
const PROCESS_TIMEOUT_MS = 4 * 60 * 1000
const MAX_CONCURRENT_DOWNLOADS = 2
let activeDownloads = 0

function extractUrl(input) {
  const match = String(input || '').match(/https?:\/\/[^\s<>]+/i)
  return match ? match[0].replace(/[),.!?]+$/, '') : null
}

function validateUrl(value) {
  let url
  try {
    if (typeof value !== 'string' || value.length > 2048) throw new Error()
    url = new URL(value)
  } catch {
    throw new Error('Link tidak valid. Kirim URL YouTube atau TikTok yang lengkap.')
  }

  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.port) {
    throw new Error('Link tidak valid. Gunakan URL YouTube atau TikTok publik tanpa kredensial.')
  }

  const hostname = url.hostname.toLowerCase()
  for (const [platform, hosts] of Object.entries(ALLOWED_HOSTS)) {
    if (hosts.has(hostname)) return { url: url.toString(), platform }
  }
  throw new Error('Link tidak valid. Domain yang didukung hanya YouTube dan TikTok.')
}

function parseMetadata(output, platform) {
  const line = String(output || '').split(/\r?\n/).find((item) => item.includes('\t'))
  const [title, creator, duration, thumbnail] = line ? line.split('\t') : []
  const seconds = Number(duration)
  return {
    title: String(title || 'Audio').replace(/[\r\n]/g, ' ').trim().slice(0, 180) || 'Audio',
    creator: String(creator || (platform === 'youtube' ? 'YouTube' : 'TikTok')).replace(/[\r\n]/g, ' ').trim().slice(0, 100),
    duration: Number.isFinite(seconds) && seconds > 0 ? seconds : null,
    thumbnail: thumbnail || null
  }
}

function safeFilename(title) {
  const clean = String(title || 'audio')
    .replace(/[\\/:*?"<>|\u0000-\u001f]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 100)
  return `${clean || 'audio'}.mp3`
}

function runProcess(bin, args) {
  return new Promise((resolve, reject) => {
    let stdout = ''
    let stderr = ''
    let timedOut = false
    let settled = false
    const child = spawn(bin.cmd, [...bin.pre, ...args], { stdio: ['ignore', 'pipe', 'pipe'] })
    const timer = setTimeout(() => {
      timedOut = true
      child.kill('SIGKILL')
    }, PROCESS_TIMEOUT_MS)

    const fail = (error) => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      reject(error)
    }

    child.stdout.on('data', (data) => { stdout = (stdout + data).slice(-16000) })
    child.stderr.on('data', (data) => { stderr = (stderr + data).slice(-12000) })
    child.once('error', fail)
    child.once('close', (code) => {
      if (timedOut) return fail(Object.assign(new Error('timeout'), { code: 'TIMEOUT', stderr }))
      if (code !== 0) return fail(Object.assign(new Error(`yt-dlp exited with code ${code}`), { code, stderr, stdout }))
      if (settled) return
      settled = true
      clearTimeout(timer)
      resolve({ stdout, stderr })
    })
  })
}

function explainError(error) {
  const details = `${error?.stderr || ''}\n${error?.stdout || ''}\n${error?.message || ''}`
  if (error?.code === 'TIMEOUT') return 'Proses terlalu lama. Coba lagi atau gunakan video yang lebih pendek.'
  if (/max-filesize|file is larger|file size/i.test(details)) return 'Ukuran audio melebihi batas 25 MB.'
  if (/duration|does not pass filter/i.test(details)) return 'Durasi video melebihi batas 15 menit.'
  if (/unsupported url/i.test(details)) return 'Format tautan ini tidak didukung.'
  if (/private video|video unavailable|has been removed|not available|members.only|login required|sign in to confirm|age.restricted/i.test(details)) {
    return 'Video tidak tersedia atau dibatasi. Downloader tidak menggunakan login/cookies untuk membuka konten terbatas.'
  }
  if (/ffmpeg|ffprobe/i.test(details) && /not found|not installed|postprocess/i.test(details)) return 'FFmpeg belum terpasang atau tidak dapat digunakan di server.'
  if (error?.code === 'ENOENT') return 'yt-dlp tidak tersedia. Periksa instalasi bot dan akses unduhan binary resminya.'
  if (/yt-dlp belum terpasang|Pemasangan otomatis gagal|Pasang manual/i.test(error?.message || '')) return error.message
  return 'Terjadi kesalahan saat memproses audio. Pastikan videonya publik dan coba lagi nanti.'
}

function removeTempDir(dir) {
  if (dir) {
    try { fs.rmSync(dir, { recursive: true, force: true }) } catch (error) {
      console.error('[PUBLIC-AUDIO] gagal menghapus folder sementara:', error.message)
    }
  }
}

async function downloadAudio(value) {
  const target = validateUrl(value)
  if (activeDownloads >= MAX_CONCURRENT_DOWNLOADS) {
    throw new Error('Downloader sedang sibuk. Coba lagi beberapa saat.')
  }
  activeDownloads++

  let tempDir
  try {
    const ffpath = require('./ffpath')
    ffpath.install()
    const ffmpeg = require('./ffm').resolveBin('ffmpeg')
    if (spawnSync(ffmpeg, ['-version'], { stdio: 'ignore', timeout: 10000 }).status !== 0) {
      throw new Error('FFmpeg belum terpasang atau tidak dapat digunakan di server.')
    }

    const ytdlp = require('./ytdlp')
    const bin = await ytdlp.ensure()
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'wa-audio-'))
    const output = path.join(tempDir, 'audio.%(ext)s')
    const jsRuntime = Number(process.versions.node.split('.')[0]) >= 22
      ? ['--js-runtimes', `node:${process.execPath}`]
      : []
    const args = [
      ...jsRuntime,
      '--ignore-config', '--no-playlist', '--no-warnings', '--no-mtime', '--no-cache-dir',
      '--socket-timeout', '15', '--retries', '1',
      '--max-filesize', `${Math.ceil(MAX_FILE_BYTES / (1024 * 1024))}M`,
      '--match-filter', `duration<=?${MAX_DURATION_SECONDS}`,
      '--print', 'before_dl:%(title)s\t%(uploader)s\t%(duration)s\t%(thumbnail)s',
      '--format', 'bestaudio/best',
      '--extract-audio', '--audio-format', 'mp3', '--audio-quality', '128K',
      '--output', output, '--', target.url
    ]

    const result = await runProcess(bin, args)
    const file = fs.readdirSync(tempDir)
      .filter((name) => name.toLowerCase().endsWith('.mp3'))
      .map((name) => path.join(tempDir, name))[0]
    if (!file || !fs.existsSync(file)) throw new Error('Audio MP3 tidak dihasilkan.')

    const size = fs.statSync(file).size
    if (size <= 0) throw new Error('Audio MP3 yang dihasilkan kosong.')
    if (size > MAX_FILE_BYTES) throw new Error('Ukuran audio melebihi batas 25 MB.')

    const metadata = parseMetadata(result.stdout, target.platform)
    return {
      platform: target.platform,
      metadata,
      file,
      filename: safeFilename(metadata.title),
      cleanup: () => removeTempDir(tempDir)
    }
  } catch (error) {
    removeTempDir(tempDir)
    if (/^(Link tidak valid|Downloader sedang sibuk|FFmpeg belum|Audio MP3|Ukuran audio)/.test(error.message)) throw error
    throw new Error(explainError(error))
  } finally {
    activeDownloads--
  }
}

module.exports = {
  ALLOWED_HOSTS,
  MAX_FILE_BYTES,
  MAX_DURATION_SECONDS,
  extractUrl,
  validateUrl,
  parseMetadata,
  safeFilename,
  explainError,
  downloadAudio
}
