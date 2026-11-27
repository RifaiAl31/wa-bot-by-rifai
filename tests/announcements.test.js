// Verifikasi alur .add pengumuman-teks / -img, kalender, dan scheduler tanpa WhatsApp.
const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('fs')
const os = require('os')
const path = require('path')

const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'vanxone-ann-'))
process.env.ANNOUNCEMENT_DATA_DIR = path.join(dir, 'data')
process.env.ANNOUNCEMENT_MEDIA_DIR = path.join(dir, 'media')

const data = require('../lib/announcementData')
const media = require('../lib/announcementMedia')
const flow = require('../lib/announcementFlow')
const { jakartaNow, tickAnnouncements } = require('../lib/announcementScheduler')

const ADMIN = '628111111111@s.whatsapp.net'
const OTHER = '628222222222@s.whatsapp.net'
const GROUP = '628333333333-1234567890@g.us'
const GROUP2 = '628444444444-1234567890@g.us'
const groupMeta = {
  [GROUP]: { id: GROUP, subject: 'Grup Uji', participants: [] },
  [GROUP2]: { id: GROUP2, subject: 'Grup Dua', participants: [] },
}

let seq = 0
function makeSock() {
  const sent = []
  const sock = {
    sent,
    user: { id: '6280000000@s.whatsapp.net' },
    ws: { readyState: 1 },
    namedGroups: groupMeta,
    async sendMessage(jid, content, options) {
      sent.push({ jid, content, options })
      return { key: { id: `s-${sent.length}` } }
    },
    async groupFetchAllParticipating() { return groupMeta },
  }
  sock.__rawSend = (jid, content, options) => sock.sendMessage(jid, content, options)
  return sock
}

function ctx(sock, text, opts = {}) {
  const from = opts.from || GROUP
  const sender = opts.sender || ADMIN
  const message = opts.message || {
    key: { id: `m-${++seq}`, fromMe: false, remoteJid: from, participant: sender },
    message: { conversation: String(text || '') },
  }
  return {
    sock, from, sender, message, msg: message,
    isGroup: opts.isGroup !== false,
    isOwner: opts.isOwner !== false,
    isAdmin: opts.isAdmin !== false,
    body: opts.body !== undefined ? opts.body : String(text || ''),
    text: String(text || ''),
    prefix: '.',
  }
}

const texts = (sock) => sock.sent.map((s) => s.content.text || s.content.caption || '').join('\n')
const send = (sock, text, opts) => flow.passive(ctx(sock, text, opts))

async function walkTextWizard(sock, opts = {}) {
  await flow.startAdd(ctx(sock, 'pengumuman-teks', opts), 'pengumuman-teks')
  for (const step of ['Rapat RT', 'Rapat di balai desa', 'senin', '21', '12', '2026', '09.00', '07.30']) {
    assert.equal(await send(sock, step, opts), true, `tahap ${step} harus ditangani wizard`)
  }
  assert.equal(await send(sock, 'ini', opts), true)
}

test.beforeEach(() => {
  data._resetForTests()
  for (const key of [...flow.sessions.keys()]) flow.sessions.delete(key)
})

test('.add pengumuman-teks menyimpan jenis, tanggal kegiatan, jam kegiatan, dan jam kirim', async () => {
  const sock = makeSock()
  await walkTextWizard(sock)
  assert.match(texts(sock), /PREVIEW PENGUMUMAN/)
  assert.match(texts(sock), /07\.30 WIB/)
  assert.equal(await send(sock, '.ya'), true)
  const row = data.get('A1')
  assert.equal(row.type, 'teks')
  assert.equal(row.title, 'Rapat RT')
  assert.equal(row.body, 'Rapat di balai desa')
  assert.equal(row.eventDate, '2026-12-21')
  assert.equal(row.eventTime, '09:00')
  assert.equal(row.sendTime, '07:30')
  assert.equal(row.weekday, 1)
  assert.deepEqual(row.targets, [GROUP])
  assert.equal(row.media, null)
  assert.equal(flow.sessions.size, 0)
})

test('tanggal yang tidak cocok dengan hari ditolak dan sesi tetap aktif', async () => {
  const sock = makeSock()
  await flow.startAdd(ctx(sock, 'pengumuman-teks'), 'pengumuman-teks')
  for (const step of ['Judul', 'Isi', 'senin', '22', '12', '2026']) await send(sock, step)
  assert.match(texts(sock), /Ketik ulang tanggal/)
  const session = flow.sessions.get(flow.keyOf(ctx(sock, '')))
  assert.equal(session.step, 'date')
})

test('.add pengumuman-img menerima dokumen, menyimpan permanen, dan menampilkan lampiran di preview', async () => {
  const sock = makeSock()
  const originalDownload = media.download
  const bytes = Buffer.from('%PDF-1.4\nnotulen rapat\n')
  media.download = async () => ({ buffer: bytes, ext: 'pdf', name: 'notulen.pdf', mime: 'application/pdf' })
  try {
    await flow.startAdd(ctx(sock, 'pengumuman-img'), 'pengumuman-img')
    for (const step of ['Notulen', 'Terlampir notulen.', 'sabtu', '5', '12', '2026', '13.00', '11.00', 'ini']) {
      await send(sock, step)
    }
    assert.equal(flow.sessions.get(flow.keyOf(ctx(sock, ''))).step, 'media')
    const file = {
      key: { id: 'file-1', fromMe: false, remoteJid: GROUP, participant: ADMIN },
      message: { documentMessage: { mimetype: 'application/pdf', fileName: 'notulen.pdf', fileLength: bytes.length } },
    }
    assert.equal(await flow.passive(ctx(sock, '', { message: file, body: '' })), true)
  } finally {
    media.download = originalDownload
  }
  assert.match(texts(sock), /Lampiran: notulen\.pdf/)
  assert.match(texts(sock), /PREVIEW PENGUMUMAN/)
  await send(sock, '.ya')
  const row = data.get('A1')
  assert.equal(row.type, 'img')
  assert.equal(row.media.name, 'notulen.pdf')
  assert.ok(fs.existsSync(path.resolve(__dirname, '..', row.media.path)))
  assert.deepEqual(fs.readFileSync(path.resolve(__dirname, '..', row.media.path)), bytes)
  data.reload()
  assert.equal(data.get('A1').media.name, 'notulen.pdf')
  assert.ok(fs.existsSync(path.resolve(__dirname, '..', data.get('A1').media.path)))
  assert.equal(media.buildPayload(data.get('A1')).fileName, 'notulen.pdf')
  assert.equal(media.buildPayload(data.get('A1')).caption, 'Terlampir notulen.')
})

test('format lampiran tidak didukung tidak mengakhiri sesi media', async () => {
  const sock = makeSock()
  await flow.startAdd(ctx(sock, 'pengumuman-img'), 'pengumuman-img')
  for (const step of ['Judul', 'Isi', 'senin', '21', '12', '2026', '09.00', '07.00', 'ini']) await send(sock, step)
  const file = {
    key: { id: 'file-2', fromMe: false, remoteJid: GROUP, participant: ADMIN },
    message: { documentMessage: { mimetype: 'text/plain', fileName: 'catatan.txt', fileLength: 3 } },
  }
  await flow.passive(ctx(sock, '', { message: file, body: '' }))
  assert.match(texts(sock), /Format tidak didukung/)
  assert.equal(flow.sessions.get(flow.keyOf(ctx(sock, ''))).step, 'media')
})

test('format JPG, JPEG, PNG, WEBP, PDF, DOC, dan DOCX diterima', () => {
  const cases = [
    ['foto.jpg', 'image/jpeg'], ['foto.jpeg', 'image/jpeg'], ['foto.png', 'image/png'],
    ['foto.webp', 'image/webp'], ['notulen.pdf', 'application/pdf'],
    ['surat.doc', 'application/msword'],
    ['surat.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  ]
  for (const [fileName, mimetype] of cases) {
    assert.equal(media.validate({ content: { fileName, mimetype, fileLength: 1 } }), fileName.split('.').pop())
  }
})

test('.kalender menampilkan teks dan media, termasuk filter minggu dan hari ini', async () => {
  const sock = makeSock()
  const today = jakartaNow().date
  data.add({ type: 'teks', title: 'Rapat Biasa', body: 'Isi', eventDate: '2026-12-21', eventTime: '09:00', sendTime: '07:30', targets: [GROUP] })
  data.add({ type: 'img', title: 'Foto Kegiatan', body: 'Lihat lampiran', eventDate: '2026-12-03', eventTime: '10:00', sendTime: '08:00', targets: [GROUP] })
  data.add({ type: 'teks', title: 'Pengumuman Hari Ini', body: 'Jadwal hari ini', eventDate: today, eventTime: '12:00', sendTime: '06:00', targets: [GROUP] })
  await flow.calendarCommand(ctx(sock, ''))
  assert.match(texts(sock), /Rapat Biasa/)
  assert.match(texts(sock), /Media/)
  sock.sent.length = 0
  await flow.calendarCommand(ctx(sock, 'minggu 1'))
  const week = texts(sock)
  assert.match(week, /Foto Kegiatan/)
  assert.doesNotMatch(week, /Rapat Biasa/)
  const sock2 = makeSock()
  await flow.calendarCommand(ctx(sock2, 'hari ini'))
  assert.match(texts(sock2), /Pengumuman Hari Ini/)
  assert.doesNotMatch(texts(sock2), /Rapat Biasa/)
})

test('scheduler mengirim sekali, mencatat status, dan tidak mengulang setelah restart', async () => {
  const now = jakartaNow()
  data.add({
    type: 'teks', title: 'Otomatis', body: 'Pesan otomatis', eventDate: now.date,
    eventTime: '08:00', sendTime: now.time, targets: [GROUP, GROUP2],
  })
  const sock = makeSock()
  const first = await tickAnnouncements(sock)
  assert.equal(first.processed, 1)
  assert.equal(sock.sent.length, 2)
  assert.equal(sock.sent[0].content.text, 'Pesan otomatis')
  assert.equal(data.latestRun('A1').status, 'sent')
  const second = await tickAnnouncements(sock)
  assert.equal(second.skipped, 1)
  assert.equal(sock.sent.length, 2)
  data.reload()
  const sock2 = makeSock()
  assert.equal((await tickAnnouncements(sock2)).skipped, 1)
  assert.equal(sock2.sent.length, 0)
})

test('scheduler memakai jalur kirim mentah agar teks tidak diubah jadi kartu', async () => {
  const now = jakartaNow()
  data.add({
    type: 'teks', title: 'Teks mentah', body: 'Isi persis', eventDate: now.date,
    eventTime: '08:00', sendTime: now.time, targets: [GROUP],
  })
  const sock = makeSock()
  sock.sendMessage = async () => { throw new Error('wrapper richui tidak boleh dipakai') }
  sock.__rawSend = async (jid, content) => {
    sock.sent.push({ jid, content })
    return { key: { id: 'raw-1' } }
  }
  await tickAnnouncements(sock)
  assert.equal(sock.sent.length, 1)
  assert.equal(sock.sent[0].content.text, 'Isi persis')
  assert.equal(data.latestRun('A1').status, 'sent')
})

test('scheduler mengirim foto sebagai image+caption dan PDF sebagai document+caption', async () => {
  const now = jakartaNow()
  const picture = media.save({ buffer: Buffer.from('png-bytes'), ext: 'png', name: 'foto.png', mime: 'image/png' })
  data.add({
    type: 'img', title: 'Foto', body: 'Caption foto', eventDate: now.date, eventTime: '08:00',
    sendTime: now.time, targets: [GROUP], media: picture,
  })
  const sock = makeSock()
  await tickAnnouncements(sock)
  const image = sock.sent.find((s) => s.content.image)
  assert.ok(image)
  assert.equal(image.content.caption, 'Caption foto')
  assert.deepEqual(image.content.image, Buffer.from('png-bytes'))

  data.add({
    type: 'img', title: 'Dokumen', body: 'Caption dokumen', eventDate: now.date, eventTime: '08:00',
    sendTime: now.time, targets: [GROUP],
    media: media.save({ buffer: Buffer.from('%PDF-1.4'), ext: 'pdf', name: 'notulen.pdf', mime: 'application/pdf' }),
  })
  await tickAnnouncements(sock)
  const doc = sock.sent.find((s) => s.content.document)
  assert.ok(doc)
  assert.equal(doc.content.caption, 'Caption dokumen')
  assert.equal(doc.content.fileName, 'notulen.pdf')
  assert.equal(data.latestRun('A2').status, 'sent')
})

test('command hanya untuk admin/owner dan sesi dua admin tidak bertabrakan', async () => {
  const sock = makeSock()
  await flow.startAdd(ctx(sock, 'pengumuman-teks', { isOwner: false, isAdmin: false }), 'pengumuman-teks')
  assert.equal(flow.sessions.size, 0)
  assert.match(texts(sock), /hanya untuk admin/)

  await flow.startAdd(ctx(sock, 'pengumuman-teks'), 'pengumuman-teks')
  await send(sock, 'Judul A')
  await flow.startAdd(ctx(sock, 'pengumuman-img', { sender: OTHER }), 'pengumuman-img')
  await send(sock, 'Judul B', { sender: OTHER })
  const first = flow.sessions.get(flow.keyOf(ctx(sock, '', { sender: ADMIN })))
  const second = flow.sessions.get(flow.keyOf(ctx(sock, '', { sender: OTHER })))
  assert.equal(first.data.title, 'Judul A')
  assert.equal(second.data.title, 'Judul B')
  assert.equal(second.type, 'img')

  await flow.startAdd(ctx(sock, 'pengumuman-img'), 'pengumuman-img')
  const replaced = flow.sessions.get(flow.keyOf(ctx(sock, '')))
  assert.equal(replaced.type, 'img')
  assert.equal(replaced.data.title, '')
  assert.equal(replaced.step, 'title')
})

test('.batal membuang sesi dan file yang belum disimpan', async () => {
  const sock = makeSock()
  const originalDownload = media.download
  media.download = async () => ({ buffer: Buffer.from('x'), ext: 'pdf', name: 'buang.pdf', mime: 'application/pdf' })
  try {
    await flow.startAdd(ctx(sock, 'pengumuman-img'), 'pengumuman-img')
    for (const step of ['Judul', 'Isi', 'senin', '21', '12', '2026', '09.00', '07.00', 'ini']) await send(sock, step)
    const file = {
      key: { id: 'file-3', fromMe: false, remoteJid: GROUP, participant: ADMIN },
      message: { documentMessage: { mimetype: 'application/pdf', fileName: 'buang.pdf', fileLength: 1 } },
    }
    await flow.passive(ctx(sock, '', { message: file, body: '' }))
    const uploaded = flow.sessions.get(flow.keyOf(ctx(sock, ''))).data.media.path
    assert.ok(fs.existsSync(path.resolve(__dirname, '..', uploaded)))
    await send(sock, '.batal')
    assert.equal(fs.existsSync(path.resolve(__dirname, '..', uploaded)), false)
    assert.equal(flow.sessions.size, 0)
    assert.equal(data.list().length, 0)
  } finally {
    media.download = originalDownload
  }
})

test('hook memulai wizard dari .add pengumuman-* dan meneruskan .add lama', async () => {
  const sock = makeSock()
  assert.equal(await flow.passive(ctx(sock, '.add pengumuman-teks')), true)
  assert.equal(flow.sessions.get(flow.keyOf(ctx(sock, ''))).type, 'teks')
  assert.match(texts(sock), /BUAT PENGUMUMAN TEKS/)
  assert.equal(await flow.passive(ctx(sock, '.add pengumuman-img')), true)
  assert.equal(flow.sessions.get(flow.keyOf(ctx(sock, ''))).type, 'img')
  // `.add <nomor>` bukan varian pengumuman: dilepas ke plugin penambah member lama.
  assert.equal(await flow.passive(ctx(sock, '.add 628123456789')), false)
  assert.equal(flow.sessions.size, 0)
})

test('admin grup (bukan owner) bisa memulai wizard lewat hook', async () => {
  const sock = makeSock()
  sock.groupMetadata = async () => ({
    participants: [{ id: ADMIN, admin: 'admin' }, { id: sock.user.id, admin: 'admin' }],
  })
  const incoming = ctx(sock, '.add pengumuman-teks', { isOwner: false })
  delete incoming.isAdmin // ctx hook bot.js memang tidak membawa isAdmin
  assert.equal(await flow.passive(incoming), true)
  assert.equal(flow.sessions.get(flow.keyOf(incoming)).type, 'teks')
  assert.match(texts(sock), /BUAT PENGUMUMAN TEKS/)
})

test('pesan dari bot sendiri tidak memicu wizard atau balasan beruntun', async () => {
  const sock = makeSock()
  const own = {
    key: { id: 'own-1', fromMe: true, remoteJid: GROUP },
    message: { conversation: '.add pengumuman-teks' },
  }
  assert.equal(await flow.passive(ctx(sock, '.add pengumuman-teks', { message: own })), false)
  assert.equal(sock.sent.length, 0)
  await flow.startAdd(ctx(sock, 'pengumuman-teks', { message: own }), 'pengumuman-teks')
  await flow.calendarCommand(ctx(sock, '', { message: own }))
  assert.equal(sock.sent.length, 0)
})
