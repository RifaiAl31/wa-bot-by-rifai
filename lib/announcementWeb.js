// Dashboard web Auto Pengumuman — HTTP server tanpa dependency baru (Node http).
// Berjalan di proses yang SAMA dengan bot: satu koneksi WhatsApp, satu file data.
'use strict'
const http = require('http')
const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const data = require('./autoAnnouncementData')
const auth = require('./announcementWebAuth')
const scheduler = require('./autoAnnouncementScheduler')

const ROOT = path.join(__dirname, '..')
const WEB_DIR = path.join(ROOT, 'web')
const MEDIA_DIR = process.env.AUTO_ANNOUNCEMENT_WEB_MEDIA_DIR
  ? path.resolve(process.env.AUTO_ANNOUNCEMENT_WEB_MEDIA_DIR)
  : path.join(data.DATA_DIR, 'auto-announcement-media')
const MAX_UPLOAD = (Number(process.env.DASHBOARD_UPLOAD_MAX_MB) || 5) * 1024 * 1024
const MAX_JSON = 1024 * 1024
const PUBLIC_URL = String(process.env.DASHBOARD_PUBLIC_URL || '')
const ALLOWED_ORIGIN = String(process.env.DASHBOARD_ALLOWED_ORIGIN || '')

let sock = null
let server = null
let groupCache = { at: 0, groups: [] }

const sendJson = (res, status, body, extra = {}) => {
  res.writeHead(status, Object.assign({
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'no-referrer',
    'X-Frame-Options': 'DENY',
  }, extra))
  res.end(JSON.stringify(body))
}
const fail = (res, status, error) => sendJson(res, status, { error })

function readBody(req, limit) {
  return new Promise((resolve, reject) => {
    const chunks = []
    let size = 0
    req.on('data', (chunk) => {
      size += chunk.length
      if (size > limit) {
        reject(new Error(`Permintaan terlalu besar (maks ${Math.round(limit / 1048576)} MB).`))
        req.destroy()
        return
      }
      chunks.push(chunk)
    })
    req.on('end', () => resolve(Buffer.concat(chunks)))
    req.on('error', reject)
  })
}
async function readJson(req) {
  const raw = await readBody(req, MAX_JSON)
  if (!raw.length) return {}
  try { return JSON.parse(raw.toString('utf8')) } catch { throw new Error('JSON tidak valid.') }
}

// Parser multipart minimal untuk SATU field file gambar + field teks. Tanpa dependency.
function parseMultipart(buffer, boundary) {
  const delim = Buffer.from(`--${boundary}`)
  const fields = {}
  let file = null
  let pos = buffer.indexOf(delim)
  while (pos >= 0) {
    let start = pos + delim.length
    if (buffer.slice(start, start + 2).toString() === '--') break
    if (buffer.slice(start, start + 2).toString() === '\r\n') start += 2
    const headerEnd = buffer.indexOf('\r\n\r\n', start)
    if (headerEnd < 0) break
    const header = buffer.slice(start, headerEnd).toString('utf8')
    const contentStart = headerEnd + 4
    const next = buffer.indexOf(delim, contentStart)
    if (next < 0) break
    let contentEnd = next
    while (contentEnd > contentStart && buffer[contentEnd - 1] === 10 && buffer[contentEnd - 2] === 13) contentEnd -= 2
    const content = buffer.slice(contentStart, contentEnd)
    const nameMatch = /name="([^"]+)"/.exec(header)
    if (nameMatch) {
      const fileMatch = /filename="([^"]*)"/.exec(header)
      const mimeMatch = /Content-Type:\s*([^\r\n;]+)/i.exec(header)
      if (fileMatch && fileMatch[1]) {
        file = { field: nameMatch[1], name: path.basename(fileMatch[1]), mime: mimeMatch?.[1] || 'application/octet-stream', buffer: content }
      } else fields[nameMatch[1]] = content.toString('utf8')
    }
    pos = next
  }
  return { fields, file }
}
function imageKind(buffer) {
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return { ext: 'jpg', mime: 'image/jpeg' }
  if (buffer.length >= 8 && buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return { ext: 'png', mime: 'image/png' }
  if (buffer.length >= 12 && buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP') return { ext: 'webp', mime: 'image/webp' }
  return null
}

// ---- Validasi input: semua field diperketat sebelum masuk ke penyimpanan ----
const clean = (v, max = 500) => String(v ?? '').replace(/\0/g, '').trim().slice(0, max)
function timeOf(v) {
  const s = clean(v, 5).replace(':', '.')
  return /^(?:[01]\d|2[0-3])[.][0-5]\d$/.test(s) ? s.replace('.', ':') : null
}
function dateOf(v) {
  const s = clean(v, 10)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return null
  const [y, m, d] = s.split('-').map(Number)
  const check = new Date(Date.UTC(y, m - 1, d))
  return check.getUTCFullYear() === y && check.getUTCMonth() === m - 1 && check.getUTCDate() === d ? s : null
}
function scheduleOf(v) {
  if (!v) return null
  const s = clean(v, 16)
  if (!/^\d{4}-\d{2}-\d{2}T(?:[01]\d|2[0-3]):[0-5]\d$/.test(s)) return null
  return dateOf(s.slice(0, 10)) ? s : null
}
function targetsOf(v) {
  if (!Array.isArray(v)) return null
  const out = [...new Set(v.map((x) => clean(x, 120)).filter((x) => /^\d+-\d+@g\.us$/.test(x)))]
  return out.length && out.length <= 100 ? out : null
}
function validateAnnouncement(input, partial = false) {
  if (!input || typeof input !== 'object') throw new Error('Payload tidak valid.')
  const out = {}
  const need = (key, value) => {
    if (value === null || value === undefined || value === '') throw new Error(`${key} tidak valid.`)
    out[key] = value
  }
  if (!partial || input.title !== undefined) need('title', clean(input.title, 120))
  if (!partial || input.body !== undefined) need('body', clean(input.body, 5000,))
  if (!partial || input.eventDate !== undefined) need('eventDate', dateOf(input.eventDate))
  if (input.eventTime !== undefined || !partial) out.eventTime = input.eventTime ? timeOf(input.eventTime) : ''
  if (input.eventTime && out.eventTime === null) throw new Error('Jam kegiatan tidak valid (HH.mm).')
  if (input.location !== undefined) out.location = clean(input.location, 200)
  if (!partial || input.targets !== undefined) need('targets', targetsOf(input.targets))
  if (input.format !== undefined || !partial) {
    if (!['text', 'poster', 'both'].includes(input.format)) throw new Error('Format tidak valid.')
    out.format = input.format
  }
  if (input.mode !== undefined || !partial) {
    if (!['relative', 'once'].includes(input.mode)) throw new Error('Mode jadwal tidak valid.')
    out.mode = input.mode
  }
  if (input.repeat !== undefined || !partial) {
    if (input.repeat !== undefined && !['none', 'weekly'].includes(input.repeat)) throw new Error('Pengulangan tidak valid.')
    out.repeat = input.repeat || 'none'
  }
  if (input.offsetDays !== undefined || !partial) {
    const n = Number(input.offsetDays)
    if (![0, 1, 7].includes(n)) throw new Error('Waktu kirim tidak valid.')
    out.offsetDays = n
  }
  if (input.sendTime !== undefined || !partial) need('sendTime', timeOf(input.sendTime || '08:00'))
  if (input.weekday !== undefined || !partial) {
    // Dashboard tidak menampilkan pilihan hari; turunkan dari tanggal kegiatan.
    const fallback = out.eventDate ? new Date(`${out.eventDate}T00:00:00Z`).getUTCDay() : 0
    const n = input.weekday === undefined ? fallback : Number(input.weekday)
    if (!Number.isInteger(n) || n < 0 || n > 6) throw new Error('Hari kegiatan tidak valid.')
    out.weekday = n
  }
  if (input.status !== undefined || !partial) {
    if (!['draft', 'active', 'paused'].includes(input.status || 'active')) throw new Error('Status tidak valid.')
    out.status = input.status || 'active'
  }
  if (input.is_active !== undefined) out.is_active = Number(input.is_active) ? 1 : 0
  else if (!partial) out.is_active = out.status === 'draft' ? 0 : 1
  if (input.scheduleAt !== undefined || !partial) {
    const at = scheduleOf(input.scheduleAt)
    if (out.mode === 'once' && !at) throw new Error('Tanggal & jam pengiriman tidak valid.')
    out.scheduleAt = at
  }
  if (input.imagePath !== undefined) {
    if (input.imagePath === null || input.imagePath === '') out.imagePath = null
    else {
      const rel = clean(input.imagePath, 200)
      const abs = path.resolve(ROOT, rel)
      if (!abs.startsWith(MEDIA_DIR + path.sep)) throw new Error('Path gambar tidak valid.')
      out.imagePath = path.relative(ROOT, abs).split(path.sep).join('/')
    }
  }
  return out
}

function audit(req, action, target, detail = '') {
  data.appendAudit({
    actor: 'admin', action, target, detail: clean(detail, 300),
    ip: String(req.headers?.['x-forwarded-for'] || req.socket?.remoteAddress || '-').split(',')[0].trim(),
  })
}
const digits = (jid) => String(jid || '').replace(/\D/g, '')
function whatsappStatus() {
  const connected = !!(sock?.user?.id && (!sock.ws || sock.ws.readyState === 1))
  const raw = digits(sock?.user?.id)
  return { connected, phone: raw ? `${raw.slice(0, 3)}••••${raw.slice(-2)}` : null }
}
async function groupList() {
  if (Date.now() - groupCache.at < 60000) return groupCache.groups
  let groups = []
  try {
    const list = await Promise.race([
      Promise.resolve(typeof sock?.groupFetchAllParticipating === 'function' ? sock.groupFetchAllParticipating() : {}),
      new Promise((r) => setTimeout(() => r(null), 5000)),
    ])
    if (list && typeof list === 'object') groups = Object.values(list)
  } catch { /* pakai cache/namedGroups */ }
  if (!groups.length && sock?.namedGroups) groups = Object.values(sock.namedGroups)
  const map = new Map()
  for (const g of groups) {
    if (g?.id && String(g.id).endsWith('@g.us')) map.set(g.id, { id: g.id, subject: String(g.subject || g.id).slice(0, 120) })
  }
  groupCache = { at: Date.now(), groups: [...map.values()].sort((a, b) => a.subject.localeCompare(b.subject, 'id')) }
  return groupCache.groups
}
function setSock(next) { sock = next || null; groupCache = { at: 0, groups: [] } }

async function handleApi(req, res, url) {
  const route = url.pathname.replace(/\/+$/, '') || '/'
  const method = req.method || 'GET'
  const session = auth.verifyRequest(req)

  if (route === '/api/health' && method === 'GET') return sendJson(res, 200, { ok: true, service: 'auto-pengumuman-dashboard' })
  if (route === '/api/auth/status' && method === 'GET') return sendJson(res, 200, auth.status(req))
  if (route === '/api/auth/login' && method === 'POST') {
    let body
    try { body = await readJson(req) } catch (err) { return fail(res, 400, err.message) }
    const result = auth.login(body.password, String(req.headers?.['x-forwarded-for'] || req.socket?.remoteAddress || '-').split(',')[0].trim())
    if (result.error) {
      audit(req, 'login-failed', 'dashboard', result.error)
      return fail(res, 401, result.error)
    }
    audit(req, 'login', 'dashboard')
    return sendJson(res, 200, { ok: true, csrfToken: result.csrfToken }, { 'Set-Cookie': result.token })
  }
  if (!session.authenticated) return fail(res, 401, 'Login admin diperlukan.')
  if (method !== 'GET' && method !== 'HEAD' && !auth.checkCsrf(req, session)) return fail(res, 403, 'Token CSRF tidak valid. Muat ulang halaman.')
  if (method !== 'GET' && method !== 'HEAD' && ALLOWED_ORIGIN && req.headers.origin && req.headers.origin !== ALLOWED_ORIGIN) {
    return fail(res, 403, 'Origin tidak diizinkan.')
  }
  if (route === '/api/auth/logout' && method === 'POST') {
    audit(req, 'logout', 'dashboard')
    return sendJson(res, 200, { ok: true }, { 'Set-Cookie': auth.logoutCookie() })
  }
  if (route === '/api/bootstrap' && method === 'GET') {
    return sendJson(res, 200, {
      stats: data.stats(),
      announcements: data.list(),
      templates: data.listTemplates(),
      history: data.listRuns().reverse().slice(0, 150),
      audit: data.listAudit().slice(0, 100),
      groups: await groupList(),
      whatsapp: whatsappStatus(),
      dashboard: { publicUrl: PUBLIC_URL },
    })
  }

  const annMatch = /^\/api\/announcements\/([^/]+)(?:\/(send|retry))?$/.exec(route)
  if (annMatch) {
    const id = data.normalizeId(decodeURIComponent(annMatch[1]))
    const action = annMatch[2]
    if (!data.get(id)) return fail(res, 404, 'Pengumuman tidak ditemukan.')
    if (action === 'send' && method === 'POST') {
      const outcome = await scheduler.manualSend(sock, id, 'web')
      audit(req, 'send', id, outcome.error || outcome.status)
      if (outcome.error) return fail(res, outcome.offline ? 409 : 400, outcome.error)
      return sendJson(res, 200, { ok: true, run: outcome.run })
    }
    if (action === 'retry' && method === 'POST') {
      let body
      try { body = await readJson(req) } catch (err) { return fail(res, 400, err.message) }
      const outcome = await scheduler.retrySend(sock, body.runKey, 'web')
      audit(req, 'retry', id, outcome.error || outcome.status)
      if (outcome.error) return fail(res, outcome.offline ? 409 : 400, outcome.error)
      return sendJson(res, 200, { ok: true, run: outcome.run })
    }
    if (action) return fail(res, 404, 'Endpoint tidak ditemukan.')
    if (method === 'PATCH') {
      let body
      try { body = await readJson(req) } catch (err) { return fail(res, 400, err.message) }
      let patch
      try { patch = validateAnnouncement(body, true) } catch (err) { return fail(res, 400, err.message) }
      // Barang lama buatan WhatsApp belum punya field baru; isi default dulu supaya
      // validasi penuh tidak menolak edit karena data historis.
      const merged = Object.assign({
        mode: 'relative', format: 'text', repeat: 'none', sendTime: '08:00',
        weekday: 0, status: 'active', is_active: 1, imagePath: null,
      }, data.get(id), patch)
      const check = Object.assign({}, merged)
      delete check.imagePath // path lama (dari WhatsApp) tidak perlu lolos aturan folder upload web
      try { patch = Object.assign(patch, validateAnnouncement(check)) } catch (err) { return fail(res, 400, err.message) }
      const item = data.update(id, patch)
      audit(req, 'update', id)
      return sendJson(res, 200, { ok: true, item })
    }
    if (method === 'DELETE') {
      data.remove(id)
      audit(req, 'delete', id)
      return sendJson(res, 200, { ok: true })
    }
    return fail(res, 405, 'Metode tidak didukung.')
  }
  if (route === '/api/announcements' && method === 'POST') {
    let body
    try { body = await readJson(req) } catch (err) { return fail(res, 400, err.message) }
    let patch
    try { patch = validateAnnouncement(body) } catch (err) { return fail(res, 400, err.message) }
    const item = data.add(Object.assign(patch, { createdBy: 'web' }))
    audit(req, 'create', item.id)
    return sendJson(res, 200, { ok: true, item })
  }

  const tplMatch = /^\/api\/templates(?:\/([^/]+))?$/.exec(route)
  if (tplMatch) {
    const id = data.normalizeTemplateId(tplMatch[1])
    if (method === 'GET' && !id) return sendJson(res, 200, { templates: data.listTemplates() })
    if (method === 'POST' && !id) {
      let body
      try { body = await readJson(req) } catch (err) { return fail(res, 400, err.message) }
      const name = clean(body.name, 80)
      const text = clean(body.body, 5000)
      if (!name || !text) return fail(res, 400, 'Nama dan isi template wajib diisi.')
      const template = data.addTemplate({ name, body: text })
      audit(req, 'template-create', template.id)
      return sendJson(res, 200, { ok: true, template })
    }
    if (id && data.getTemplate(id)) {
      if (method === 'PATCH') {
        let body
        try { body = await readJson(req) } catch (err) { return fail(res, 400, err.message) }
        const patch = {}
        if (body.name !== undefined) patch.name = clean(body.name, 80)
        if (body.body !== undefined) patch.body = clean(body.body, 5000)
        const template = data.updateTemplate(id, patch)
        audit(req, 'template-update', id)
        return sendJson(res, 200, { ok: true, template })
      }
      if (method === 'DELETE') {
        data.removeTemplate(id)
        audit(req, 'template-delete', id)
        return sendJson(res, 200, { ok: true })
      }
    }
  }

  if (route === '/api/upload' && method === 'POST') {
    const contentType = String(req.headers['content-type'] || '')
    const boundary = /boundary=(?:"([^"]+)"|([^;]+))/i.exec(contentType)
    if (!contentType.startsWith('multipart/form-data') || !boundary) return fail(res, 400, 'Gunakan multipart/form-data.')
    let raw
    try { raw = await readBody(req, MAX_UPLOAD + 65536) } catch (err) { return fail(res, 413, err.message) }
    const { file } = parseMultipart(raw, boundary[1] || boundary[2])
    if (!file || file.field !== 'file' || !file.buffer.length) return fail(res, 400, 'File gambar tidak ditemukan (field: file).')
    if (file.buffer.length > MAX_UPLOAD) return fail(res, 413, `Ukuran maksimal ${Math.round(MAX_UPLOAD / 1048576)} MB.`)
    const kind = imageKind(file.buffer)
    if (!kind) return fail(res, 400, 'Hanya gambar JPG, PNG, atau WebP yang diterima.')
    fs.mkdirSync(MEDIA_DIR, { recursive: true })
    const name = `${crypto.randomUUID()}.${kind.ext}`
    fs.writeFileSync(path.join(MEDIA_DIR, name), file.buffer, { mode: 0o600 })
    const rel = path.relative(ROOT, path.join(MEDIA_DIR, name)).split(path.sep).join('/')
    audit(req, 'upload', name, `${file.buffer.length} bytes`)
    return sendJson(res, 200, { ok: true, file: { path: rel, name: file.name.slice(0, 120), mime: kind.mime, size: file.buffer.length } })
  }
  const mediaMatch = /^\/api\/media\/([^/]+)$/.exec(route)
  if (mediaMatch && method === 'GET') {
    const name = path.basename(decodeURIComponent(mediaMatch[1]))
    const abs = path.resolve(MEDIA_DIR, name)
    if (!abs.startsWith(MEDIA_DIR + path.sep) || !fs.existsSync(abs)) return fail(res, 404, 'Gambar tidak ditemukan.')
    const kind = imageKind(fs.readFileSync(abs))
    if (!kind) return fail(res, 400, 'Format gambar tidak didukung.')
    res.writeHead(200, { 'Content-Type': kind.mime, 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' })
    return res.end(fs.readFileSync(abs))
  }
  return fail(res, 404, 'Endpoint tidak ditemukan.')
}

function serveStatic(req, res, url) {
  let name = decodeURIComponent(url.pathname)
  if (name === '/' || name === '/dashboard' || name === '/dashboard/') name = '/index.html'
  // index.html memakai path relatif (./styles.css, ./app.js). Saat dibuka di /dashboard,
  // browser mengubahnya jadi /dashboard/styles.css — terima kedua bentuk URL.
  if (name.startsWith('/dashboard/')) name = name.slice('/dashboard'.length)
  if (!['/index.html', '/styles.css', '/app.js'].includes(name)) return fail(res, 404, 'Halaman tidak ditemukan.')
  const file = path.join(WEB_DIR, path.basename(name))
  if (!fs.existsSync(file)) return fail(res, 404, 'Dashboard belum tersedia.')
  const mime = file.endsWith('.html') ? 'text/html; charset=utf-8' : file.endsWith('.css') ? 'text/css; charset=utf-8' : 'application/javascript; charset=utf-8'
  res.writeHead(200, { 'Content-Type': mime, 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'no-referrer', 'X-Frame-Options': 'DENY' })
  res.end(fs.readFileSync(file))
}

function start() {
  if (server) return server
  server = http.createServer((req, res) => {
    Promise.resolve().then(async () => {
      const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`)
      if (url.pathname.startsWith('/api/')) return await handleApi(req, res, url)
      if (req.method === 'GET' || req.method === 'HEAD') return serveStatic(req, res, url)
      return fail(res, 405, 'Metode tidak didukung.')
    }).catch((err) => {
      console.log('[DASHBOARD]', err.message)
      if (!res.headersSent) fail(res, 500, 'Terjadi kesalahan pada server dashboard.')
      else res.end()
    })
  })
  const port = Number(process.env.DASHBOARD_PORT || 3000)
  const host = process.env.DASHBOARD_HOST || '0.0.0.0'
  server.on('error', (err) => {
    console.log(`[DASHBOARD] gagal membuka port ${port}: ${err.message}. Bot tetap berjalan; ubah DASHBOARD_PORT lalu restart.`)
    server = null
  })
  server.listen(port, host, () => console.log(`[DASHBOARD] http://${host}:${port}/dashboard  (admin: ${auth.configured() ? 'aktif' : 'BELUM dikonfigurasi — set DASHBOARD_PASSWORD'})`))
  return server
}
function stop() {
  if (!server) return Promise.resolve()
  const s = server
  server = null
  return new Promise((resolve) => s.close(resolve))
}

module.exports = { start, stop, setSock, MEDIA_DIR, WEB_DIR, _handleApi: handleApi }
