// Poster pengumuman 1080x1350 — lokal, tanpa API berbayar.
// @napi-rs/canvas sudah jadi dependency proyek; font diambil dari sistem.
'use strict'
const { createCanvas, GlobalFonts } = require('@napi-rs/canvas')
const fs = require('fs')

const W = 1080
const H = 1350
const GREEN = '#123C2F'
const GREEN_DARK = '#0C2A21'
const CREAM = '#F8F3E4'
const GOLD = '#C9A227'
const INK = '#183128'
const MUTED = '#5C6B60'

const FONT_REG = '/usr/share/fonts/truetype/noto/NotoSans-Regular.ttf'
const FONT_BOLD = '/usr/share/fonts/truetype/noto/NotoSans-Bold.ttf'
let fontsReady = false
function ensureFonts() {
  if (fontsReady) return
  for (const [file, family] of [[FONT_REG, 'PosterSans'], [FONT_BOLD, 'PosterSans']]) {
    if (fs.existsSync(file)) {
      try { GlobalFonts.registerFromPath(file, family) } catch { /* font sistem lain dipakai */ }
    }
  }
  fontsReady = true
}

const DAYS = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
const MONTHS = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']

function formatDate(value) {
  const parts = String(value || '').split('-')
  if (parts.length !== 3) return '-'
  const [y, m, d] = parts.map(Number)
  if (!y || !m || !d) return '-'
  const weekday = new Date(Date.UTC(y, m - 1, d)).getUTCDay()
  return `${DAYS[weekday]}, ${d} ${MONTHS[m - 1] || m} ${y}`
}
function formatTime(value) {
  return String(value || '').replace('.', ':') || '-'
}

function clean(text) {
  return String(text ?? '').replace(/\*([^*]+)\*/g, '$1').replace(/[_`~]/g, '').trim()
}

function roundedRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

function star(ctx, cx, cy, radius, stroke, alpha = 1) {
  ctx.save()
  ctx.globalAlpha = alpha
  ctx.strokeStyle = stroke
  ctx.lineWidth = 2
  for (const angle of [0, Math.PI / 4]) {
    ctx.beginPath()
    for (let i = 0; i < 4; i += 1) {
      const a = angle + i * Math.PI / 2
      const x = cx + Math.cos(a) * radius
      const y = cy + Math.sin(a) * radius
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y)
    }
    ctx.closePath()
    ctx.stroke()
  }
  ctx.beginPath()
  ctx.arc(cx, cy, radius * 0.18, 0, Math.PI * 2)
  ctx.stroke()
  ctx.restore()
}

function wrap(ctx, text, maxWidth, maxLines) {
  const words = clean(text).split(/\s+/).filter(Boolean)
  const lines = []
  let current = ''
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word
    if (ctx.measureText(candidate).width <= maxWidth || !current) {
      current = candidate
    } else {
      lines.push(current)
      current = word
      if (lines.length === maxLines) break
    }
  }
  if (lines.length < maxLines && current) lines.push(current)
  if (lines.length === maxLines && current && lines[lines.length - 1] !== current) {
    let last = lines[lines.length - 1]
    while (last.length > 4 && ctx.measureText(`${last}…`).width > maxWidth) last = last.slice(0, -1)
    lines[lines.length - 1] = `${last}…`
  }
  return lines
}

function bodyLines(ctx, body, maxWidth, maxLines) {
  const out = []
  const truncated = String(body || '').includes('\n') || clean(body).length > 0
  for (const raw of String(body || '').split(/\r?\n/)) {
    if (out.length >= maxLines) break
    if (!raw.trim()) { out.push(''); continue }
    out.push(...wrap(ctx, raw, maxWidth, maxLines - out.length))
  }
  return { lines: out, truncated }
}

/**
 * @param {{title:string, body:string, eventDate:string, eventTime?:string, weekday?:number}} info
 * @returns {Buffer} PNG
 */
function renderPoster(info) {
  ensureFonts()
  const canvas = createCanvas(W, H)
  const ctx = canvas.getContext('2d')

  ctx.fillStyle = CREAM
  ctx.fillRect(0, 0, W, H)

  // Header hijau tua + ornamen geometris secukupnya.
  ctx.fillStyle = GREEN
  ctx.fillRect(0, 0, W, 286)
  ctx.fillStyle = GREEN_DARK
  ctx.fillRect(0, 250, W, 36)
  for (const [x, y, r, a] of [[80, 70, 52, 0.28], [1000, 70, 52, 0.28], [930, 220, 34, 0.18], [150, 220, 34, 0.18]]) {
    star(ctx, x, y, r, GOLD, a)
  }
  ctx.fillStyle = GOLD
  ctx.fillRect(72, 112, 936, 3)

  ctx.textAlign = 'center'
  ctx.fillStyle = GOLD
  ctx.font = '600 24px PosterSans, Noto Sans, sans-serif'
  ctx.fillText('PENGUMUMAN KEGIATAN', W / 2, 78)
  ctx.fillStyle = '#FFFFFF'
  ctx.font = '600 30px PosterSans, Noto Sans, sans-serif'
  ctx.fillText('Assalamu’alaikum warahmatullahi wabarakatuh', W / 2, 168)
  ctx.fillStyle = '#D9E6D8'
  ctx.font = '22px PosterSans, Noto Sans, sans-serif'
  ctx.fillText('Disusun oleh Asisten Sekretaris Digital', W / 2, 214)

  // Judul
  ctx.textAlign = 'left'
  ctx.fillStyle = INK
  ctx.font = '700 54px PosterSans, Noto Sans, sans-serif'
  const titleLines = wrap(ctx, info.title || 'Pengumuman', 920, 3)
  let y = 366
  for (const line of titleLines) {
    ctx.fillText(line, 80, y)
    y += 66
  }
  y += 14

  // Kartu tanggal & jam
  const cardY = y
  roundedRect(ctx, 80, cardY, 920, 152, 22)
  ctx.fillStyle = GREEN
  ctx.fill()
  ctx.strokeStyle = GOLD
  ctx.lineWidth = 2
  ctx.stroke()
  ctx.textAlign = 'center'
  ctx.fillStyle = '#FFFFFF'
  ctx.font = '700 38px PosterSans, Noto Sans, sans-serif'
  ctx.fillText(formatDate(info.eventDate), W / 2, cardY + 64)
  ctx.fillStyle = GOLD
  ctx.font = '600 28px PosterSans, Noto Sans, sans-serif'
  ctx.fillText(`Pukul ${formatTime(info.eventTime)} WIB`, W / 2, cardY + 114)

  // Isi
  ctx.textAlign = 'left'
  ctx.fillStyle = GREEN
  ctx.font = '700 26px PosterSans, Noto Sans, sans-serif'
  ctx.fillText('RINCIAN KEGIATAN', 80, cardY + 216)
  ctx.fillStyle = GOLD
  ctx.fillRect(80, cardY + 234, 150, 4)

  const bodyStart = cardY + 296
  ctx.fillStyle = INK
  ctx.font = '32px PosterSans, Noto Sans, sans-serif'
  const maxBodyY = H - 170
  const maxLines = Math.max(1, Math.floor((maxBodyY - bodyStart) / 50))
  const parsed = bodyLines(ctx, info.body || '-', 920, maxLines)
  let by = bodyStart
  for (const line of parsed.lines) {
    ctx.fillText(line, 80, by)
    by += 50
  }
  if (parsed.lines.length === maxLines && String(info.body || '').length > 160) {
    ctx.fillStyle = MUTED
    ctx.font = 'italic 24px PosterSans, Noto Sans, sans-serif'
    ctx.fillText('Selengkapnya dibaca pada pesan teks.', 80, Math.min(by + 6, maxBodyY))
  }

  // Footer
  ctx.fillStyle = GREEN
  ctx.fillRect(0, H - 96, W, 96)
  ctx.fillStyle = GOLD
  ctx.fillRect(80, H - 70, 2, 44)
  ctx.fillStyle = '#FFFFFF'
  ctx.font = '24px PosterSans, Noto Sans, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('Terima kasih atas perhatian dan kehadirannya.', 104, H - 50)
  ctx.textAlign = 'right'
  ctx.fillStyle = '#BFD4C2'
  ctx.font = '20px PosterSans, Noto Sans, sans-serif'
  ctx.fillText('Mohon disebarkan.', 1000, H - 50)

  return Buffer.from(canvas.toBuffer('image/png'))
}

module.exports = { renderPoster, formatDate, formatTime, W, H }
