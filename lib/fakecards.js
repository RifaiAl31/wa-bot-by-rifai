// lib/fakecards.js — generator gambar canvas LOKAL (tanpa API luar, tanpa template GitHub/imgur, tanpa font yang hilang).
// Dipakai: .fake-tweet .facepalm .fakedj .ektp .fakeatm .fakekartupelajar .fakedana .fakegopay
//
// Semua kartu/layar keuangan/identitas SENGAJA bergaya fiktif: merek buatan ("VanBank", "VanPay"), angka nol,
// dan watermark diagonal "CONTOH • FIKTIF". Jadi aman dipakai untuk hiburan/konten dan tidak bisa dipakai
// sebagai bukti palsu (bukan tiruan e-KTP/DANA/GoPay/bank asli).
'use strict'

const path = require('path')
const fs = require('fs')

const FONT_DIR = path.join(__dirname, 'ext', 'font')
let fontsReady = false
let F_BOLD = 'sans-serif'
let F_SEMI = 'sans-serif'
let F_MONO = 'monospace'

function canvasLib() { return require('@napi-rs/canvas') }

function ensureFonts() {
  if (fontsReady) return
  const { GlobalFonts } = canvasLib()
  const reg = (file, fam) => {
    try {
      const p = path.join(FONT_DIR, file)
      if (fs.existsSync(p) && GlobalFonts.registerFromPath(p, fam)) return fam
    } catch {}
    return null
  }
  F_BOLD = reg('Inter-Bold.otf', 'VXBold') || F_BOLD
  F_SEMI = reg('Inter-SemiBold.otf', 'VXSemi') || F_SEMI
  fontsReady = true
}

// ------------------------------------------------------------------ util
function rr(ctx, x, y, w, h, r) {
  const k = Math.min(r, w / 2, h / 2)
  ctx.beginPath()
  ctx.moveTo(x + k, y)
  ctx.arcTo(x + w, y, x + w, y + h, k)
  ctx.arcTo(x + w, y + h, x, y + h, k)
  ctx.arcTo(x, y + h, x, y, k)
  ctx.arcTo(x, y, x + w, y, k)
  ctx.closePath()
}

function wrap(ctx, text, maxW) {
  const out = []
  for (const para of String(text).split(/\r?\n/)) {
    let line = ''
    for (const word of para.split(/\s+/).filter(Boolean)) {
      // kata sangat panjang dipecah per huruf
      let w = word
      while (ctx.measureText(w).width > maxW && w.length > 1) {
        let i = w.length - 1
        while (i > 1 && ctx.measureText(w.slice(0, i)).width > maxW) i--
        if (line) { out.push(line); line = '' }
        out.push(w.slice(0, i))
        w = w.slice(i)
      }
      const t = line ? `${line} ${w}` : w
      if (line && ctx.measureText(t).width > maxW) { out.push(line); line = w } else line = t
    }
    out.push(line)
  }
  return out
}

async function safeImage(buf) {
  if (!buf) return null
  try { return await canvasLib().loadImage(buf) } catch { return null }
}

function coverDraw(ctx, img, x, y, w, h) {
  const s = Math.max(w / img.width, h / img.height)
  const sw = w / s, sh = h / s
  ctx.drawImage(img, (img.width - sw) / 2, (img.height - sh) / 2, sw, sh, x, y, w, h)
}

function avatarFallback(ctx, cx, cy, r, name) {
  const hue = [...String(name || 'x')].reduce((a, c) => a + c.charCodeAt(0), 0) % 360
  ctx.fillStyle = `hsl(${hue},55%,45%)`
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill()
  ctx.fillStyle = '#fff'
  ctx.font = `${Math.round(r * 1.0)}px ${F_BOLD}`
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
  ctx.fillText(String(name || '?').trim().charAt(0).toUpperCase() || '?', cx, cy + 2)
  ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic'
}

function watermark(ctx, W, H, text = 'CONTOH • FIKTIF • HIBURAN') {
  ctx.save()
  ctx.globalAlpha = 0.13
  ctx.fillStyle = '#d00000'
  ctx.font = `${Math.round(Math.min(W, H) / 11)}px ${F_BOLD}`
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
  ctx.translate(W / 2, H / 2)
  ctx.rotate(-Math.PI / 7)
  const step = Math.min(W, H) / 4
  for (let dy = -H; dy <= H; dy += step) ctx.fillText(text, 0, dy)
  ctx.restore()
}

const idr = (n) => Number(String(n).replace(/[^0-9]/g, '') || 0).toLocaleString('id-ID')
const clip = (s, n) => (String(s).length > n ? String(s).slice(0, n - 1) + '…' : String(s))

// ------------------------------------------------------------------ FAKE TWEET
async function tweet({ name, username, text, avatar, likes = '0', retweets = '0', theme = 'dim', verified = true }) {
  ensureFonts()
  const { createCanvas } = canvasLib()
  const themes = {
    dim: { bg: '#15202b', fg: '#ffffff', sub: '#8b98a5', line: '#38444d' },
    dark: { bg: '#000000', fg: '#e7e9ea', sub: '#71767b', line: '#2f3336' },
    light: { bg: '#ffffff', fg: '#0f1419', sub: '#536471', line: '#eff3f4' }
  }
  const T = themes[theme] || themes.dim
  const W = 1080, P = 56
  const probe = createCanvas(10, 10).getContext('2d')
  probe.font = `44px ${F_SEMI}`
  const lines = wrap(probe, text, W - P * 2)
  const lh = 62
  const H = P + 112 + 28 + lines.length * lh + 36 + 56 + 24 + 64 + 48 + 40
  const canvas = createCanvas(W, H)
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = T.bg; ctx.fillRect(0, 0, W, H)

  // avatar
  const img = await safeImage(avatar)
  const ar = 56, ax = P + ar, ay = P + ar
  if (img) {
    ctx.save(); ctx.beginPath(); ctx.arc(ax, ay, ar, 0, Math.PI * 2); ctx.clip()
    coverDraw(ctx, img, ax - ar, ay - ar, ar * 2, ar * 2); ctx.restore()
  } else avatarFallback(ctx, ax, ay, ar, name)

  // nama + username
  ctx.textBaseline = 'alphabetic'
  ctx.fillStyle = T.fg; ctx.font = `38px ${F_BOLD}`
  const nm = clip(name, 26)
  ctx.fillText(nm, P + ar * 2 + 24, P + 44)
  const nmW = ctx.measureText(nm).width
  if (verified) {
    const bx = P + ar * 2 + 24 + nmW + 22, by = P + 31
    ctx.fillStyle = '#1d9bf0'; ctx.beginPath(); ctx.arc(bx, by, 16, 0, Math.PI * 2); ctx.fill()
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.lineJoin = 'round'
    ctx.beginPath(); ctx.moveTo(bx - 7, by + 1); ctx.lineTo(bx - 2, by + 7); ctx.lineTo(bx + 8, by - 6); ctx.stroke()
  }
  ctx.fillStyle = T.sub; ctx.font = `32px ${F_SEMI}`
  ctx.fillText('@' + clip(String(username).replace(/^@/, ''), 28), P + ar * 2 + 24, P + 88)

  // isi
  let y = P + 112 + 28 + 44
  ctx.fillStyle = T.fg; ctx.font = `44px ${F_SEMI}`
  for (const l of lines) { ctx.fillText(l, P, y); y += lh }

  // waktu
  y += 8
  const now = new Date()
  const jam = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace('.', ':')
  const tgl = now.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
  ctx.fillStyle = T.sub; ctx.font = `30px ${F_SEMI}`
  ctx.fillText(`${jam} · ${tgl} · Twitter for iPhone`, P, y)
  y += 28
  ctx.fillStyle = T.line; ctx.fillRect(P, y, W - P * 2, 2)
  y += 56
  ctx.font = `34px ${F_BOLD}`; ctx.fillStyle = T.fg
  const rt = String(retweets), lk = String(likes)
  ctx.fillText(rt, P, y); let xx = P + ctx.measureText(rt).width + 10
  ctx.font = `34px ${F_SEMI}`; ctx.fillStyle = T.sub; ctx.fillText('Retweets', xx, y); xx += ctx.measureText('Retweets').width + 40
  ctx.font = `34px ${F_BOLD}`; ctx.fillStyle = T.fg; ctx.fillText(lk, xx, y); xx += ctx.measureText(lk).width + 10
  ctx.font = `34px ${F_SEMI}`; ctx.fillStyle = T.sub; ctx.fillText('Suka', xx, y)

  ctx.font = `22px ${F_SEMI}`; ctx.fillStyle = T.sub
  ctx.fillText('gambar hiburan buatan WhatsApp Bot — bukan tweet asli', P, H - 28)
  return canvas.encode('png')
}

// ------------------------------------------------------------------ FACEPALM
function drawHand(ctx, cx, cy, s) {
  // telapak + 4 jari + jempol, warna kulit; (cx,cy) = pusat telapak; s = skala
  const skin = '#e8b48a', shade = '#c98f66', line = '#a8704b'
  ctx.save()
  ctx.translate(cx, cy); ctx.scale(s, s)
  ctx.lineJoin = 'round'; ctx.lineCap = 'round'
  const finger = (x, y, w, h, rot) => {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot)
    rr(ctx, -w / 2, -h, w, h, w / 2)
    ctx.fillStyle = skin; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = line; ctx.stroke()
    ctx.restore()
  }
  finger(-62, -78, 34, 120, -0.22)
  finger(-22, -92, 36, 138, -0.07)
  finger(20, -90, 36, 134, 0.07)
  finger(60, -72, 33, 112, 0.22)
  // telapak
  ctx.beginPath()
  ctx.moveTo(-82, -70); ctx.quadraticCurveTo(-96, 30, -54, 92); ctx.quadraticCurveTo(0, 126, 56, 92)
  ctx.quadraticCurveTo(96, 30, 80, -64); ctx.closePath()
  ctx.fillStyle = skin; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = line; ctx.stroke()
  // jempol
  ctx.save(); ctx.translate(-84, 24); ctx.rotate(-0.9)
  rr(ctx, -20, -70, 40, 96, 20); ctx.fillStyle = skin; ctx.fill(); ctx.stroke(); ctx.restore()
  // garis telapak
  ctx.strokeStyle = shade; ctx.lineWidth = 3
  ctx.beginPath(); ctx.moveTo(-40, 20); ctx.quadraticCurveTo(0, 46, 40, 14); ctx.stroke()
  ctx.restore()
}

async function facepalm(photo) {
  ensureFonts()
  const { createCanvas } = canvasLib()
  const W = 900, H = 900
  const canvas = createCanvas(W, H)
  const ctx = canvas.getContext('2d')
  const g = ctx.createLinearGradient(0, 0, 0, H)
  g.addColorStop(0, '#2b2f3a'); g.addColorStop(1, '#14161c')
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H)
  const img = await safeImage(photo)
  if (!img) throw new Error('Foto tidak bisa dibaca')
  const S = 640, x0 = (W - S) / 2, y0 = 120
  ctx.save(); rr(ctx, x0, y0, S, S, 36); ctx.clip(); coverDraw(ctx, img, x0, y0, S, S); ctx.restore()
  // bayangan tangan + tangan menutupi wajah (bagian tengah-bawah foto)
  ctx.save(); ctx.globalAlpha = 0.35; ctx.fillStyle = '#000'
  ctx.beginPath(); ctx.ellipse(W / 2 + 14, y0 + S * 0.55 + 22, 210, 230, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore()
  drawHand(ctx, W / 2, y0 + S * 0.6, 1.9)
  ctx.fillStyle = '#ffffff'; ctx.font = `64px ${F_BOLD}`; ctx.textAlign = 'center'
  ctx.fillText('FACEPALM', W / 2, 90)
  ctx.textAlign = 'left'
  return canvas.encode('png')
}

// ------------------------------------------------------------------ FAKE DJ (booth)
async function fakedj(text) {
  ensureFonts()
  const { createCanvas } = canvasLib()
  const W = 1280, H = 720
  const canvas = createCanvas(W, H)
  const ctx = canvas.getContext('2d')
  const bg = ctx.createLinearGradient(0, 0, W, H)
  bg.addColorStop(0, '#12002b'); bg.addColorStop(0.5, '#3a0a6e'); bg.addColorStop(1, '#00334e')
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H)
  // lampu
  for (let i = 0; i < 7; i++) {
    const x = 90 + i * 183
    const lg = ctx.createLinearGradient(x, 0, x + (i % 2 ? 110 : -110), H * 0.8)
    lg.addColorStop(0, `hsla(${(i * 55 + 280) % 360},100%,65%,0.5)`); lg.addColorStop(1, 'hsla(0,0%,0%,0)')
    ctx.fillStyle = lg
    ctx.beginPath(); ctx.moveTo(x - 8, 0); ctx.lineTo(x + 8, 0); ctx.lineTo(x + (i % 2 ? 190 : -190), H * 0.8); ctx.lineTo(x + (i % 2 ? 40 : -40), H * 0.8); ctx.closePath(); ctx.fill()
  }
  // layar teks
  const sx = 170, sy = 70, sw = W - 340, sh = 260
  rr(ctx, sx, sy, sw, sh, 26); ctx.fillStyle = '#05010f'; ctx.fill()
  ctx.lineWidth = 6; ctx.strokeStyle = '#ff2bd6'; ctx.shadowColor = '#ff2bd6'; ctx.shadowBlur = 24; ctx.stroke(); ctx.shadowBlur = 0
  ctx.fillStyle = '#7df9ff'; ctx.font = `30px ${F_SEMI}`; ctx.textAlign = 'center'
  ctx.fillText('NOW PLAYING', W / 2, sy + 52)
  let fs = 84
  const probe = ctx
  let lines
  for (; fs >= 34; fs -= 6) {
    probe.font = `${fs}px ${F_BOLD}`
    lines = wrap(probe, text, sw - 80)
    if (lines.length * fs * 1.15 <= sh - 100) break
  }
  ctx.fillStyle = '#ffffff'; ctx.shadowColor = '#7df9ff'; ctx.shadowBlur = 14
  const total = lines.length * fs * 1.15
  let y = sy + 70 + (sh - 100 - total) / 2 + fs
  for (const l of lines.slice(0, 4)) { ctx.fillText(l, W / 2, y); y += fs * 1.15 }
  ctx.shadowBlur = 0
  // meja + dua turntable
  const ty = 430
  rr(ctx, 90, ty, W - 180, 230, 22); ctx.fillStyle = '#0b0b12'; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = '#2a2a3d'; ctx.stroke()
  for (const cx of [330, W - 330]) {
    ctx.beginPath(); ctx.arc(cx, ty + 115, 92, 0, Math.PI * 2); ctx.fillStyle = '#16161f'; ctx.fill()
    for (let r = 84; r > 30; r -= 9) { ctx.beginPath(); ctx.arc(cx, ty + 115, r, 0, Math.PI * 2); ctx.strokeStyle = '#242436'; ctx.lineWidth = 2; ctx.stroke() }
    ctx.beginPath(); ctx.arc(cx, ty + 115, 26, 0, Math.PI * 2); ctx.fillStyle = '#ff2bd6'; ctx.fill()
  }
  // mixer
  rr(ctx, W / 2 - 110, ty + 28, 220, 174, 14); ctx.fillStyle = '#1b1b28'; ctx.fill()
  for (let i = 0; i < 4; i++) {
    const fx = W / 2 - 78 + i * 52
    ctx.fillStyle = '#05050a'; ctx.fillRect(fx, ty + 50, 8, 120)
    ctx.fillStyle = ['#7df9ff', '#ff2bd6', '#ffe44d', '#7dff9a'][i]; rr(ctx, fx - 9, ty + 70 + (i * 23) % 60, 26, 16, 4); ctx.fill()
  }
  ctx.fillStyle = 'rgba(255,255,255,.55)'; ctx.font = `22px ${F_SEMI}`
  ctx.fillText('WhatsApp Bot • DJ Set', W / 2, H - 28)
  ctx.textAlign = 'left'
  return canvas.encode('png')
}

// ------------------------------------------------------------------ KARTU IDENTITAS FIKTIF (pengganti e-KTP)
async function idCard({ nik, nama, ttl, photo }) {
  ensureFonts()
  const { createCanvas } = canvasLib()
  const W = 1011, H = 638
  const canvas = createCanvas(W, H)
  const ctx = canvas.getContext('2d')
  const g = ctx.createLinearGradient(0, 0, W, H)
  g.addColorStop(0, '#d8ecff'); g.addColorStop(1, '#f1e6ff')
  rr(ctx, 0, 0, W, H, 34); ctx.fillStyle = g; ctx.fill()
  rr(ctx, 0, 0, W, 92, 34); ctx.fillStyle = '#1e3a8a'; ctx.fill(); ctx.fillRect(0, 60, W, 32)
  ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.font = `34px ${F_BOLD}`
  ctx.fillText('KARTU IDENTITAS FIKTIF', W / 2, 46)
  ctx.font = `20px ${F_SEMI}`; ctx.fillText('contoh hiburan — bukan dokumen resmi', W / 2, 76)
  ctx.textAlign = 'left'
  const rows = [
    ['NIK', clip(nik, 20)],
    ['Nama', clip(String(nama).toUpperCase(), 28)],
    ['Lahir', clip(String(ttl).toUpperCase(), 28)],
    ['Alamat', 'JL. CONTOH NO. 0'],
    ['Pekerjaan', 'PENGGUNA VANXONE'],
    ['Berlaku', 'SELAMANYA (FIKTIF)']
  ]
  let y = 168
  for (const [k, v] of rows) {
    ctx.fillStyle = '#475569'; ctx.font = `24px ${F_SEMI}`; ctx.fillText(k, 48, y)
    ctx.fillStyle = '#0f172a'; ctx.font = `29px ${F_BOLD}`; ctx.fillText(': ' + v, 230, y)
    y += 66
  }
  const px = 740, py = 130, pw = 230, ph = 300
  rr(ctx, px, py, pw, ph, 16); ctx.fillStyle = '#e2e8f0'; ctx.fill()
  const img = await safeImage(photo)
  if (img) { ctx.save(); rr(ctx, px, py, pw, ph, 16); ctx.clip(); coverDraw(ctx, img, px, py, pw, ph); ctx.restore() }
  ctx.lineWidth = 4; ctx.strokeStyle = '#1e3a8a'; rr(ctx, px, py, pw, ph, 16); ctx.stroke()
  ctx.fillStyle = '#1e3a8a'; ctx.font = `22px ${F_BOLD}`; ctx.textAlign = 'center'
  ctx.fillText('WhatsApp Bot', px + pw / 2, py + ph + 40)
  ctx.textAlign = 'left'
  watermark(ctx, W, H)
  return canvas.encode('png')
}

// ------------------------------------------------------------------ KARTU ATM FIKTIF
async function atmCard({ nama, note }) {
  ensureFonts()
  const { createCanvas } = canvasLib()
  const W = 1011, H = 638
  const canvas = createCanvas(W, H)
  const ctx = canvas.getContext('2d')
  const g = ctx.createLinearGradient(0, 0, W, H)
  g.addColorStop(0, '#0f2027'); g.addColorStop(0.5, '#203a43'); g.addColorStop(1, '#2c5364')
  rr(ctx, 0, 0, W, H, 40); ctx.fillStyle = g; ctx.fill()
  ctx.fillStyle = '#ffffff'; ctx.font = `54px ${F_BOLD}`; ctx.fillText('VANBANK', 56, 100)
  ctx.font = `22px ${F_SEMI}`; ctx.fillStyle = 'rgba(255,255,255,.7)'; ctx.fillText('KARTU CONTOH', 58, 132)
  // chip
  rr(ctx, 56, 190, 120, 92, 14); ctx.fillStyle = '#e6c15a'; ctx.fill()
  ctx.strokeStyle = 'rgba(0,0,0,.35)'; ctx.lineWidth = 2
  ctx.beginPath(); ctx.moveTo(56, 236); ctx.lineTo(176, 236); ctx.moveTo(116, 190); ctx.lineTo(116, 282); ctx.stroke()
  ctx.fillStyle = '#fff'; ctx.font = `64px ${F_BOLD}`
  ctx.fillText('0000  0000  0000  0000', 56, 400)
  ctx.font = `24px ${F_SEMI}`; ctx.fillStyle = 'rgba(255,255,255,.7)'; ctx.fillText('BERLAKU S/D', 56, 462)
  ctx.fillStyle = '#fff'; ctx.font = `34px ${F_BOLD}`; ctx.fillText('00/00', 56, 506)
  ctx.font = `42px ${F_BOLD}`; ctx.fillText(clip(String(nama).toUpperCase(), 24), 56, 584)
  ctx.textAlign = 'right'; ctx.font = `28px ${F_SEMI}`; ctx.fillStyle = 'rgba(255,255,255,.85)'
  if (note) ctx.fillText(clip(note, 22), W - 56, 584)
  ctx.textAlign = 'left'
  // logo bulat ganda
  ctx.globalAlpha = 0.85
  ctx.fillStyle = '#ff5f6d'; ctx.beginPath(); ctx.arc(W - 150, 110, 52, 0, Math.PI * 2); ctx.fill()
  ctx.fillStyle = '#ffc371'; ctx.beginPath(); ctx.arc(W - 98, 110, 52, 0, Math.PI * 2); ctx.fill()
  ctx.globalAlpha = 1
  watermark(ctx, W, H)
  return canvas.encode('png')
}

// ------------------------------------------------------------------ KARTU PELAJAR FIKTIF
async function studentCard({ nama, sekolah, photo }) {
  ensureFonts()
  const { createCanvas } = canvasLib()
  const W = 1011, H = 638
  const canvas = createCanvas(W, H)
  const ctx = canvas.getContext('2d')
  rr(ctx, 0, 0, W, H, 34); ctx.fillStyle = '#fffdf2'; ctx.fill()
  rr(ctx, 0, 0, W, 150, 34); ctx.fillStyle = '#b91c1c'; ctx.fill(); ctx.fillRect(0, 110, W, 40)
  ctx.fillStyle = '#fff'; ctx.textAlign = 'center'
  ctx.font = `40px ${F_BOLD}`; ctx.fillText('KARTU PELAJAR (CONTOH)', W / 2, 66)
  ctx.font = `28px ${F_SEMI}`; ctx.fillText(clip(String(sekolah).toUpperCase(), 40), W / 2, 112)
  ctx.textAlign = 'left'
  const px = 56, py = 200, pw = 200, ph = 260
  rr(ctx, px, py, pw, ph, 14); ctx.fillStyle = '#e5e7eb'; ctx.fill()
  const img = await safeImage(photo)
  if (img) { ctx.save(); rr(ctx, px, py, pw, ph, 14); ctx.clip(); coverDraw(ctx, img, px, py, pw, ph); ctx.restore() }
  else avatarFallback(ctx, px + pw / 2, py + ph / 2, 70, nama)
  const rows = [['Nama', clip(String(nama).toUpperCase(), 26)], ['NISN', '0000000000'], ['Kelas', 'X - CONTOH'], ['Berlaku', 'FIKTIF']]
  let y = 250
  for (const [k, v] of rows) {
    ctx.fillStyle = '#6b7280'; ctx.font = `26px ${F_SEMI}`; ctx.fillText(k, 310, y)
    ctx.fillStyle = '#111827'; ctx.font = `32px ${F_BOLD}`; ctx.fillText(': ' + v, 460, y)
    y += 70
  }
  ctx.fillStyle = '#6b7280'; ctx.font = `22px ${F_SEMI}`; ctx.fillText('dibuat dengan WhatsApp Bot untuk hiburan', 56, 600)
  watermark(ctx, W, H)
  return canvas.encode('png')
}

// ------------------------------------------------------------------ LAYAR DOMPET FIKTIF ("VanPay")
async function walletScreen({ saldo, title = 'VanPay', rows = [] }) {
  ensureFonts()
  const { createCanvas } = canvasLib()
  const W = 1080, H = 1500
  const canvas = createCanvas(W, H)
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#f3f6fb'; ctx.fillRect(0, 0, W, H)
  const g = ctx.createLinearGradient(0, 0, W, 520)
  g.addColorStop(0, '#0ea5e9'); g.addColorStop(1, '#6366f1')
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, 520)
  ctx.fillStyle = '#fff'; ctx.font = `50px ${F_BOLD}`; ctx.fillText(title, 64, 120)
  ctx.font = `30px ${F_SEMI}`; ctx.fillStyle = 'rgba(255,255,255,.8)'; ctx.fillText('Saldo kamu (contoh)', 64, 250)
  ctx.fillStyle = '#fff'
  const txt = `Rp ${idr(saldo)}`
  let fs = 120
  for (; fs > 44; fs -= 4) { ctx.font = `${fs}px ${F_BOLD}`; if (ctx.measureText(txt).width <= W - 128) break }
  ctx.fillText(txt, 64, 250 + 20 + fs)
  // kartu menu
  let y = 470
  rr(ctx, 48, y, W - 96, 220, 36); ctx.fillStyle = '#fff'; ctx.shadowColor = 'rgba(0,0,0,.12)'; ctx.shadowBlur = 24; ctx.fill(); ctx.shadowBlur = 0
  const items = ['Kirim', 'Minta', 'Isi Saldo', 'Lainnya']
  items.forEach((it, i) => {
    const cx = 48 + (W - 96) / 8 + i * ((W - 96) / 4)
    ctx.fillStyle = ['#e0f2fe', '#ede9fe', '#dcfce7', '#fef3c7'][i]; ctx.beginPath(); ctx.arc(cx, y + 86, 46, 0, Math.PI * 2); ctx.fill()
    ctx.fillStyle = '#0f172a'; ctx.font = `28px ${F_SEMI}`; ctx.textAlign = 'center'; ctx.fillText(it, cx, y + 178)
  })
  ctx.textAlign = 'left'
  y += 280
  for (const [k, v] of rows) {
    rr(ctx, 48, y, W - 96, 150, 28); ctx.fillStyle = '#fff'; ctx.fill()
    ctx.fillStyle = '#64748b'; ctx.font = `30px ${F_SEMI}`; ctx.fillText(k, 88, y + 62)
    ctx.fillStyle = '#0f172a'; ctx.font = `40px ${F_BOLD}`; ctx.fillText(clip(v, 30), 88, y + 118)
    y += 178
  }
  ctx.fillStyle = '#94a3b8'; ctx.font = `24px ${F_SEMI}`
  ctx.fillText('VanPay adalah merek fiktif buatan WhatsApp Bot — gambar hiburan, bukan bukti saldo.', 64, H - 40)
  watermark(ctx, W, H)
  return canvas.encode('png')
}

module.exports = { ensureFonts, tweet, facepalm, fakedj, idCard, atmCard, studentCard, walletScreen, idr }
