// Scheduler untuk .auto-pengumuman + dashboard web. Memakai loop 10 detik yang sudah ada
// di lib/scheduler.js, zona waktu Asia/Jakarta, dan klaim unik per pengiriman (anti-double).
'use strict'
const fs = require('fs')
const path = require('path')
const data = require('./autoAnnouncementData')
const { renderPoster, formatDate } = require('./autoAnnouncementPoster')
const { jakartaNow, online } = require('./announcementScheduler')

const ROOT = path.join(__dirname, '..')
const DAYS = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
const MAX_IMAGE_BYTES = (Number(process.env.AUTO_ANNOUNCEMENT_IMAGE_MAX_MB) || 10) * 1024 * 1024
const MIME_BY_EXT = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp' }
const inflight = new Set()

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
  const date = eventDate || row.eventDate || (row.scheduleAt ? String(row.scheduleAt).slice(0, 10) : null)
  const day = DAYS[weekdayOf(date) ?? Number(row.weekday)] || ''
  const time = row.eventTime ? ` pukul ${String(row.eventTime).replace('.', ':')} WIB` : ''
  const location = row.location ? `\nLokasi: ${String(row.location).trim()}` : ''
  return [
    `📢 *${row.title || 'Pengumuman'}*`,
    '',
    `${day}, ${formatDate(date).split(', ').slice(-1)[0]}${time}${location}`,
    '',
    String(row.body || ''),
  ].join('\n')
}

function readUploadedImage(imagePath) {
  if (!imagePath) return null
  const absolute = path.resolve(ROOT, String(imagePath))
  if (absolute !== ROOT && !absolute.startsWith(ROOT + path.sep)) return null
  try {
    const stat = fs.statSync(absolute)
    if (!stat.isFile() || stat.size > MAX_IMAGE_BYTES) return null
    const ext = String(path.extname(absolute).toLowerCase()).replace(/^\./, '')
    if (!MIME_BY_EXT[ext]) return null
    return { buffer: fs.readFileSync(absolute), mimetype: MIME_BY_EXT[ext] }
  } catch {
    return null
  }
}

function buildPayloads(item) {
  const { row, eventDate } = item
  const fullText = announcementText(row, eventDate)
  const format = String(row.format || 'text')
  const image = readUploadedImage(row.imagePath)
  if (format === 'text') return [{ text: fullText }]
  if (image) {
    const posterPayload = { image: image.buffer, caption: fullText, mimetype: image.mimetype }
    if (format === 'poster') return [posterPayload]
    return [{ text: fullText }, {
      image: image.buffer,
      caption: `*${row.title || 'Pengumuman'}*\n${formatDate(eventDate || row.eventDate)}`,
      mimetype: image.mimetype,
    }]
  }
  const poster = renderPoster({
    title: row.title, body: row.body, eventDate,
    eventTime: row.eventTime, weekday: row.weekday,
  })
  if (format === 'poster') return [{ image: poster, caption: fullText, mimetype: 'image/png' }]
  return [
    { text: fullText },
    { image: poster, caption: `*${row.title || 'Pengumuman'}*\n${formatDate(eventDate || row.eventDate)}`, mimetype: 'image/png' },
  ]
}

function dueOnce(now) {
  const due = []
  for (const row of data.list()) {
    if (Number(row.is_active) === 0 || row.status === 'draft' || row.mode !== 'once') continue
    const at = String(row.scheduleAt || '')
    const sendDate = at.slice(0, 10)
    const sendTime = at.slice(11, 16)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(sendDate) || !/^\d{2}:\d{2}$/.test(sendTime)) continue
    if (sendDate < now.date || (sendDate === now.date && sendTime <= now.time)) {
      due.push({ row, eventDate: row.eventDate || sendDate, sendDate, sendTime })
    }
  }
  return due
}

function dueItems(now) {
  const due = dueOnce(now)
  for (const row of data.list()) {
    if (Number(row.is_active) === 0 || row.status === 'draft' || row.mode === 'once') continue
    for (const eventDate of eventDatesFor(row, now.date)) {
      const sendDate = addDays(eventDate, -(Number(row.offsetDays) || 0))
      if (sendDate === now.date && row.sendTime === now.time) {
        due.push({ row, eventDate, sendDate, sendTime: row.sendTime })
      }
    }
  }
  return due
}

// Satu jalur pengiriman untuk scheduler, kirim-manual, dan retry. Tidak memakai richui:
// pesan pengumuman harus tetap teks/gambar apa adanya.
async function sendAnnouncement(sock, item, run) {
  const { row, eventDate } = item
  if (inflight.has(run.key)) return { skipped: true, status: 'claimed', details: [] }
  inflight.add(run.key)
  const details = []
  try {
    if (!row.targets || !row.targets.length) throw new Error('Tidak ada grup tujuan')
    const payloads = buildPayloads(item)
    const send = sock.__rawSend || sock.sendMessage
    for (const jid of row.targets) {
      for (const payload of payloads) {
        try {
          await send.call(sock, jid, payload)
          details.push({ jid, kind: payload.image ? 'gambar' : 'teks', status: 'sent' })
        } catch (err) {
          details.push({ jid, kind: payload.image ? 'gambar' : 'teks', status: 'failed', reason: err.message })
        }
      }
    }
    const allOk = details.length > 0 && details.every((d) => d.status === 'sent')
    data.finishRun(run, { status: allOk ? 'sent' : 'failed', details })
    if (allOk && row.mode === 'once') data.update(row.id, { status: 'sent', is_active: 0 })
    return { status: allOk ? 'sent' : 'failed', details }
  } catch (err) {
    data.finishRun(run, { status: 'failed', details: [{ reason: err.message }] })
    return { status: 'failed', details: [{ reason: err.message }] }
  } finally {
    inflight.delete(run.key)
  }
}

async function tickAutoAnnouncements(sock) {
  const result = { processed: 0, sent: 0, failed: 0, skipped: 0 }
  if (!online(sock)) { result.offline = true; return result }
  const now = jakartaNow()
  for (const item of dueItems(now)) {
    const { row, eventDate, sendDate, sendTime } = item
    // Jangan klaim bila WhatsApp putus di tengah tick.
    if (!online(sock)) { result.offline = true; break }
    const run = data.claimRun(row.id, sendDate, sendTime, eventDate, {
      kind: 'scheduled', scheduleAt: row.mode === 'once' ? row.scheduleAt : null,
    })
    if (!run) { result.skipped += 1; continue }
    result.processed += 1
    const outcome = await sendAnnouncement(sock, item, run)
    if (outcome.skipped) result.skipped += 1
    else result[outcome.status === 'sent' ? 'sent' : 'failed'] += 1
    if (outcome.status === 'failed') console.log('[AUTO-ANN] gagal mengirim', row.id)
  }
  return result
}

async function manualSend(sock, id, actor = null) {
  if (!online(sock)) return { error: 'WhatsApp sedang terputus. Pengiriman dibatalkan (tidak ada jadwal yang diklaim).', offline: true }
  const row = data.get(id)
  if (!row) return { error: 'Pengumuman tidak ditemukan.' }
  if (!row.targets || !row.targets.length) return { error: 'Belum ada grup tujuan.' }
  const stamp = new Date().toISOString()
  const run = data.claimUnique(`manual|${row.id}|${stamp}|${Math.random().toString(36).slice(2, 8)}`, {
    id: row.id, sendDate: jakartaNow().date, sendTime: jakartaNow().time,
    eventDate: row.eventDate, kind: 'manual', actor,
  })
  if (!run) return { error: 'Pengiriman sudah diproses.' }
  const outcome = await sendAnnouncement(sock, { row, eventDate: row.eventDate }, run)
  return { run: data.findRun(run.key), status: outcome.status }
}

async function retrySend(sock, runKey, actor = null) {
  if (!online(sock)) return { error: 'WhatsApp sedang terputus. Retry dibatalkan.', offline: true }
  const original = data.findRun(runKey)
  if (!original) return { error: 'Riwayat pengiriman tidak ditemukan.' }
  const row = data.get(original.id)
  if (!row) return { error: 'Pengumuman sudah dihapus.' }
  const run = data.claimRetry(runKey)
  if (!run) return { error: 'Hanya pengiriman gagal yang bisa diulang, dan itu pun sekali per percobaan.' }
  run.actor = actor
  data.save()
  const outcome = await sendAnnouncement(sock, { row, eventDate: original.eventDate || row.eventDate }, run)
  return { run: data.findRun(run.key), status: outcome.status }
}

module.exports = {
  addDays, weekdayOf, eventDatesFor, dueItems, dueOnce, announcementText, buildPayloads,
  sendAnnouncement, tickAutoAnnouncements, manualSend, retrySend,
}
