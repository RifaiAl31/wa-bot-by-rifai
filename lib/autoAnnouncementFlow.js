// Wizard .auto-pengumuman. Jawaban pesan biasa diterima lewat hook passive,
// sesi dipisah per chat|pengirim supaya dua admin tidak tertukar.
'use strict'
const data = require('./autoAnnouncementData')
const { jakartaNow } = require('./announcementScheduler')
const { addDays, weekdayOf } = require('./autoAnnouncementScheduler')
const {
  sendPlain, parseDay, parseMonth, parseTime, formatEventDate, formatTime,
} = require('./announcementFlow')
const { userOf } = require('./utils')

const sessions = new Map()
const PREFIX = () => String(global.__prefix || '.')
const keyOf = (ctx) => `${ctx.from || ''}|${userOf(ctx.sender)}`
const DAYS = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
const DAY_LABELS = DAYS.map((name, i) => `${i} ${name}`).join(' / ')
const CANCEL = new Set(['batal', 'batalkan', 'cancel'])
const CONFIRM = new Set(['ya', 'iya', 'y', 'yes', 'simpan', 'oke', 'ok'])
const TTL_MS = 45 * 60 * 1000
const STEPS = ['day', 'date', 'title', 'body', 'eventTime', 'offset', 'sendTime', 'repeat', 'format', 'targets', 'confirm']

function cleanInput(raw) { return String(raw ?? '').replace(/^[@*_`~]+|[@*_`~]+$/g, '').trim() }

function parsePrefixed(body) {
  const prefix = PREFIX()
  if (!prefix || !body.startsWith(prefix)) return null
  const parts = body.slice(prefix.length).trim().split(/\s+/).filter(Boolean)
  return { cmd: (parts.shift() || '').toLowerCase(), args: parts }
}

function newSession(ctx, prefill = {}) {
  return {
    chat: ctx.from, owner: userOf(ctx.sender), sender: ctx.sender,
    step: 'day', touchedAt: Date.now(), choices: [],
    data: Object.assign({
      title: '', body: '', weekday: null, day: null, month: null, year: null,
      eventDate: null, eventTime: '', location: '', offsetDays: 0, sendTime: '08:00',
      repeat: 'none', format: 'text', targets: [], noteId: null,
      mode: 'relative', scheduleAt: null,
    }, prefill),
  }
}

function sweep() {
  for (const [key, session] of sessions) {
    if (Date.now() - session.touchedAt > TTL_MS) sessions.delete(key)
  }
}

async function groupChoices(ctx) {
  let groups = []
  try {
    const list = await Promise.race([
      Promise.resolve(ctx.sock?.groupFetchAllParticipating?.() || {}),
      new Promise((resolve) => setTimeout(() => resolve(null), 5000)),
    ])
    if (list) groups = Object.values(list).filter((g) => g && g.id)
  } catch (err) {
    console.log('[AUTO-ANN] daftar grup tidak tersedia:', err.message)
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
    if (['semua', 'all'].includes(lower)) { for (const g of choices) out.add(g.id); continue }
    if (/^\d+$/.test(lower)) {
      const index = Number(lower) - 1
      if (choices[index]) out.add(choices[index].id)
      continue
    }
    if (part.endsWith('@g.us')) { out.add(part); continue }
    const named = choices.find((g) => String(g.subject || '').toLowerCase() === lower)
      || choices.find((g) => String(g.subject || '').toLowerCase().includes(lower))
    if (named) out.add(named.id)
  }
  return [...out]
}

const targetsLabel = (jids) => jids.join(', ') || '-'
const repeatLabel = (v) => (String(v) === 'weekly' ? 'Setiap minggu' : 'Sekali')
const formatLabel = (v) => ({ text: 'Teks saja', poster: 'Poster saja', both: 'Teks + poster' }[v] || '-')
const offsetLabel = (v) => ({ 7: '7 hari sebelum', 1: '1 hari sebelum', 0: 'Pada hari kegiatan' }[Number(v)] || '-')

function preview(session) {
  const d = session.data
  return [
    'PREVIEW AUTO PENGUMUMAN',
    '',
    `*${d.title}*`,
    '',
    String(d.body || ''),
    '',
    '--- Detail (tidak ikut dikirim) ---',
    `Hari kegiatan: ${DAYS[d.weekday] ?? '-'}`,
    `Tanggal kegiatan: ${formatEventDate(d.eventDate)}`,
    `Jam kegiatan: ${d.eventTime ? formatTime(d.eventTime) : '-'}`,
    `Lokasi: ${d.location || '-'}`,
    `Pengulangan: ${repeatLabel(d.repeat)}`,
    `Kirim: ${offsetLabel(d.offsetDays)} pukul ${formatTime(d.sendTime)}`,
    `Format: ${formatLabel(d.format)}`,
    `Grup tujuan (${d.targets.length}): ${targetsLabel(d.targets)}`,
    ...(d.noteId ? [`Sumber catatan: ${d.noteId}`] : []),
    '',
    `Ketik ${PREFIX()}ya untuk menyimpan, ${PREFIX()}batal untuk membatalkan, atau ${PREFIX()}edit <field> <nilai>.`,
  ].join('\n')
}

function promptFor(step, session) {
  const d = session.data
  switch (step) {
    case 'day': return `1/7. Pilih hari kegiatan:\n${DAY_LABELS}`
    case 'date': return `Hari: ${DAYS[d.weekday]}.\n\n2/7. Tanggal kegiatan pertama (1–31, atau ketik *depan* untuk hari ${DAYS[d.weekday]} terdekat):`
    case 'title': return `Tanggal kegiatan: ${formatEventDate(d.eventDate)}.\n\n3/7. Ketik judul pengumuman.`
    case 'body': return 'Judul tersimpan.\n\n4/7. Ketik isi pengumuman. Baris baru dipertahankan.'
    case 'eventTime': return 'Isi tersimpan.\n\n5/7. Jam kegiatan (contoh 09.00; ketik - bila tidak ada):'
    case 'offset': return `Jam kegiatan: ${d.eventTime ? formatTime(d.eventTime) : '-'}.\n\n6/7. Kapan pengumuman dikirim?\n1 = 7 hari sebelum kegiatan\n2 = 1 hari sebelum kegiatan\n3 = pada hari kegiatan`
    case 'sendTime': return `Pengiriman: ${offsetLabel(d.offsetDays)}.\n\n7/7. Jam pengiriman (contoh 17.00):`
    case 'repeat': return `Jam kirim: ${formatTime(d.sendTime)}.\n\n8/7. Pengulangan:\n1 = sekali saja\n2 = setiap minggu`
    case 'format': return `Pengulangan: ${repeatLabel(d.repeat)}.\n\n9/7. Format pengiriman:\n1 = Teks saja\n2 = Poster saja\n3 = Teks + poster`
    case 'targets': return `Format: ${formatLabel(d.format)}.\n\n10/7. Grup tujuan (pisahkan dengan koma):\n${session.choices.map((g, i) => `${i + 1}. ${g.subject || g.id}`).join('\n') || '(daftar grup tidak tersedia)'}\n\nBoleh juga: ini | semua | JID grup | nama grup`
    case 'confirm': return preview(session)
    default: return 'Ketik jawaban untuk melanjutkan.'
  }
}

async function nextStep(ctx, session, step) {
  session.step = step
  session.touchedAt = Date.now()
  await sendPlain(ctx.sock, ctx.from, promptFor(step, session), ctx.msg)
}

async function startAdd(ctx, prefill = {}) {
  if (ctx.msg?.key?.fromMe) return
  const old = sessions.get(keyOf(ctx))
  if (old) sessions.delete(keyOf(ctx))
  const session = newSession(ctx, prefill)
  sessions.set(keyOf(ctx), session)
  session.choices = await groupChoices(ctx)
  const opening = prefill.title
    ? `BUAT PENGUMUMAN DARI CATATAN\n\nData dari arsatan sudah terisi. ${promptFor('day', session)}`
    : `BUAT AGENDA PENGUMUMAN\n\n${promptFor('day', session)}`
  await sendPlain(ctx.sock, ctx.from, `${opening}\n\nKetik ${PREFIX()}batal kapan saja.`, ctx.msg)
}

// Dipakai .catatan pengumuman: judul & isi sudah diambil dari arsip, tidak perlu diketik ulang.
async function startFromNote(ctx, { title, body, noteId }) {
  return startAdd(ctx, { title: String(title || '').slice(0, 120), body: String(body || ''), noteId })
}

function setDate(session, yyyy, mm, dd) {
  const parsed = new Date(Date.UTC(yyyy, mm - 1, dd))
  if (parsed.getUTCFullYear() !== yyyy || parsed.getUTCMonth() !== mm - 1 || parsed.getUTCDate() !== dd) return false
  session.data.year = yyyy
  session.data.month = mm
  session.data.day = dd
  session.data.eventDate = `${yyyy}-${String(mm).padStart(2, '0')}-${String(dd).padStart(2, '0')}`
  return true
}

function nextWeekdayDate(weekday) {
  const today = jakartaNow().date
  for (let i = 1; i <= 14; i += 1) {
    const candidate = addDays(today, i)
    if (weekdayOf(candidate) === weekday) return candidate
  }
  return null
}

async function handleField(ctx, session, raw) {
  const d = session.data
  const body = String(raw ?? '').trim()
  switch (session.step) {
    case 'day': {
      const value = parseDay(body)
      if (value === null) return sendPlain(ctx.sock, ctx.from, `Hari tidak valid. Pilih:\n${DAY_LABELS}`, ctx.msg)
      d.weekday = value
      return nextStep(ctx, session, 'date')
    }
    case 'date': {
      const lower = body.toLowerCase()
      if (lower === 'depan' || lower === 'next') {
        const candidate = nextWeekdayDate(d.weekday)
        if (!candidate) return sendPlain(ctx.sock, ctx.from, 'Tanggal tidak ditemukan. Ketik angka 1–31.', ctx.msg)
        const [y, m, day] = candidate.split('-').map(Number)
        setDate(session, y, m, day)
        return nextStep(ctx, session, d.title ? (d.body ? 'eventTime' : 'body') : 'title')
      }
      const value = Number(cleanInput(body))
      if (!Number.isInteger(value) || value < 1 || value > 31) {
        return sendPlain(ctx.sock, ctx.from, 'Tanggal tidak valid. Ketik angka 1–31 atau "depan".', ctx.msg)
      }
      const now = jakartaNow()
      let found = null
      for (let i = 0; i < 3; i += 1) {
        const base = new Date(Date.UTC(now.year, now.month - 1 + i, 1))
        const y = base.getUTCFullYear()
        const m = base.getUTCMonth() + 1
        const candidate = `${y}-${String(m).padStart(2, '0')}-${String(value).padStart(2, '0')}`
        if (weekdayOf(candidate) === d.weekday && candidate >= now.date) { found = { y, m }; break }
      }
      if (!found) {
        return sendPlain(ctx.sock, ctx.from,
          `Tanggal ${value} dengan hari ${DAYS[d.weekday]} tidak ditemukan dalam 3 bulan ke depan. Coba "depan".`, ctx.msg)
      }
      if (!setDate(session, found.y, found.m, value)) {
        return sendPlain(ctx.sock, ctx.from, 'Tanggal itu tidak ada di bulan tersebut. Coba lagi.', ctx.msg)
      }
      return nextStep(ctx, session, d.title ? (d.body ? 'eventTime' : 'body') : 'title')
    }
    case 'title': {
      const value = cleanInput(body)
      if (!value) return sendPlain(ctx.sock, ctx.from, 'Judul tidak boleh kosong.', ctx.msg)
      d.title = value
      return nextStep(ctx, session, 'body')
    }
    case 'body': {
      if (!body) return sendPlain(ctx.sock, ctx.from, 'Isi pengumuman tidak boleh kosong.', ctx.msg)
      d.body = body
      return nextStep(ctx, session, 'eventTime')
    }
    case 'eventTime': {
      if (body !== '-' && !parseTime(body)) return sendPlain(ctx.sock, ctx.from, 'Jam tidak valid. Contoh: 09.00 atau -.', ctx.msg)
      d.eventTime = body === '-' ? '' : parseTime(body)
      return nextStep(ctx, session, 'offset')
    }
    case 'offset': {
      const map = { 1: 7, 2: 1, 3: 0 }
      if (!(body in map)) return sendPlain(ctx.sock, ctx.from, 'Pilih 1, 2, atau 3.', ctx.msg)
      d.offsetDays = map[body]
      return nextStep(ctx, session, 'sendTime')
    }
    case 'sendTime': {
      const value = parseTime(body)
      if (!value) return sendPlain(ctx.sock, ctx.from, 'Jam kirim tidak valid. Contoh: 17.00.', ctx.msg)
      d.sendTime = value
      return nextStep(ctx, session, 'repeat')
    }
    case 'repeat': {
      if (!['1', '2'].includes(body)) return sendPlain(ctx.sock, ctx.from, 'Pilih 1 (sekali) atau 2 (setiap minggu).', ctx.msg)
      d.repeat = body === '2' ? 'weekly' : 'none'
      return nextStep(ctx, session, 'format')
    }
    case 'format': {
      const map = { 1: 'text', 2: 'poster', 3: 'both' }
      if (!(body in map)) return sendPlain(ctx.sock, ctx.from, 'Pilih 1 (teks), 2 (poster), atau 3 (teks + poster).', ctx.msg)
      d.format = map[body]
      return nextStep(ctx, session, 'targets')
    }
    case 'targets': {
      const targets = resolveTargets(body, ctx, session.choices)
      if (!targets.length) {
        return sendPlain(ctx.sock, ctx.from,
          'Grup tujuan tidak ditemukan. Ketik nomor daftar, "ini", "semua", JID grup, atau nama grup.', ctx.msg)
      }
      d.targets = targets
      return nextStep(ctx, session, 'confirm')
    }
    default:
      return sendPlain(ctx.sock, ctx.from, `Sesi tidak dikenal. Ketik ${PREFIX()}batal.`, ctx.msg)
  }
}

const EDIT_FIELDS = {
  judul: 'title', isi: 'body', jam: 'eventTime', kirim: 'sendTime',
  format: 'format', grup: 'targets', ulang: 'repeat',
}

async function applyEdit(ctx, session, raw) {
  const match = /^edit(?:\s+(\S+)(?:\s+([\s\S]+))?)?$/i.exec(String(raw || '').trim())
  if (!match) return false
  const field = match[1] ? match[1].toLowerCase() : ''
  if (!field) {
    await sendPlain(ctx.sock, ctx.from,
      `Edit: ${PREFIX()}edit judul <teks> | isi <teks> | jam HH.mm | kirim HH.mm | format 1/2/3 | ulang 1/2 | grup <nomor/ini/semua>`, ctx.msg)
    return true
  }
  const value = String(match[2] || '').trim()
  if (!value) {
    await sendPlain(ctx.sock, ctx.from, `Nilai edit tidak boleh kosong. Contoh: ${PREFIX()}edit judul Pengajian Akbar`, ctx.msg)
    return true
  }
  const d = session.data
  if (field === 'judul') d.title = cleanInput(value)
  else if (field === 'isi') d.body = value
  else if (field === 'jam' || field === 'kirim') {
    const time = parseTime(value)
    if (!time) { await sendPlain(ctx.sock, ctx.from, 'Jam tidak valid. Contoh: 17.00', ctx.msg); return true }
    if (field === 'jam') d.eventTime = time; else d.sendTime = time
  } else if (field === 'format') {
    const map = { 1: 'text', 2: 'poster', 3: 'both' }
    if (!(value in map)) { await sendPlain(ctx.sock, ctx.from, 'Pilih 1, 2, atau 3.', ctx.msg); return true }
    d.format = map[value]
  } else if (field === 'ulang') {
    if (!['1', '2'].includes(value)) { await sendPlain(ctx.sock, ctx.from, 'Pilih 1 atau 2.', ctx.msg); return true }
    d.repeat = value === '2' ? 'weekly' : 'none'
  } else if (field === 'grup') {
    const targets = resolveTargets(value, ctx, session.choices)
    if (!targets.length) { await sendPlain(ctx.sock, ctx.from, 'Grup tidak ditemukan.', ctx.msg); return true }
    d.targets = targets
  } else if (field === 'tanggal') {
    const parts = value.split(/[-/]/).map(Number)
    if (parts.length !== 3 || !setDate(session, parts[0], parts[1], parts[2])) {
      await sendPlain(ctx.sock, ctx.from, 'Tanggal tidak valid. Format: YYYY-MM-DD', ctx.msg)
      return true
    }
  } else {
    await sendPlain(ctx.sock, ctx.from, `Field "${field}" tidak bisa diedit.`, ctx.msg)
    return true
  }
  session.touchedAt = Date.now()
  await sendPlain(ctx.sock, ctx.from, `Perubahan tersimpan.\n\n${preview(session)}`, ctx.msg)
  return true
}

async function cancel(ctx) {
  const key = keyOf(ctx)
  if (!sessions.has(key)) return false
  sessions.delete(key)
  await sendPlain(ctx.sock, ctx.from, 'Wizard dibatalkan. Tidak ada agenda yang disimpan.', ctx.msg)
  return true
}

function commit(ctx) {
  const key = keyOf(ctx)
  const session = sessions.get(key)
  if (!session || session.step !== 'confirm') return false
  const d = session.data
  const row = data.add({
    title: d.title, body: d.body, weekday: d.weekday, eventDate: d.eventDate,
    eventTime: d.eventTime, repeat: d.repeat, offsetDays: d.offsetDays,
    sendTime: d.sendTime, format: d.format, targets: d.targets, location: d.location || '',
    createdBy: ctx.sender, is_active: 1, noteId: d.noteId,
    status: 'active', mode: 'relative', scheduleAt: null,
  })
  sessions.delete(key)
  sendPlain(ctx.sock, ctx.from, [
    `✅ Agenda ${row.id} berhasil disimpan.`,
    '',
    `Judul: ${row.title}`,
    `Kegiatan: ${formatEventDate(row.eventDate)}${row.eventTime ? ` pukul ${formatTime(row.eventTime)}` : ''}`,
    `Pengiriman: ${offsetLabel(row.offsetDays)} pukul ${formatTime(row.sendTime)} (${repeatLabel(row.repeat)})`,
    `Format: ${formatLabel(row.format)}`,
    `Grup tujuan (${row.targets.length}): ${targetsLabel(row.targets)}`,
  ].join('\n'), ctx.msg)
  return true
}

async function passive(ctx) {
  if (ctx.msg?.key?.fromMe) return false
  sweep()
  const key = keyOf(ctx)
  const session = sessions.get(key)
  const body = String(ctx.body || '').trim()
  const parsed = parsePrefixed(body)
  const normalized = body.toLowerCase().replace(/^\./, '').trim()

  if (!session) {
    if (parsed && parsed.cmd === 'auto-pengumuman' && parsed.args[0]?.toLowerCase() === 'tambah') {
      await startAdd(ctx)
      return true
    }
    return false
  }
  if (CANCEL.has(normalized) || (parsed && ['batal', 'cancel'].includes(parsed.cmd))) {
    await cancel(ctx)
    return true
  }
  if (CONFIRM.has(normalized) || (parsed && ['ya', 'y', 'simpan'].includes(parsed.cmd))) {
    if (session.step !== 'confirm') {
      await sendPlain(ctx.sock, ctx.from, `Konfirmasi hanya setelah preview. Lanjutkan tahap ${session.step} dulu.`, ctx.msg)
      return true
    }
    commit(ctx)
    return true
  }
  if (/^edit\b/i.test(body)) return applyEdit(ctx, session, body)
  // Perintah lain tidak boleh ditelan sesi lama.
  if (parsed) { sessions.delete(key); return false }
  if (!body) {
    await sendPlain(ctx.sock, ctx.from, 'Ketik jawaban untuk melanjutkan atau .batal.', ctx.msg)
    return true
  }
  await handleField(ctx, session, body)
  return true
}

function clearSession(ctx) { sessions.delete(keyOf(ctx)) }

function formatRow(row, sock) {
  const latest = data.latestRun(row.id)
  const stateStatus = row.status === 'draft' ? 'DRAFT'
    : (row.status === 'paused' || Number(row.is_active) === 0) ? 'PAUSE' : ''
  const status = stateStatus || (latest ? ({ claimed: 'DIPROSES', sent: 'TERKIRIM', failed: 'GAGAL' }[latest.status] || latest.status) : 'BELUM DIKIRIM')
  return [
    `${row.id} | ${row.is_active ? 'AKTIF' : 'PAUSE'} | ${formatLabel(row.format)}`,
    `Judul: ${row.title}`,
    `Isi: ${String(row.body || '').split('\n')[0]}`,
    `Kegiatan: ${DAYS[row.weekday]}, ${formatEventDate(row.eventDate)}${row.eventTime ? ` pukul ${formatTime(row.eventTime)}` : ''}`,
    ...(row.location ? [`Lokasi: ${row.location}`] : []),
    `Kirim: ${offsetLabel(row.offsetDays)} pukul ${formatTime(row.sendTime)} (${repeatLabel(row.repeat)})`,
    `Grup (${row.targets.length}): ${row.targets.map((jid) => sock?.namedGroups?.[jid]?.subject || jid).join(', ') || '-'}`,
    `Status: ${status}`,
    ...(row.noteId ? [`Sumber: ${row.noteId}`] : []),
  ].join('\n')
}

module.exports = {
  sessions, keyOf, STEPS, EDIT_FIELDS, sendPlain, parseDay, parseTime, resolveTargets,
  startAdd, startFromNote, passive, cancel, commit, clearSession, formatRow, preview, promptFor,
}
