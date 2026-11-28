// Mesin tanggal pengumuman: satu sumber perhitungan untuk scheduler, preview, dan kalender.
// Semua tanggal diproses sebagai UTC "hari" (YYYY-MM-DD) agar aman lintas bulan/tahun
// dan tidak terpengaruh offset lokal. Tampilan selalu Asia/Jakarta.
'use strict'
const HARI = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
const BULAN = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']

function parseDay(value) {
  const s = String(value || '')
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return null
  const [y, m, d] = s.split('-').map(Number)
  const dt = new Date(Date.UTC(y, m - 1, d))
  if (dt.getUTCFullYear() !== y || dt.getUTCMonth() !== m - 1 || dt.getUTCDate() !== d) return null
  return dt
}
function iso(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return null
  return date.toISOString().slice(0, 10)
}
function addDays(value, days) {
  const dt = parseDay(value)
  if (!dt) return null
  dt.setUTCDate(dt.getUTCDate() + Number(days || 0))
  return iso(dt)
}
function weekdayOf(value) {
  const dt = parseDay(value)
  return dt ? dt.getUTCDay() : null
}
function isRecurring(repeat) {
  return repeat === 'weekly' || repeat === 'forever'
}
function nextWeekdayOnOrAfter(from, weekday) {
  const start = parseDay(from)
  if (!start) return null
  for (let i = 0; i < 14; i += 1) {
    const candidate = iso(start)
    if (weekdayOf(candidate) === Number(weekday)) return candidate
    start.setUTCDate(start.getUTCDate() + 1)
  }
  return null
}

// Tanggal kegiatan berikutnya yang belum lewat (atau tanggal mulai jika di masa depan).
function nextEventDate(row, from) {
  if (!row) return null
  const start = row.startDate || row.eventDate
  if (!start) return null
  if (!isRecurring(row.repeat)) return start >= from ? start : null
  const base = start > from ? start : from
  return nextWeekdayOnOrAfter(base, row.weekday)
}
function nextSend(row, from) {
  const eventDate = nextEventDate(row, from)
  if (!eventDate) return null
  const sendDate = addDays(eventDate, -(Number(row.offsetDays) || 0))
  const sendTime = String(row.sendTime || '19:00').replace('.', ':')
  return { eventDate, sendDate, sendTime, at: `${sendDate}T${sendTime}:00` }
}

// Kejadian terakhir yang jatuh pada/sebelum 'from' — dipakai scheduler untuk mendeteksi
// jadwal yang lewat tanpa menunggu siklus mingguan berikutnya.
function lastSend(row, from) {
  if (!row) return null
  const start = row.startDate || row.eventDate
  if (!start || start > from) return null
  const dt = parseDay(from)
  if (!dt) return null
  for (let i = 0; i < 14; i += 1) {
    const candidate = iso(dt)
    if (candidate >= start && weekdayOf(candidate) === Number(row.weekday)) {
      return {
        eventDate: candidate,
        sendDate: addDays(candidate, -(Number(row.offsetDays) || 0)),
        sendTime: String(row.sendTime || '19:00').replace('.', ':'),
      }
    }
    dt.setUTCDate(dt.getUTCDate() - 1)
  }
  return null
}

// Deretan kejadian untuk kalender. Tidak mengirim apa pun — hanya hitung tanggal.
function occurrences(row, from, weeks = 2) {
  if (!row || !isRecurring(row.repeat)) {
    const once = nextSend(row, from)
    return once ? [once] : []
  }
  const out = []
  let cursor = from
  for (let i = 0; i < weeks * 7 + 7 && out.length < weeks * 3 + 3; i += 1) {
    const next = nextSend({ ...row, startDate: row.startDate || row.eventDate }, cursor)
    if (!next || next.sendDate > addDays(from, weeks * 7)) break
    if (!out.length || out[out.length - 1].sendDate !== next.sendDate) out.push(next)
    cursor = addDays(next.sendDate, 1)
  }
  return out
}

function formatIndonesian(value) {
  const dt = parseDay(value)
  if (!dt) return '-'
  return `${HARI[dt.getUTCDay()]}, ${dt.getUTCDate()} ${BULAN[dt.getUTCMonth()]} ${dt.getUTCFullYear()}`
}
function announcementText(row, eventDate) {
  const date = eventDate || nextEventDate(row, String(row.eventDate || row.startDate || '').slice(0, 10)) || row.eventDate
  const day = HARI[weekdayOf(date) ?? Number(row.weekday)] || ''
  const time = row.eventTime ? ` pukul ${String(row.eventTime).replace('.', ':')} WIB` : ''
  const location = row.location ? `\nLokasi: ${String(row.location).trim()}` : ''
  const pretty = parseDay(date)
  const prettyText = pretty
    ? `${day}, ${pretty.getUTCDate()} ${BULAN[pretty.getUTCMonth()]} ${pretty.getUTCFullYear()}`
    : (date || '-')
  return [
    `📢 *${row.title || row.name || 'Pengumuman'}*`,
    '',
    `${prettyText}${time}${location}`,
    '',
    String(row.body || ''),
  ].join('\n')
}

module.exports = {
  HARI, BULAN, parseDay, iso, addDays, weekdayOf, isRecurring,
  nextWeekdayOnOrAfter, nextEventDate, nextSend, lastSend, occurrences,
  formatIndonesian, announcementText,
}
