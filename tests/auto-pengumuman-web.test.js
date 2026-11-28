// Verifikasi dashboard hybrid: auth, CRUD, upload, kirim manual, retry, dan anti-double.
// Menjalankan server HTTP asli di port ephemeral dengan socket WhatsApp palsu.
const test = require('node:test')
const { before, after } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('fs')
const os = require('os')
const path = require('path')

const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'auto-ann-web-'))
process.env.AUTO_ANNOUNCEMENT_DATA_DIR = path.join(dir, 'data')
process.env.AUTO_ANNOUNCEMENT_WEB_MEDIA_DIR = path.join(dir, 'media')
process.env.DASHBOARD_AUTH_FILE = path.join(dir, 'auth.json')
process.env.DASHBOARD_PASSWORD = 'rahasia-admin-test'
process.env.DASHBOARD_PORT = '0'
process.env.DASHBOARD_HOST = '127.0.0.1'
delete process.env.DASHBOARD_ALLOWED_ORIGIN
delete process.env.DASHBOARD_COOKIE_SECURE

const data = require('../lib/autoAnnouncementData')
const sched = require('../lib/autoAnnouncementScheduler')
const web = require('../lib/announcementWeb')

const GROUP = '628333333333-1234567890@g.us'
let server
let base
let cookie
let csrf
let failNext = false

const sock = {
  user: { id: '6280000000@s.whatsapp.net' },
  ws: { readyState: 1 },
  namedGroups: { [GROUP]: { id: GROUP, subject: 'Grup Uji' } },
  sent: [],
  async sendMessage(jid, content) {
    if (failNext) { failNext = false; throw new Error('simulasi gagal') }
    this.sent.push({ jid, content })
    return { key: { id: `s${this.sent.length}` } }
  },
  async groupFetchAllParticipating() { return this.namedGroups },
}
sock.__rawSend = (jid, content) => sock.sendMessage(jid, content)

async function api(route, { method = 'GET', body, headers = {}, withAuth = true } = {}) {
  const h = Object.assign({}, headers)
  if (withAuth && cookie) h.cookie = cookie
  if (withAuth && csrf && method !== 'GET') h['x-csrf-token'] = csrf
  let payload = body
  if (body !== undefined && !(body instanceof Buffer) && typeof body !== 'string') {
    payload = JSON.stringify(body)
    h['content-type'] = 'application/json'
  }
  const res = await fetch(`${base}${route}`, { method, headers: h, body: payload })
  const text = await res.text()
  let json = null
  try { json = JSON.parse(text) } catch { json = text }
  return { status: res.status, json, headers: res.headers }
}

before(async () => {
  data._resetForTests()
  sock.sent = []
  server = web.start()
  await new Promise((resolve) => server.once('listening', resolve))
  base = `http://127.0.0.1:${server.address().port}`
  web.setSock(sock)
})
after(async () => {
  await web.stop()
})

test('health publik, bootstrap butuh login, login salah ditolak', async () => {
  assert.equal((await api('/api/health', { withAuth: false })).status, 200)
  assert.equal((await api('/api/bootstrap', { withAuth: false })).status, 401)
  assert.equal((await api('/api/auth/login', { method: 'POST', body: { password: 'salah' }, withAuth: false })).status, 401)
  const ok = await api('/api/auth/login', { method: 'POST', body: { password: 'rahasia-admin-test' }, withAuth: false })
  assert.equal(ok.status, 200)
  assert.equal(ok.json.ok, true)
  csrf = ok.json.csrfToken
  cookie = ok.headers.get('set-cookie').split(';')[0]
  assert.match(ok.headers.get('set-cookie'), /HttpOnly/)
})

test('CSRF wajib untuk mutasi', async () => {
  const res = await fetch(`${base}/api/announcements`, {
    method: 'POST',
    headers: { cookie, 'content-type': 'application/json' },
    body: JSON.stringify({}),
  })
  assert.equal(res.status, 403)
})

test('CRUD pengumuman lewat web langsung terbaca oleh lapisan WhatsApp', async () => {
  const payload = {
    title: 'Rapat RT', body: 'Hadiri tepat waktu.', eventDate: '2026-12-06',
    eventTime: '19.00', location: 'Balai RT', targets: [GROUP], format: 'text',
    mode: 'relative', repeat: 'none', offsetDays: 1, sendTime: '17.00',
    status: 'active',
  }
  const created = await api('/api/announcements', { method: 'POST', body: payload })
  assert.equal(created.status, 200, JSON.stringify(created.json))
  const id = created.json.item.id
  assert.equal(data.get(id).title, 'Rapat RT') // command WhatsApp membaca file yang sama
  assert.equal(data.get(id).location, 'Balai RT')
  assert.equal(data.get(id).weekday, 0) // 2026-12-06 = Minggu, diturunkan otomatis

  const bad = await api(`/api/announcements/${id}`, { method: 'PATCH', body: { eventDate: 'tidak-tanggal' } })
  assert.equal(bad.status, 400)
  const updated = await api(`/api/announcements/${id}`, { method: 'PATCH', body: { status: 'draft', is_active: 0 } })
  assert.equal(updated.status, 200)
  assert.equal(data.get(id).status, 'draft')
  const bootstrap = await api('/api/bootstrap')
  assert.equal(bootstrap.json.stats.draft, 1)
  assert.equal(bootstrap.json.groups[0].id, GROUP)
  assert.match(sched.announcementText(data.get(id), '2026-12-06'), /Lokasi: Balai RT/)

  await api(`/api/announcements/${id}`, { method: 'PATCH', body: { status: 'active', is_active: 1 } })
  const removed = await api(`/api/announcements/${id}`, { method: 'DELETE' })
  assert.equal(removed.status, 200)
  assert.equal(data.get(id), null)
})

test('upload gambar: validasi tipe, ukuran, dan path', async () => {
  const png = Buffer.concat([Buffer.from('89504e470d0a1a0a', 'hex'), Buffer.alloc(64, 1)])
  const boundary = '----vitestboundary'
  const part = Buffer.concat([
    Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="poster.png"\r\nContent-Type: image/png\r\n\r\n`),
    png,
    Buffer.from(`\r\n--${boundary}--\r\n`),
  ])
  const ok = await api('/api/upload', {
    method: 'POST', body: part,
    headers: { 'content-type': `multipart/form-data; boundary=${boundary}` },
  })
  assert.equal(ok.status, 200, JSON.stringify(ok.json))
  assert.equal(ok.json.file.mime, 'image/png')
  assert.match(ok.json.file.path, /\.png$/)
  assert.ok(fs.existsSync(path.join(web.MEDIA_DIR, path.basename(ok.json.file.path))))

  const bad = await api('/api/upload', {
    method: 'POST', body: Buffer.from('--x\r\nContent-Disposition: form-data; name="file"; filename="a.txt"\r\nContent-Type: text/plain\r\n\r\nhello\r\n--x--\r\n'),
    headers: { 'content-type': 'multipart/form-data; boundary=x' },
  })
  assert.equal(bad.status, 400)
})

test('kirim manual memakai socket existing; offline tidak mengklaim jadwal', async () => {
  const row = data.add({
    title: 'Pengajian', body: 'Kamis malam', eventDate: '2026-12-10',
    targets: [GROUP], format: 'text', mode: 'relative', sendTime: '17.00',
    status: 'active', is_active: 1,
  })
  sock.sent = []
  const sent = await api(`/api/announcements/${row.id}/send`, { method: 'POST', body: {} })
  assert.equal(sent.status, 200, JSON.stringify(sent.json))
  assert.equal(sent.json.run.status, 'sent')
  assert.equal(sock.sent.length, 1)
  assert.match(sock.sent[0].content.text, /Pengajian/)

  const before = data.listRuns(row.id).length
  web.setSock(null)
  const offline = await api(`/api/announcements/${row.id}/send`, { method: 'POST', body: {} })
  assert.equal(offline.status, 409)
  assert.equal(data.listRuns(row.id).length, before) // tidak ada klaim saat offline
  web.setSock(sock)
})

test('retry hanya untuk run gagal dan tidak mengirim dua kali untuk run sukses', async () => {
  const row = data.add({
    title: 'Retry test', body: 'isi', eventDate: '2026-12-11',
    targets: [GROUP], format: 'text', mode: 'relative', sendTime: '17.00',
    status: 'active', is_active: 1,
  })
  failNext = true
  const failed = await api(`/api/announcements/${row.id}/send`, { method: 'POST', body: {} })
  assert.equal(failed.json.run.status, 'failed')
  sock.sent = []
  const retry = await api(`/api/announcements/${row.id}/retry`, { method: 'POST', body: { runKey: failed.json.run.key } })
  assert.equal(retry.status, 200, JSON.stringify(retry.json))
  assert.equal(retry.json.run.status, 'sent')
  assert.equal(sock.sent.length, 1)
  const retryAgain = await api(`/api/announcements/${row.id}/retry`, { method: 'POST', body: { runKey: retry.json.run.key } })
  assert.equal(retryAgain.status, 400)
  assert.equal(sock.sent.length, 1)
  const okRun = data.findRun(retry.json.run.key)
  assert.equal(okRun.status, 'sent')
})

test('klaim scheduler unik: tick dua kali tidak mengirim dua kali', async () => {
  const row = data.add({
    title: 'Jadwal sekali', body: 'isi', eventDate: '2026-12-12',
    targets: [GROUP], format: 'text', mode: 'once', scheduleAt: '2026-12-12T17:00',
    status: 'active', is_active: 1,
  })
  const now = { date: '2026-12-12', time: '17:00' }
  assert.equal(sched.dueItems(now).filter((d) => d.row.id === row.id).length, 1)
  const run = data.claimRun(row.id, '2026-12-12', '17:00', '2026-12-12', { kind: 'scheduled' })
  assert.ok(run)
  assert.equal(data.claimRun(row.id, '2026-12-12', '17:00', '2026-12-12'), null)
  data.finishRun(run, { status: 'sent', details: [] })
  assert.equal(data.findRun(run.key).status, 'sent')
})

test('template: tambah, pakai, edit, hapus', async () => {
  const created = await api('/api/templates', { method: 'POST', body: { name: 'Rapat', body: 'Agenda rapat:\n' } })
  assert.equal(created.status, 200)
  const id = created.json.template.id
  const edited = await api(`/api/templates/${id}`, { method: 'PATCH', body: { body: 'Agenda rapat mingguan:\n' } })
  assert.equal(edited.status, 200)
  assert.match(data.getTemplate(id).body, /mingguan/)
  assert.equal((await api(`/api/templates/${id}`, { method: 'DELETE' })).status, 200)
  assert.equal(data.getTemplate(id), null)
})

test('audit admin tercatat tanpa menyimpan password', async () => {
  const audit = (await api('/api/bootstrap')).json.audit
  assert.ok(audit.length >= 4)
  assert.ok(audit.some((x) => x.action === 'login'))
  assert.ok(audit.some((x) => x.action === 'upload'))
  assert.ok(!JSON.stringify(audit).includes('rahasia-admin-test'))
})
