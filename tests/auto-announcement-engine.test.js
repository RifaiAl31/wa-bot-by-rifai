// Pengujian sistem jadwal otomatis: fake clock (tanggal eksplisit) + fake socket.
// Tidak ada pengiriman WhatsApp sungguhan.
const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('fs')
const os = require('os')
const path = require('path')

const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'auto-engine-'))
process.env.AUTO_ANNOUNCEMENT_DATA_DIR = path.join(dir, 'data')
process.env.AUTO_ANNOUNCEMENT_WEB_MEDIA_DIR = path.join(dir, 'media')
process.env.AUTO_ANNOUNCEMENT_SEED = '0'

const data = require('../lib/autoAnnouncementData')
const engine = require('../lib/announcementScheduleEngine')
const sched = require('../lib/autoAnnouncementScheduler')
const { jakartaNow } = require('../lib/announcementScheduler')

const G1 = '628333333333-1234567890@g.us'
const G2 = '628444444444-0987654321@g.us'
const ROOT = path.join(__dirname, '..')

function sock(onlineState = true) {
  const sent = []
  return {
    sent,
    user: { id: '6280000000@s.whatsapp.net' },
    ws: { readyState: onlineState ? 1 : 3 },
    async sendMessage(jid, content) { sent.push({ jid, content }); return { key: { id: `s${sent.length}` } } },
    async groupFetchAllParticipating() { return { [G1]: { id: G1, subject: 'Grup 1' }, [G2]: { id: G2, subject: 'Grup 2' } } },
    __rawSend(jid, content) { return this.sendMessage(jid, content) },
  }
}
function row(extra = {}) {
  return data.add(Object.assign({
    title: 'Pengumuman Uji', body: 'Isi uji.', eventDate: engine.addDays(jakartaNow().date, 3),
    startDate: engine.addDays(jakartaNow().date, 3), weekday: 0, repeat: 'forever',
    offsetDays: 1, sendTime: '19:00', eventTime: '09:00', format: 'text',
    targets: [G1], status: 'active', is_active: 1, mode: 'relative',
  }, extra))
}

test('kalkulasi tanggal: mingguan, lintas minggu, bulan, tahun, dan Minggu', () => {
  const senin = { weekday: 1, startDate: '2026-12-07', repeat: 'forever', offsetDays: 1, sendTime: '19:00' }
  assert.deepEqual(
    { e: engine.nextSend(senin, '2026-12-01').eventDate, s: engine.nextSend(senin, '2026-12-01').sendDate },
    { e: '2026-12-07', s: '2026-12-06' },
  )
  assert.equal(engine.nextSend(senin, '2026-12-08').eventDate, '2026-12-14')
  const tahun = { weekday: 5, startDate: '2027-01-01', repeat: 'forever', offsetDays: 1, sendTime: '06:00' }
  assert.equal(engine.nextSend(tahun, '2026-12-30').sendDate, '2026-12-31')
  const minggu = { weekday: 0, startDate: '2026-12-06', repeat: 'forever', offsetDays: 1, sendTime: '19:00' }
  assert.equal(engine.nextSend(minggu, '2026-12-06').sendDate, '2026-12-05')
  assert.equal(engine.weekdayOf('2026-12-06'), 0)
})

test('tiga jadwal awal dibuat sekali, sebagai draft dan tidak mengirim', () => {
  data._resetForTests()
  const first = data.seedInitialSchedules()
  assert.equal(first.added, 3)
  assert.deepEqual(data.list().map((x) => x.scheduleName), ['Pengumuman A', 'Pengumuman B', 'Pengumuman C'])
  assert.deepEqual(data.list().map((x) => x.sendTime), ['19:00', '19:00', '06:00'])
  assert.deepEqual(data.list().map((x) => x.offsetDays), [1, 1, 0])
  assert.ok(data.list().every((x) => x.status === 'draft' && x.is_active === 0 && x.repeat === 'forever'))
  assert.equal(data.listRuns().length, 0)
  assert.equal(data.seedInitialSchedules().added, 0)
})

test('pengaturan catch-up tersimpan dan tervalidasi', () => {
  data._resetForTests()
  assert.equal(data.getSettings().catchUp, 'skip')
  data.updateSettings({ catchUp: 'review', maxPending: 7, defaultSendTime: '06:00' })
  assert.equal(data.getSettings().catchUp, 'review')
  assert.equal(data.getSettings().maxPending, 7)
  assert.equal(data.getSettings().defaultSendTime, '06:00')
  data.updateSettings({ catchUp: 'tidak-valid', maxPending: 9999 })
  assert.equal(data.getSettings().catchUp, 'review')
  assert.equal(data.getSettings().maxPending, 7)
})

test('catch-up SKIP: jadwal terlewat ditandai missed, tidak dikirim, tidak dobel', async () => {
  data._resetForTests()
  const yesterday = engine.addDays(jakartaNow().date, -1)
  const r = row({
    eventDate: yesterday, startDate: yesterday, weekday: engine.weekdayOf(yesterday),
    offsetDays: 0, sendTime: '00:00', catchUp: 'skip', targets: [G1],
  })
  const s = sock()
  const first = await sched.tickAutoAnnouncements(s)
  assert.ok(first.missed >= 1)
  assert.equal(s.sent.length, 0)
  assert.equal(data.listRuns(r.id)[0].status, 'missed')
  await sched.tickAutoAnnouncements(s)
  assert.equal(data.listRuns(r.id).length, 1)
})

test('catch-up SEND_WHEN_ONLINE: antrian terkirim saat online, offline tidak mengklaim pengiriman', async () => {
  data._resetForTests()
  const yesterday = engine.addDays(jakartaNow().date, -1)
  const r = row({
    eventDate: yesterday, startDate: yesterday, weekday: engine.weekdayOf(yesterday),
    offsetDays: 0, sendTime: '00:00', catchUp: 'online', targets: [G1],
  })
  const offline = sock(false)
  const first = await sched.tickAutoAnnouncements(offline)
  assert.equal(first.offline, true)
  assert.equal(offline.sent.length, 0)
  const onlineSock = sock()
  await sched.tickAutoAnnouncements(onlineSock)
  assert.ok(data.listRuns(r.id).some((x) => x.status === 'sent'))
  assert.equal(onlineSock.sent.length, 1)
})

test('catch-up MANUAL_REVIEW: menunggu approval, lalu dikirim setelah disetujui', async () => {
  data._resetForTests()
  const yesterday = engine.addDays(jakartaNow().date, -1)
  const r = row({
    eventDate: yesterday, startDate: yesterday, weekday: engine.weekdayOf(yesterday),
    offsetDays: 0, sendTime: '00:00', catchUp: 'review', targets: [G1],
  })
  const s = sock()
  await sched.tickAutoAnnouncements(s)
  const pending = data.listRuns(r.id).find((x) => x.status === 'pending_review')
  assert.ok(pending)
  assert.equal(s.sent.length, 0)
  const approved = await sched.approvePending(s, pending.key, 'admin-test')
  assert.equal(approved.status, 'sent')
  assert.equal(s.sent.length, 1)
})

test('riwayat menyimpan snapshot; edit template tidak mengubah riwayat lama', async () => {
  data._resetForTests()
  const tpl = data.addTemplate({ name: 'Rapat', title: 'Judul lama', body: 'Isi lama' })
  const r = row({ templateId: tpl.id, repeat: 'none', offsetDays: 0, targets: [G1] })
  const run = data.claimUnique(`manual|${r.id}|snapshot|1`, { id: r.id, kind: 'manual', status: 'claimed' })
  const s = sock()
  await sched.sendAnnouncement(s, { row: r, eventDate: r.eventDate }, run)
  assert.equal(data.findRun(run.key).snapshot.body, 'Isi lama')
  assert.match(s.sent[0].content.text, /Isi lama/)
  data.updateTemplate(tpl.id, { title: 'Judul baru', body: 'Isi baru' })
  assert.equal(data.findRun(run.key).snapshot.body, 'Isi lama')
  assert.equal(sched.resolveContent(data.get(r.id)).body, 'Isi baru')
})

test('kirim ke beberapa grup dan gambar menghasilkan payload gambar', async () => {
  data._resetForTests()
  const imageDir = path.join(ROOT, 'temp', `auto-engine-${process.pid}`)
  fs.mkdirSync(imageDir, { recursive: true })
  const imageFile = path.join(imageDir, 'poster.png')
  fs.writeFileSync(imageFile, Buffer.concat([
    Buffer.from('89504e470d0a1a0a', 'hex'), Buffer.alloc(64, 7),
  ]))
  try {
    const r = row({
      repeat: 'none', offsetDays: 0, targets: [G1, G2], format: 'both',
      imagePath: path.relative(ROOT, imageFile).split(path.sep).join('/'),
    })
    const run = data.claimUnique(`manual|${r.id}|gambar|1`, { id: r.id, kind: 'manual', status: 'claimed' })
    const s = sock()
    const outcome = await sched.sendAnnouncement(s, { row: r, eventDate: r.eventDate }, run)
    assert.equal(outcome.status, 'sent')
    assert.equal(s.sent.length, 4) // 2 grup x (teks + gambar)
    assert.ok(s.sent.some((x) => x.content.image))
    assert.equal(data.findRun(run.key).details.length, 4)
  } finally {
    fs.rmSync(imageDir, { recursive: true, force: true })
  }
})
