// Verifikasi fitur Sekretaris Digital: .auto-pengumuman + .analisis-catatan/.catatan.
const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('fs')
const os = require('os')
const path = require('path')
const http = require('http')

const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'sekretaris-'))
process.env.AUTO_ANNOUNCEMENT_DATA_DIR = path.join(dir, 'auto')
process.env.CATATAN_DATA_DIR = path.join(dir, 'catatan')
process.env.ANNOUNCEMENT_DATA_DIR = path.join(dir, 'ann')
process.env.ANNOUNCEMENT_MEDIA_DIR = path.join(dir, 'media')
delete process.env.NOTE_VISION_URL
delete process.env.GEMINI_API_KEY

const autoData = require('../lib/autoAnnouncementData')
const autoSched = require('../lib/autoAnnouncementScheduler')
const autoFlow = require('../lib/autoAnnouncementFlow')
const autoPoster = require('../lib/autoAnnouncementPoster')
const noteData = require('../lib/noteData')
const noteVision = require('../lib/noteVision')
const media = require('../lib/announcementMedia')
const noteFlow = require('../lib/noteFlow')

const GROUP = '628333333333-1234567890@g.us'
const ADMIN = '628111111111@s.whatsapp.net'
const GROUP_META = { [GROUP]: { id: GROUP, subject: 'Grup Uji' }, '628999999999-1@g.us': { id: '628999999999-1@g.us', subject: 'Grup Dua' } }

let seq = 0
function sock() {
  const sent = []
  const s = {
    sent, user: { id: '6280000000@s.whatsapp.net' }, ws: { readyState: 1 },
    namedGroups: GROUP_META,
    async sendMessage(jid, content) { sent.push({ jid, content }); return { key: { id: `s${++seq}` } } },
    async groupFetchAllParticipating() { return GROUP_META },
  }
  s.__rawSend = (jid, content) => s.sendMessage(jid, content)
  return s
}
function ctx(s, text, opts = {}) {
  const body = String(text || '')
  const prefixLen = body.startsWith('.') ? 1 : 0
  const args = body.slice(prefixLen).trim().split(/\s+/).filter(Boolean)
  const msg = {
    key: { id: `m${++seq}`, fromMe: false, remoteJid: GROUP, participant: ADMIN },
    message: text ? { conversation: String(text) } : {},
  }
  return {
    sock: s, msg, from: GROUP, sender: ADMIN, isGroup: true, isOwner: true,
    body: body, text: body, prefix: '.', args,
    reply: (value) => s.sendMessage(GROUP, { text: String(value) }),
  }
}
const texts = (s) => s.sent.map((x) => x.content.text || x.content.caption || '').join('\n')
const send = (s, text, opts) => autoFlow.passive(ctx(s, text, opts))

test('ID AN tidak dibatasi 10 dan tetap ada setelah reload', () => {
  autoData._resetForTests()
  const rows = Array.from({ length: 12 }, (_, i) => autoData.add({ title: `Agenda ${i + 1}` }))
  assert.equal(rows[0].id, 'AN1')
  assert.equal(rows[11].id, 'AN12')
  autoData.reload()
  assert.equal(autoData.list().length, 12)
  assert.equal(autoData.get('AN12').title, 'Agenda 12')
})

test('poster 1080x1350 dibuat lokal tanpa API', () => {
  const buf = autoPoster.renderPoster({ title: 'Rapat Warga', body: 'Hadir tepat waktu.', eventDate: '2026-12-06', eventTime: '19.00' })
  assert.equal(buf.toString('hex', 0, 4), '89504e47')
  assert.equal(buf.readUInt32BE(16), 1080)
  assert.equal(buf.readUInt32BE(20), 1350)
})

test('hitung tanggal kirim mingguan dan klaim unik anti-double', () => {
  autoData._resetForTests()
  const row = autoData.add({
    title: 'Piket masjid', body: 'Kelompok 1', weekday: 6, eventDate: '2026-12-05',
    eventTime: '08.00', repeat: 'weekly', offsetDays: 1, sendTime: '17.00',
    format: 'text', targets: [GROUP], is_active: 1,
  })
  const dates = autoSched.eventDatesFor(row, '2026-12-04')
  assert.ok(dates.includes('2026-12-05'))
  assert.equal(autoSched.addDays('2026-12-05', -1), '2026-12-04')
  const due = autoSched.dueItems({ date: '2026-12-04', time: '17.00', year: 2026, month: 12, day: 4 })
  assert.equal(due.length, 1)
  assert.equal(due[0].row.id, row.id)
  const claim = autoData.claimRun(row.id, '2026-12-04', '17.00', '2026-12-05')
  assert.ok(claim)
  assert.equal(autoData.claimRun(row.id, '2026-12-04', '17.00', '2026-12-05'), null)
})

test('wizard .auto-pengumuman menerima jawaban biasa dan menyimpan setelah konfirmasi', async () => {
  autoData._resetForTests()
  const s = sock()
  const c = ctx(s, '.auto-pengumuman tambah')
  await autoFlow.startAdd(c)
  for (const answer of ['sabtu', 'depan', 'Rapat RT', 'Hadiri tepat waktu', '19.00', '2', '17.00', '2', '1', 'ini']) {
    assert.equal(await send(s, answer), true, `jawaban "${answer}" harus ditangani`)
  }
  assert.match(texts(s), /PREVIEW AUTO PENGUMUMAN/)
  assert.equal(await send(s, 'edit judul Rapat RT 05'), true)
  assert.match(texts(s), /Rapat RT 05/)
  assert.equal(await send(s, 'ya'), true)
  assert.equal(autoData.list().length, 1)
  const row = autoData.list()[0]
  assert.equal(row.title, 'Rapat RT 05')
  assert.equal(row.repeat, 'weekly')
  assert.equal(row.offsetDays, 1)
  assert.deepEqual(row.targets, [GROUP])
  assert.equal(autoFlow.sessions.get(autoFlow.keyOf(c)), undefined)
})

test('dua sesi wizard tidak tertukar', async () => {
  autoData._resetForTests()
  const s = sock()
  const a = ctx(s, 'x'); const b = { ...ctx(s, 'x'), sender: '628222222222@s.whatsapp.net', msg: { key: { id: 'other', fromMe: false, remoteJid: GROUP, participant: '628222222222@s.whatsapp.net' }, message: {} } }
  await autoFlow.startAdd(a)
  await autoFlow.startAdd(b)
  await send(s, 'senin', { sender: ADMIN })
  const sa = autoFlow.sessions.get(autoFlow.keyOf(a))
  const sb = autoFlow.sessions.get(autoFlow.keyOf(b))
  assert.equal(sa.data.weekday, 1)
  assert.equal(sb.data.weekday, null)
})

test('parser JSON vision menolak struktur palsu dan mengisi kategori kosong', () => {
  const parsed = noteVision.parseJson('```json\n{"judul_dan_tanggal":{"tertulis":["Rapat, 3 Desember 2026"]}}\n```')
  assert.equal(parsed.judul_dan_tanggal.tertulis[0], 'Rapat, 3 Desember 2026')
  assert.deepEqual(parsed.informasi_keuangan, { tertulis: [], interpretasi: [] })
  assert.equal(parsed.teks_per_halaman.length, 0)
  assert.throws(() => noteVision.parseJson('bukan json'))
})

test('noteData menyimpan CAT001, cari, dan hapus', () => {
  noteData._resetForTests()
  const row = noteData.add({ title: 'Rapat iuran', raw: 'Iuran Rp 20.000', transcript: { informasi_keuangan: { tertulis: ['Iuran Rp 20.000'], interpretasi: [] } } })
  assert.equal(row.id, 'CAT001')
  assert.equal(noteData.search('iuran').length, 1)
  noteData.reload()
  assert.equal(noteData.get('CAT001').title, 'Rapat iuran')
  assert.equal(noteData.remove('CAT001'), true)
  assert.equal(noteData.list().length, 0)
})

test('hook mengambil alih .catatan <sub> dari plugin lama', async () => {
  noteData._resetForTests()
  noteData.add({ title: 'Rapat iuran', raw: '', transcript: {} })
  const hook = require('../plugins/group/analisis-catatan-hook')
  const s = sock()
  const listCtx = { ...ctx(s, '.catatan list'), args: ['list'] }
  assert.equal(await hook.passive(listCtx), true)
  assert.match(texts(s), /CAT001/)
  // .catatan tanpa subperintah tetap diteruskan ke plugin lama.
  assert.equal(await hook.passive(ctx(s, '.catatan')), false)
})

test('alur catatan: dua halaman dianalisis, dikoreksi, disimpan, lalu jadi pengumuman', async () => {
  // Provider lokal palsu: buktikan permintaan benar-benar membawa dua gambar berurutan.
  let seenImages = 0
  const server = http.createServer((req, res) => {
    let raw = ''
    req.on('data', (chunk) => { raw += chunk })
    req.on('end', () => {
      const payload = JSON.parse(raw)
      const parts = payload.messages?.[1]?.content || []
      seenImages = parts.filter((p) => p.type === 'image_url').length
      const result = {
        judul_dan_tanggal: { tertulis: ['Rapat RT 05, 3 Desember 2026'], interpretasi: [] },
        hasil_musyawarah: { tertulis: ['Iuran Rp 20.000 disepakati'], interpretasi: [] },
        jadwal_kegiatan: { tertulis: [], interpretasi: [] },
        daftar_nama_dan_petugas: { tertulis: ['Siti [TIDAK TERBACA]'], interpretasi: [] },
        pembagian_kelompok: { tertulis: [], interpretasi: [] },
        tugas_masing_orang: { tertulis: [], interpretasi: [] },
        informasi_keuangan: { tertulis: ['Kas Rp 150.000'], interpretasi: [] },
        rencana_kegiatan: { tertulis: ['Pengajian 6 Desember'], interpretasi: [] },
        catatan_tambahan: { tertulis: [], interpretasi: [] },
        perlu_konfirmasi: { tertulis: ['Siti atau Sitih'], interpretasi: [] },
        teks_per_halaman: [
          { halaman: 1, mentah: 'Rapat RT 05' },
          { halaman: 2, mentah: 'Iuran Rp 20.000' },
        ],
        tidak_terbaca: ['nama petugas baris 4'],
      }
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ choices: [{ message: { content: JSON.stringify(result) } }] }))
    })
  })
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
  process.env.NOTE_VISION_URL = `http://127.0.0.1:${server.address().port}/v1`

  const originalDownload = media.download
  media.download = async (msg) => ({
    buffer: Buffer.from(`halaman-${msg.key.id}`), ext: 'jpg', name: `halaman-${msg.key.id}.jpg`, mime: 'image/jpeg',
  })

  try {
    noteData._resetForTests()
    const s = sock()
    const imageCtx = (id) => ({
      ...ctx(s, ''),
      msg: { key: { id, fromMe: false, remoteJid: GROUP, participant: ADMIN }, message: { imageMessage: { mimetype: 'image/jpeg' } } },
    })
    await noteFlow.startAnalysis(imageCtx('p1'))
    await noteFlow.passive(imageCtx('p2'))
    assert.equal(noteFlow.sessions.get(noteFlow.keyOf(ctx(s, ''))).pages.length, 2)
    await noteFlow.passive(ctx(s, 'selesai'))
    assert.equal(seenImages, 2)
    const session = noteFlow.sessions.get(noteFlow.keyOf(ctx(s, '')))
    assert.equal(session.step, 'review')
    assert.match(texts(s), /\[TIDAK TERBACA\]/)
    await noteFlow.passive(ctx(s, 'edit 4 Siti Rahma'))
    assert.equal(session.transcript.daftar_nama_dan_petugas.tertulis[0], 'Siti Rahma')
    await noteFlow.passive(ctx(s, 'ya'))
    assert.equal(noteData.list().length, 1)
    const saved = noteData.list()[0]
    assert.equal(saved.id, 'CAT001')
    assert.equal(saved.pages.length, 2)

    await noteFlow.startPengumuman(ctx(s, '.catatan pengumuman CAT001'), 'CAT001')
    await noteFlow.passive(ctx(s, '7'))
    const autoSession = autoFlow.sessions.get(autoFlow.keyOf(ctx(s, '')))
    assert.equal(autoSession.step, 'day')
    assert.equal(autoSession.data.noteId, 'CAT001')
    assert.match(autoSession.data.body, /Kas Rp 150\.000/)
    assert.match(autoSession.data.title, /Informasi keuangan/)
  } finally {
    media.download = originalDownload
    delete process.env.NOTE_VISION_URL
    await new Promise((resolve) => server.close(resolve))
  }
})

test('plugin .auto-pengumuman menampilkan status/panduan dan membatasi tautan dashboard', async () => {
  autoData._resetForTests()
  const plugin = require('../plugins/tools/auto-pengumuman')
  const s = sock()
  const base = { sock: s, from: GROUP, sender: ADMIN, prefix: '.', msg: ctx(s, '.auto-pengumuman').msg }
  await plugin.run({ ...base, args: [], reply: (t) => s.sendMessage(GROUP, { text: String(t) }) })
  assert.match(texts(s), /AUTO PENGUMUMAN/)
  assert.match(texts(s), /auto-pengumuman bot/)
  assert.match(texts(s), /Agenda: 0/)

  await plugin.run({ ...base, args: ['bot'], isOwner: true, reply: (t) => s.sendMessage(GROUP, { text: String(t) }) })
  assert.match(s.sent.at(-1).content.text, /DASHBOARD AUTO PENGUMUMAN/)
  await plugin.run({ ...base, args: ['bot'], isOwner: false, reply: (t) => s.sendMessage(GROUP, { text: String(t) }) })
  assert.match(s.sent.at(-1).content.text, /admin\/owner/)
})
