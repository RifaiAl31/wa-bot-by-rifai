// Scheduler untuk .auto-pengumuman. Memakai loop 10 detik yang sudah ada di lib/scheduler.js,
// zona waktu Asia/Jakarta, dan klaim unik per (agenda, tanggal kegiatan, jam kirim).
'use strict'
const data = require('./autoAnnouncementData')
const { renderPoster, formatDate } = require('./autoAnnouncementPoster')
const { jakartaNow, online } = require('./announcementScheduler')

const DAYS = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']

function parseDate(value) {
  const parts = String(value || '').split('-').map(Number)
  if (parts.length !== 3 || parts.some((n) => !Number.isFinite(n))) return null
  return new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]))
}
function iso(date) { return date.toISOString().slice(0, 10) }
function addDays(value, days) {
  const d = parseDate(value)
  if (!d) return null
  d.setUTCDate(d.getUTCDate() + Number(days || 0))
  return iso(d)
}
function weekdayOf(value) {
  const d = parseDate(value)
  return d ? d.getUTCDay() : null
}

// Semua tanggal kegiatan yang mungkin jadi "hari ini": satu tanggal untuk sekali,
// atau deretan mingguan mulai dari tanggal anchor (mundur 8 minggu, maju ~2 tahun).
function eventDatesFor(row, today) {
  const anchor = row.eventDate
  if (!anchor) return []
  if (String(row.repeat || 'none') !== 'weekly') return [anchor]
  const out = []
  for (let k = -8; k <= 104; k += 1) out.push(addDays(anchor, k * 7))
  return out.filter((d) => d && weekdayOf(d) === Number(row.weekday))
}

function announcementText(row, eventDate) {
  const date = eventDate || row.eventDate
  const day = DAYS[weekdayOf(date) ?? Number(row.weekday)] || ''
  const time = row.eventTime ? ` pukul ${String(row.eventTime).replace('.', ':')} WIB` : ''
  return [
    `📢 *${row.title || 'Pengumuman'}*`,
    '',
    `${day}, ${formatDate(date).split(', ').slice(-1)[0]}${time}`,
    '',
    String(row.body || ''),
  ].join('\n')
}

function dueItems(now) {
  const due = []
  for (const row of data.list()) {
    if (Number(row.is_active) === 0) continue
    for (const eventDate of eventDatesFor(row, now.date)) {
      const sendDate = addDays(eventDate, -(Number(row.offsetDays) || 0))
      if (sendDate === now.date && row.sendTime === now.time) {
        due.push({ row, eventDate, sendDate })
      }
    }
  }
  return due
}

function buildPayloads(item) {
  const { row, eventDate } = item
  const fullText = announcementText(row, eventDate)
  const format = String(row.format || 'text')
  if (format === 'text') return [{ text: fullText }]
  const poster = renderPoster({
    title: row.title, body: row.body, eventDate,
    eventTime: row.eventTime, weekday: row.weekday,
  })
  if (format === 'poster') return [{ image: poster, caption: fullText, mimetype: 'image/png' }]
  return [
    { text: fullText },
    { image: poster, caption: `*${row.title || 'Pengumuman'}*\n${formatDate(eventDate)}`, mimetype: 'image/png' },
  ]
}

async function tickAutoAnnouncements(sock) {
  const result = { processed: 0, sent: 0, failed: 0, skipped: 0 }
  if (!online(sock)) { result.offline = true; return result }
  const now = jakartaNow()
  for (const item of dueItems(now)) {
    const { row, eventDate, sendDate } = item
    const run = data.claimRun(row.id, sendDate, row.sendTime, eventDate)
    if (!run) { result.skipped += 1; continue }
    result.processed += 1
    try {
      if (!row.targets || !row.targets.length) throw new Error('Tidak ada grup tujuan')
      const payloads = buildPayloads(item)
      const send = sock.__rawSend || sock.sendMessage
      const details = []
      for (const jid of row.targets) {
        for (const payload of payloads) {
          try {
            await send.call(sock, jid, payload)
            details.push({ jid, kind: payload.image ? 'poster' : 'teks', status: 'sent' })
          } catch (err) {
            details.push({ jid, kind: payload.image ? 'poster' : 'teks', status: 'failed', reason: err.message })
          }
        }
      }
      const allOk = details.length > 0 && details.every((d) => d.status === 'sent')
      data.finishRun(run, { status: allOk ? 'sent' : 'failed', details })
      result[allOk ? 'sent' : 'failed'] += 1
    } catch (err) {
      data.finishRun(run, { status: 'failed', details: [{ reason: err.message }] })
      result.failed += 1
      console.log('[AUTO-ANN] gagal mengirim', row.id, ':', err.message)
    }
  }
  return result
}

module.exports = {
  addDays, weekdayOf, eventDatesFor, dueItems, announcementText, buildPayloads,
  tickAutoAnnouncements,
}
