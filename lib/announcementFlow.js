// Alur wizard .add pengumuman-teks / .add pengumuman-img, kalender, dan akses admin.
// Sesi disimpan per chat|pengirim supaya dua admin tidak saling menimpa.
'use strict'
const fs = require('fs')
const path = require('path')
const data = require('./announcementData')
const media = require('./announcementMedia')
const { jakartaDate } = require('./announcementScheduler')
const { userOf } = require('./utils')

const sessions = new Map()
const PREFIX = () => String(global.__prefix || '.')
const keyOf = (ctx) => `${ctx.from || ''}|${userOf(ctx.sender)}`

const DAYS = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
const MONTHS = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
const DAY_LABELS = DAYS.map((name, i) => `${i} ${name}`).join(' / ')
const CANCEL_WORDS = new Set(['batal', 'batalkan', 'cancel', 'batal.', 'cancel.'])
const CONFIRM_WORDS = new Set(['ya', 'iya', 'y', 'yes', 'ya.', 'iya.'])

async function sendPlain(sock, jid, text, msg) {
  const send = sock?.__rawSend || sock?.sendMessage
  if (!send) return
  try {
    await send.call(sock, jid, { text: String(text) }, msg ? { quoted: msg } : undefined)
  } catch (err) {
    console.log('[ANN] gagal membalas:', err.message)
  }
}

async function canManage(ctx) {
  if (ctx.msg?.key?.fromMe) return false
  if (ctx.isOwner) return true
  if (ctx.isGroup && ctx.isAdmin === true) return true
  if (ctx.isGroup && ctx.sock?.groupMetadata && ctx.sender) {
    try {
      const { isAdmin } = await require('./utils').getGroupInfo(ctx.sock, ctx.from, ctx.sender)
      return !!isAdmin
    } catch { return false }
  }
  return false
}

function parseDay(raw) {
  const v = String(raw || '').trim().toLowerCase().replace(/\s+/g, ' ')
  const aliases = {
    minggu: 0, ahad: 0, sunday: 0, '0': 0, '7': 0,
    senin: 1, monday: 1, '1': 1,
    selasa: 2, tuesday: 2, '2': 2,
    rabu: 3, wednesday: 3, '3': 3,
    kamis: 4, thursday: 4, '4': 4,
    jumat: 5, "jum'at": 5, friday: 5, '5': 5,
    sabtu: 6, saturday: 6, '6': 6,
  }
  return Object.prototype.hasOwnProperty.call(aliases, v) ? aliases[v] : null
}

function parseMonth(raw) {
  const v = String(raw || '').trim().toLowerCase()
  const aliases = {}
  MONTHS.forEach((name, i) => {
    aliases[name.toLowerCase()] = i + 1
    aliases[name.slice(0, 3).toLowerCase()] = i + 1
    aliases[String(i + 1)] = i + 1
    aliases[String(i + 1).padStart(2, '0')] = i + 1
  })
  return Object.prototype.hasOwnProperty.call(aliases, v) ? aliases[v] : null
}

function parseTime(raw) {
  const match = /^(\d{1,2})[.:](\d{2})$/.exec(String(raw || '').trim())
  if (!match) return null
  const h = Number(match[1]); const m = Number(match[2])
  if (h > 23 || m > 59) return null
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

function weekOfMonth(dateString) {
  const day = Number(String(dateString || '').slice(8, 10))
  return day >= 1 && day <= 31 ? Math.ceil(day / 7) : 0
}

function formatEventDate(dateString) {
  const [y, m, d] = String(dateString || '').split('-').map(Number)
  if (!y || !m || !d) return '-'
  return `${d} ${MONTHS[m - 1] || m} ${y}`
}

function formatTime(value) { return String(value || '').replace(':', '.') + ' WIB' }

function cleanInput(raw) { return String(raw ?? '').replace(/^[@*_`~]+|[@*_`~]+$/g, '').trim() }

async function groupChoices(ctx) {
  let groups = []
  try {
    const list = await Promise.race([
      Promise.resolve(ctx.sock?.groupFetchAllParticipating?.() || {}),
      new Promise((resolve) => setTimeout(() => resolve(null), 5000)),
    ])
    if (list) groups = Object.values(list).filter((g) => g && g.id)
  } catch (err) {
    console.log('[ANN] daftar grup tidak tersedia:', err.message)
  }
  return groups.sort((a, b) => String(a.subject || '').localeCompare(String(b.subject || '')))
}

function resolveTargets(raw, ctx, choices) {
  const out = new Set()
  for (const part of String(raw || '').split(/[,;]+/).map((x) => x.trim()).filter(Boolean)) {
    const lower = part.toLowerCase()
    if (['ini', 'disini', 'di sini', 'here', '.'].includes(lower)) {
      if (ctx.isGroup && ctx.from) out.add(ctx.from)
      continue
    }
    if (['semua', 'all'].includes(lower)) {
      for (const g of choices) out.add(g.id)
      continue
    }
    if (/^\d+$/.test(lower)) {
      const index = Number(lower) - 1
      if (choices[index]) out.add(choices[index].id)
      continue
    }
    if (part.endsWith('@g.us')) { out.add(part); continue }
    if (/^\d{8,15}$/.test(part)) continue // nomor perorangan bukan grup tujuan
    const named = choices.find((g) => String(g.subject || '').toLowerCase() === lower)
      || choices.find((g) => String(g.subject || '').toLowerCase().includes(lower))
    if (named) out.add(named.id)
  }
  return [...out]
}

function targetsLabel(jids) {
  return jids.map((jid) => {
    return jid
  }).join(', ') || '-'
}

function previewText(session) {
  const d = session.data
  const isImage = session.type === 'img'
  return [
    'PREVIEW PENGUMUMAN',
    '',
    d.body,
    '',
    '--- Informasi (tidak ikut dikirim) ---',
    `Jenis: ${isImage ? 'Teks + media' : 'Teks'}`,
    `Judul: ${d.title}`,
    `Hari kegiatan: ${DAYS[d.weekday] || '-'}`,
    `Tanggal kegiatan: ${formatEventDate(d.eventDate)}`,
    `Jam kegiatan: ${formatTime(d.eventTime)}`,
    `Jam kirim otomatis: ${formatTime(d.sendTime)}`,
    `Grup tujuan (${d.targets.length}): ${targetsLabel(d.targets)}`,
    ...(isImage && d.media ? [`Lampiran: ${d.media.name} (${d.media.mime}, ${Math.round(d.media.size / 1024)} KB)`] : []),
    '',
    `Ketik ${PREFIX()}ya untuk menyimpan, ${PREFIX()}batal untuk membatalkan.`,
  ].join('\n')
}

function promptFor(step, session) {
  const d = session.data
  switch (step) {
    case 'title': return 'Ketik judul pengumuman.'
    case 'body': return 'Judul tersimpan.\n\nKetik isi pengumuman. Baris baru dipertahankan persis.'
    case 'day': return `Isi tersimpan.\n\nPilih hari kegiatan:\n${DAY_LABELS}`
    case 'date': return `Hari: ${DAYS[d.weekday]}.\n\nKetik tanggal kegiatan (1–31):`
    case 'month': return `Tanggal: ${d.day}.\n\nKetik bulan kegiatan (1–12 atau nama bulan):`
    case 'year': return `Bulan: ${MONTHS[d.month - 1]}.\n\nKetik tahun kegiatan (contoh 2026):`
    case 'eventTime': return `Tanggal kegiatan: ${formatEventDate(d.eventDate)} (${DAYS[d.weekday]}).\n\nKetik jam kegiatan (contoh 09.00):`
    case 'sendTime': return `Jam kegiatan: ${formatTime(d.eventTime)}.\n\nKetik jam pengiriman otomatis (contoh 07.30):`
    case 'targets': return `Jam kirim otomatis: ${formatTime(d.sendTime)}.\n\nPilih grup tujuan (pisahkan dengan koma):\n${session.choices.map((g, i) => `${i + 1}. ${g.subject || g.id} — ${g.id}`).join('\n') || '(daftar grup tidak tersedia)'}\n\nBoleh juga: ini | semua | JID grup | nama grup`
    case 'media': return 'Grup tersimpan.\n\nKirim lampiran foto (JPG/JPEG/PNG/WEBP) atau dokumen (PDF/DOC/DOCX) ke chat ini.'
    case 'confirm': return previewText(session)
    default: return 'Ketik jawaban untuk melanjutkan.'
  }
}

function newSession(ctx, type, choices) {
  return {
    chat: ctx.from, owner: userOf(ctx.sender), sender: ctx.sender, type, step: 'title',
    choices,
    data: {
      title: '', body: '', weekday: null, day: null, month: null, year: null,
      eventDate: null, eventTime: '', sendTime: '', targets: [], media: null,
    },
  }
}

async function discard(session) {
  if (session?.data?.media?.path) {
    const absolute = path.isAbsolute(session.data.media.path)
      ? session.data.media.path
      : path.join(__dirname, '..', session.data.media.path)
    try { fs.unlinkSync(absolute) } catch { /* file sudah tidak ada */ }
  }
}

async function startAdd(ctx, mode) {
  if (ctx.msg?.key?.fromMe) return
  const jid = ctx.from
  if (!(await canManage(ctx))) {
    await sendPlain(ctx.sock, jid, 'Perintah ini hanya untuk admin grup atau owner bot.', ctx.msg)
    return
  }
  const type = String(mode || '').trim().toLowerCase()
  if (!['pengumuman-teks', 'pengumuman-img'].includes(type)) {
    await sendPlain(ctx.sock, jid,
      `Contoh: ${PREFIX()}add pengumuman-teks atau ${PREFIX()}add pengumuman-img`, ctx.msg)
    return
  }
  const old = sessions.get(keyOf(ctx))
  if (old) { await discard(old); sessions.delete(keyOf(ctx)) }
  const session = newSession(ctx, type === 'pengumuman-img' ? 'img' : 'teks', [])
  sessions.set(keyOf(ctx), session)
  await sendPlain(ctx.sock, jid,
    `BUAT PENGUMUMAN ${session.type === 'img' ? 'DENGAN MEDIA' : 'TEKS'}\n\n${promptFor('title', session)}\n\nKetik ${PREFIX()}batal kapan saja untuk membatalkan.`, ctx.msg)
  // Daftar grup dimuat sekali saat sesi dibuka; dipakai pada tahap grup tujuan.
  session.choices = await groupChoices(ctx)
}

async function nextStep(ctx, session, step) {
  session.step = step
  await sendPlain(ctx.sock, ctx.from, promptFor(step, session), ctx.msg)
}

async function handleField(ctx, session, body) {
  const d = session.data
  switch (session.step) {
    case 'title': {
      const value = cleanInput(body)
      if (!value) return sendPlain(ctx.sock, ctx.from, 'Judul tidak boleh kosong. Ketik judul pengumuman:', ctx.msg)
      d.title = value
      return nextStep(ctx, session, 'body')
    }
    case 'body': {
      const value = String(body).trim()
      if (!value) return sendPlain(ctx.sock, ctx.from, 'Isi pengumuman tidak boleh kosong.', ctx.msg)
      d.body = value
      return nextStep(ctx, session, 'day')
    }
    case 'day': {
      const value = parseDay(body)
      if (value === null) return sendPlain(ctx.sock, ctx.from, `Hari tidak valid. Pilih:\n${DAY_LABELS}`, ctx.msg)
      d.weekday = value
      return nextStep(ctx, session, 'date')
    }
    case 'date': {
      const value = Number(cleanInput(body))
      if (!Number.isInteger(value) || value < 1 || value > 31) {
        return sendPlain(ctx.sock, ctx.from, 'Tanggal tidak valid. Ketik angka 1 sampai 31.', ctx.msg)
      }
      d.day = value
      return nextStep(ctx, session, 'month')
    }
    case 'month': {
      const value = parseMonth(body)
      if (value === null) return sendPlain(ctx.sock, ctx.from, 'Bulan tidak valid. Contoh: 12, Des, atau Desember.', ctx.msg)
      d.month = value
      return nextStep(ctx, session, 'year')
    }
    case 'year': {
      const year = Number(cleanInput(body))
      if (!Number.isInteger(year) || year < 2000 || year > 2100) {
        return sendPlain(ctx.sock, ctx.from, 'Tahun tidak valid. Ketik angka 2000–2100.', ctx.msg)
      }
      const parsed = new Date(Date.UTC(year, d.month - 1, d.day))
      if (parsed.getUTCFullYear() !== year || parsed.getUTCMonth() !== d.month - 1 || parsed.getUTCDate() !== d.day) {
        return sendPlain(ctx.sock, ctx.from, 'Tanggal itu tidak ada di bulan tersebut. Ketik ulang tanggal (1–31):', ctx.msg)
      }
      const actualDay = parsed.getUTCDay()
      if (actualDay !== d.weekday) {
        await sendPlain(ctx.sock, ctx.from,
          `Hari tidak cocok: ${DAYS[d.weekday]} bukan ${formatEventDate(`${year}-${String(d.month).padStart(2, '0')}-${String(d.day).padStart(2, '0')}`)} (${DAYS[actualDay]}). Ketik ulang tanggal:`, ctx.msg)
        return nextStep(ctx, session, 'date')
      }
      d.year = year
      d.eventDate = `${year}-${String(d.month).padStart(2, '0')}-${String(d.day).padStart(2, '0')}`
      d.weekday = actualDay
      return nextStep(ctx, session, 'eventTime')
    }
    case 'eventTime': {
      const value = parseTime(body)
      if (!value) return sendPlain(ctx.sock, ctx.from, 'Jam kegiatan tidak valid. Contoh: 09.00 atau 09:00.', ctx.msg)
      d.eventTime = value
      return nextStep(ctx, session, 'sendTime')
    }
    case 'sendTime': {
      const value = parseTime(body)
      if (!value) return sendPlain(ctx.sock, ctx.from, 'Jam pengiriman tidak valid. Contoh: 07.30.', ctx.msg)
      d.sendTime = value
      return nextStep(ctx, session, 'targets')
    }
    case 'targets': {
      const targets = resolveTargets(body, ctx, session.choices)
      if (!targets.length) {
        return sendPlain(ctx.sock, ctx.from,
          'Grup tujuan tidak ditemukan. Ketik nomor dari daftar, "ini", "semua", JID grup, atau nama grup.', ctx.msg)
      }
      d.targets = targets
      if (session.type === 'img') return nextStep(ctx, session, 'media')
      return nextStep(ctx, session, 'confirm')
    }
    default:
      return sendPlain(ctx.sock, ctx.from, 'Sesi tidak dikenal. Ketik ' + PREFIX() + 'batal.', ctx.msg)
  }
}

async function cancel(ctx) {
  const key = keyOf(ctx)
  const session = sessions.get(key)
  if (!session) return false
  await discard(session)
  sessions.delete(key)
  await sendPlain(ctx.sock, ctx.from, 'Proses dibatalkan. Tidak ada pengumuman yang disimpan.', ctx.msg)
  return true
}

async function commit(ctx) {
  const key = keyOf(ctx)
  const session = sessions.get(key)
  if (!session || session.step !== 'confirm') return false
  const d = session.data
  const row = data.add({
    type: session.type,
    title: d.title,
    body: d.body,
    weekday: d.weekday,
    week: weekOfMonth(d.eventDate),
    eventDate: d.eventDate,
    eventTime: d.eventTime,
    sendTime: d.sendTime,
    targets: d.targets,
    media: d.media,
    createdBy: ctx.sender,
    is_active: 1,
  })
  sessions.delete(key)
  await sendPlain(ctx.sock, ctx.from, [
    `✅ Pengumuman ${row.id} berhasil disimpan.`,
    '',
    `Jenis: ${session.type === 'img' ? 'Teks + media' : 'Teks'}`,
    `Judul: ${d.title}`,
    `Kegiatan: ${formatEventDate(d.eventDate)} pukul ${formatTime(d.eventTime)}`,
    `Kirim otomatis: ${formatEventDate(d.eventDate)} pukul ${formatTime(d.sendTime)}`,
    `Grup tujuan (${d.targets.length}): ${targetsLabel(d.targets)}`,
    ...(d.media ? [`Lampiran: ${d.media.name}`] : []),
    '',
    `Ketik ${PREFIX()}kalender untuk melihat jadwal.`,
  ].join('\n'), ctx.msg)
  return true
}

function parsePrefixed(body) {
  const prefix = PREFIX()
  if (!prefix || !body.startsWith(prefix)) return null
  const parts = body.slice(prefix.length).trim().split(/\s+/).filter(Boolean)
  return { cmd: (parts.shift() || '').toLowerCase(), args: parts }
}

async function passive(ctx) {
  if (ctx.msg?.key?.fromMe) return false
  const body = String(ctx.body || '').trim()
  const parsed = parsePrefixed(body)
  // `.add pengumuman-...` ditangani di sini supaya tidak menimpa plugin lama `.add <nomor>`.
  let addMode = parsed?.cmd === 'add' ? parsed.args.join(' ').trim() : ''
  if (!addMode && /^add\s+pengumuman-(teks|img)$/i.test(body)) addMode = body.trim().split(/\s+/).slice(1).join(' ')
  if (/^pengumuman-(teks|img)$/i.test(addMode)) {
    await startAdd(ctx, addMode)
    return true
  }
  const session = sessions.get(keyOf(ctx))
  if (!session) return false
  const normalized = body.toLowerCase().replace(/^\./, '')

  if (CANCEL_WORDS.has(normalized)) { await cancel(ctx); return true }
  if (CONFIRM_WORDS.has(normalized)) {
    if (session.step !== 'confirm') {
      await sendPlain(ctx.sock, ctx.from,
        `Konfirmasi hanya tersedia setelah preview. Selesaikan tahap ${session.step} dulu.`, ctx.msg)
      return true
    }
    await commit(ctx)
    return true
  }
  // Perintah lain tidak boleh ditelan sesi; sesi lama dibuang (lampiran ikut dihapus).
  if (parsed) {
    await discard(session)
    sessions.delete(keyOf(ctx))
    return false
  }

  if (session.step === 'media') {
    let attachment
    try { attachment = media.detectAttachment(ctx.msg) } catch (err) {
      await sendPlain(ctx.sock, ctx.from, `Lampiran ditolak: ${err.message}`, ctx.msg)
      return true
    }
    if (!attachment) {
      await sendPlain(ctx.sock, ctx.from, `Kirim file foto (${media.supportedFormats().slice(0, 4).join('/')}) atau dokumen (PDF/DOC/DOCX) ke chat ini.`, ctx.msg)
      return true
    }
    try {
      const downloaded = await media.download(ctx.msg)
      session.data.media = media.save(downloaded)
      await nextStep(ctx, session, 'confirm')
    } catch (err) {
      await sendPlain(ctx.sock, ctx.from, `Gagal menyimpan lampiran: ${err.message}`, ctx.msg)
    }
    return true
  }

  if (!body) {
    await sendPlain(ctx.sock, ctx.from, 'Ketik jawaban untuk melanjutkan, atau ' + PREFIX() + 'batal.', ctx.msg)
    return true
  }
  await handleField(ctx, session, body)
  return true
}

function parseCalendarFilter(raw) {
  const value = String(raw || '').trim().toLowerCase().replace(/\s+/g, ' ')
  if (!value) return { kind: 'all' }
  if (value === 'hari ini' || value === 'today') return { kind: 'today' }
  const match = /^(minggu|pekan)\s*([1-5])$/.exec(value)
  if (match) return { kind: 'week', week: Number(match[2]) }
  return { kind: 'invalid' }
}

function formatCalendar(rows, filter = { kind: 'all' }, sock = null) {
  const title = filter.kind === 'week'
    ? `KALENDER PENGUMUMAN — MINGGU KE-${filter.week}`
    : filter.kind === 'today' ? 'KALENDER PENGUMUMAN — HARI INI' : 'KALENDER PENGUMUMAN'
  const blocks = rows.map((row) => {
    const run = data.latestRun(row.id)
    const status = run ? ({ claimed: 'DIPROSES', sent: 'TERKIRIM', failed: 'GAGAL' }[run.status] || run.status) : 'BELUM DIKIRIM'
    const names = row.targets.map((jid) => sock?.namedGroups?.[jid]?.subject || jid)
    return [
      `${row.id} | ${row.type === 'img' ? 'Media' : 'Teks'} | ${row.is_active ? 'AKTIF' : 'NONAKTIF'}`,
      `Judul: ${row.title}`,
      `Isi: ${String(row.body || '').split('\n')[0]}`,
      `Kegiatan: ${DAYS[row.weekday]}, ${formatEventDate(row.eventDate)} pukul ${formatTime(row.eventTime)}`,
      `Kirim otomatis: ${formatTime(row.sendTime)}`,
      `Grup tujuan (${row.targets.length}): ${names.join(', ') || '-'}`,
      row.type === 'img' && row.media ? `Lampiran: ${row.media.name}` : null,
      `Status kirim: ${status}`,
    ].filter(Boolean).join('\n')
  })
  return [title, '', blocks.join('\n\n'), '', `Total: ${rows.length} pengumuman`].join('\n')
}

async function calendarCommand(ctx) {
  if (ctx.msg?.key?.fromMe) return
  if (!(await canManage(ctx))) {
    await sendPlain(ctx.sock, ctx.from, 'Perintah ini hanya untuk admin grup atau owner bot.', ctx.msg)
    return
  }
  const filter = parseCalendarFilter(ctx.text || '')
  if (filter.kind === 'invalid') {
    await sendPlain(ctx.sock, ctx.from,
      `Contoh: ${PREFIX()}kalender, ${PREFIX()}kalender minggu 1, atau ${PREFIX()}kalender hari ini`, ctx.msg)
    return
  }
  const today = jakartaDate()
  const rows = data.list().filter((row) => {
    if (filter.kind === 'week') return weekOfMonth(row.eventDate) === filter.week
    if (filter.kind === 'today') return row.eventDate === today
    return true
  })
  const choices = await groupChoices(ctx)
  const namedGroups = Object.fromEntries(choices.map((g) => [g.id, g]))
  await sendPlain(ctx.sock, ctx.from, formatCalendar(rows, filter, { namedGroups }), ctx.msg)
}

// Ekspor untuk test dan modul lain.
module.exports = {
  sessions, keyOf, canManage, sendPlain, parseDay, parseMonth, parseTime, weekOfMonth,
  formatEventDate, formatTime, resolveTargets, parseCalendarFilter, formatCalendar,
  startAdd, passive, cancel, commit, calendarCommand, promptFor, clearSession: (ctx) => {
    const session = sessions.get(keyOf(ctx))
    if (session) { discard(session); sessions.delete(keyOf(ctx)) }
  },
}
