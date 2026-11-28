// Scheduler untuk .auto-pengumuman + dashboard web. Satu loop 10 detik dari lib/scheduler.js,
// klaim eksekusi unik (anti-double), catch-up terkontrol, dan rekonsiliasi setelah restart.
'use strict'
const fs = require('fs')
const path = require('path')
const data = require('./autoAnnouncementData')
const engine = require('./announcementScheduleEngine')
const { renderPoster, formatDate } = require('./autoAnnouncementPoster')
const { jakartaNow, online } = require('./announcementScheduler')

const ROOT = path.join(__dirname, '..')
const DAYS = engine.HARI
const MAX_IMAGE_BYTES = (Number(process.env.AUTO_ANNOUNCEMENT_IMAGE_MAX_MB) || 10) * 1024 * 1024
const MIME_BY_EXT = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp' }
const STALE_CLAIM_MS = (Number(process.env.AUTO_ANNOUNCEMENT_STALE_MS) || 15 * 60 * 1000)
const inflight = new Set()
let ticking = false

const addDays = engine.addDays
const weekdayOf = engine.weekdayOf
const parseDate = engine.parseDay
const iso = engine.iso

// Deretan tanggal kegiatan untuk scheduler lama. 'forever' diperlakukan seperti weekly,
// tetapi tidak pernah berhenti sampai admin pause/delete.
function eventDatesFor(row, today) {
  const anchor = row.startDate || row.eventDate
  if (!anchor) return []
  if (!engine.isRecurring(row.repeat)) return [anchor]
  const out = []
  for (let k = -8; k <= 104; k += 1) out.push(addDays(anchor, k * 7))
  return out.filter((d) => d && weekdayOf(d) === Number(row.weekday))
}

const announcementText = (row, eventDate) => engine.announcementText(row, eventDate)

function resolveContent(row) {
  const template = row.templateId ? data.getTemplate(row.templateId) : null
  if (!template) return row
  return Object.assign({}, row, {
    title: template.title || row.title,
    body: template.body || row.body,
    imagePath: template.imagePath === undefined ? row.imagePath : template.imagePath,
    targets: Array.isArray(template.targets) && template.targets.length ? template.targets : row.targets,
  })
}
function snapshotOf(row, eventDate) {
  const r = resolveContent(row)
  return {
    name: row.scheduleName || row.name || row.title || '',
    title: r.title || '', body: r.body || '', imagePath: r.imagePath || null,
    targets: (r.targets || []).slice(), eventDate, sendTime: r.sendTime,
    weekday: r.weekday, repeat: r.repeat, templateId: r.templateId || null,
  }
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
  } catch { return null }
}

function buildPayloads(item) {
  const row = resolveContent(item.row)
  const eventDate = item.eventDate
  const fullText = announcementText(row, eventDate)
  const format = String(row.format || 'text')
  const image = readUploadedImage(row.imagePath)
  if (format === 'text') return [{ text: fullText }]
  const captionImage = `*${row.title || row.name || 'Pengumuman'}*\n${formatDate(eventDate || row.eventDate)}`
  if (image) {
    if (format === 'poster') return [{ image: image.buffer, caption: fullText, mimetype: image.mimetype }]
    return [{ text: fullText }, { image: image.buffer, caption: captionImage, mimetype: image.mimetype }]
  }
  const poster = renderPoster({
    title: row.title, body: row.body, eventDate,
    eventTime: row.eventTime, weekday: row.weekday,
  })
  if (format === 'poster') return [{ image: poster, caption: fullText, mimetype: 'image/png' }]
  return [
    { text: fullText },
    { image: poster, caption: captionImage, mimetype: 'image/png' },
  ]
}

function dueOnce(now) {
  const nowTime = String(now?.time || '').replace('.', ':')
  const due = []
  for (const row of data.list()) {
    if (Number(row.is_active) === 0 || row.status === 'draft' || row.mode !== 'once') continue
    const at = String(row.scheduleAt || '')
    const sendDate = at.slice(0, 10)
    const sendTime = at.slice(11, 16)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(sendDate) || !/^\d{2}:\d{2}$/.test(sendTime)) continue
    if (sendDate < now.date || (sendDate === now.date && sendTime <= nowTime)) {
      due.push({ row, eventDate: row.eventDate || sendDate, sendDate, sendTime })
    }
  }
  return due
}
function dueItems(now) {
  const nowTime = String(now?.time || '').replace('.', ':')
  const due = dueOnce(now)
  for (const row of data.list()) {
    if (Number(row.is_active) === 0 || row.status === 'draft' || row.mode === 'once') continue
    for (const eventDate of eventDatesFor(row, now.date)) {
      const sendDate = addDays(eventDate, -(Number(row.offsetDays) || 0))
      if (sendDate === now.date && String(row.sendTime || '').replace('.', ':') === nowTime) {
        due.push({ row, eventDate, sendDate, sendTime: nowTime })
      }
    }
  }
  return due
}

// Satu jalur kirim untuk scheduler, kirim manual, retry, dan approve.
async function sendAnnouncement(sock, item, run) {
  const { row, eventDate } = item
  if (inflight.has(run.key)) return { skipped: true, status: 'claimed', details: [] }
  inflight.add(run.key)
  const details = []
  try {
    const resolved = resolveContent(row)
    if (!resolved.targets || !resolved.targets.length) throw new Error('Tidak ada grup tujuan')
    const payloads = buildPayloads(item)
    const send = sock.__rawSend || sock.sendMessage
    for (const jid of resolved.targets) {
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
    data.finishRun(run, { status: allOk ? 'sent' : 'failed', details, snapshot: snapshotOf(row, eventDate) })
    if (allOk && !engine.isRecurring(row.repeat)) data.update(row.id, { status: 'sent', is_active: 0 })
    return { status: allOk ? 'sent' : 'failed', details }
  } catch (err) {
    data.finishRun(run, { status: 'failed', details: [{ reason: err.message }], snapshot: snapshotOf(row, eventDate) })
    return { status: 'failed', details: [{ reason: err.message }] }
  } finally {
    inflight.delete(run.key)
  }
}

// Rekonsiliasi aman: klaim yang mati di tengah kirim tidak dianggap berhasil dan tidak
// dikirim ulang otomatis. Admin bisa retry secara eksplisit dari riwayat.
function reconcileStale() {
  let fixed = 0
  const now = Date.now()
  for (const run of data.listRuns()) {
    if (run.status !== 'claimed' || run.sentAt || run.details?.length) continue
    const at = Date.parse(run.createdAt || '')
    if (Number.isFinite(at) && now - at > STALE_CLAIM_MS) {
      data.finishRun(run, {
        status: 'failed',
        details: [{ reason: 'Proses restart saat pengiriman; status tidak dikonfirmasi. Perlu retry manual.' }],
      })
      fixed += 1
    }
  }
  return fixed
}

function pendingCount() {
  return data.listRuns().filter((r) => ['claimed', 'queued', 'pending_review'].includes(r.status)).length
}
function missedRun(row, item, policy, reason) {
  const status = policy === 'online'
    ? (pendingCount() < Number(data.getSettings().maxPending || 20) ? 'queued' : 'missed')
    : policy === 'review' ? 'pending_review' : 'missed'
  const run = data.claimRun(row.id, item.sendDate, item.sendTime, item.eventDate, {
    kind: 'catchup', status, reason, snapshot: snapshotOf(row, item.eventDate),
    scheduleName: row.scheduleName || row.name || '',
  })
  if (!run) return null
  if (status !== 'claimed') data.finishRun(run, { status, details: [{ reason }], snapshot: snapshotOf(row, item.eventDate) })
  return run
}

async function processQueued(sock) {
  const result = { sent: 0, failed: 0 }
  if (!online(sock)) return result
  const queued = data.listRuns().filter((r) => r.status === 'queued').slice(0, Number(data.getSettings().maxPending || 20))
  for (const run of queued) {
    if (!online(sock)) break
    const row = data.get(run.id)
    if (!row) { data.finishRun(run, { status: 'failed', details: [{ reason: 'Pengumuman sudah dihapus' }] }); continue }
    const outcome = await sendAnnouncement(sock, { row, eventDate: run.eventDate || row.eventDate }, run)
    result[outcome.status === 'sent' ? 'sent' : 'failed'] += 1
  }
  return result
}

async function tickAutoAnnouncements(sock) {
  if (ticking) return { skipped: true }
  ticking = true
  const result = { processed: 0, sent: 0, failed: 0, skipped: 0, missed: 0, queued: 0 }
  try {
    reconcileStale()
    if (!online(sock)) {
      // Tetap catat jadwal yang terlewat walaupun offline, tanpa mengklaim pengiriman.
      const now = jakartaNow()
      const settings = data.getSettings()
      for (const row of data.list()) {
        if (Number(row.is_active) === 0 || row.status === 'draft') continue
        const next = row.mode === 'once'
          ? (() => {
            const at = String(row.scheduleAt || '')
            const d = at.slice(0, 10); const t = at.slice(11, 16)
            return d && t ? { eventDate: row.eventDate || d, sendDate: d, sendTime: t } : null
          })()
          : engine.lastSend(row, now.date)
        if (!next || next.sendDate >= now.date) continue
        if (missedRun(row, next, row.catchUp || settings.catchUp, 'WhatsApp offline saat jadwal tiba')) result.missed += 1
      }
      result.offline = true
      return result
    }
    const queued = await processQueued(sock)
    result.sent += queued.sent
    result.failed += queued.failed
    const now = jakartaNow()
    const settings = data.getSettings()
    for (const row of data.list()) {
      if (Number(row.is_active) === 0 || row.status === 'draft') continue
      if (row.mode === 'once') {
        const at = String(row.scheduleAt || '')
        const sendDate = at.slice(0, 10)
        const sendTime = at.slice(11, 16)
        if (!sendDate || !sendTime) continue
        if (sendDate > now.date || (sendDate === now.date && sendTime > now.time)) continue
        if (missedRun(row, { eventDate: row.eventDate || sendDate, sendDate, sendTime }, row.catchUp || settings.catchUp, 'Jadwal sekali terlewat')) {
          result.missed += 1
          continue
        }
      }
      const next = row.mode === 'once' ? null : engine.lastSend(row, now.date)
      if (!next) continue
      if (next.sendDate < now.date) {
        if (missedRun(row, next, row.catchUp || settings.catchUp, 'Jadwal mingguan terlewat')) result.missed += 1
        continue
      }
      if (next.sendDate !== now.date || next.sendTime !== now.time) continue
      if (!online(sock)) { result.offline = true; break }
      const run = data.claimRun(row.id, next.sendDate, next.sendTime, next.eventDate, {
        kind: 'scheduled', status: 'claimed',
        scheduleName: row.scheduleName || row.name || '',
        snapshot: snapshotOf(row, next.eventDate),
      })
      if (!run) { result.skipped += 1; continue }
      result.processed += 1
      const outcome = await sendAnnouncement(sock, { row, eventDate: next.eventDate }, run)
      if (outcome.skipped) result.skipped += 1
      else result[outcome.status === 'sent' ? 'sent' : 'failed'] += 1
    }
    return result
  } finally {
    ticking = false
  }
}

async function manualSend(sock, id, actor = null) {
  if (!online(sock)) return { error: 'WhatsApp sedang terputus. Pengiriman dibatalkan (tidak ada jadwal yang diklaim).', offline: true }
  const row = data.get(id)
  if (!row) return { error: 'Pengumuman tidak ditemukan.' }
  const resolved = resolveContent(row)
  if (!resolved.targets || !resolved.targets.length) return { error: 'Belum ada grup tujuan.' }
  const stamp = new Date().toISOString()
  const next = engine.nextSend(row, jakartaNow().date)
  const run = data.claimUnique(`manual|${row.id}|${stamp}|${Math.random().toString(36).slice(2, 8)}`, {
    id: row.id, sendDate: jakartaNow().date, sendTime: jakartaNow().time,
    eventDate: next?.eventDate || row.eventDate, kind: 'manual', actor,
    scheduleName: row.scheduleName || row.name || '', snapshot: snapshotOf(row, next?.eventDate || row.eventDate),
  })
  if (!run) return { error: 'Pengiriman sudah diproses.' }
  const outcome = await sendAnnouncement(sock, { row, eventDate: run.eventDate }, run)
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

async function approvePending(sock, runKey, actor = null) {
  if (!online(sock)) return { error: 'WhatsApp sedang terputus. Persetujuan dibatalkan.', offline: true }
  const run = data.findRun(runKey)
  if (!run || run.status !== 'pending_review') return { error: 'Pengiriman tidak sedang menunggu persetujuan.' }
  const row = data.get(run.id)
  if (!row) return { error: 'Pengumuman sudah dihapus.' }
  run.status = 'claimed'
  run.actor = actor
  data.save()
  const outcome = await sendAnnouncement(sock, { row, eventDate: run.eventDate || row.eventDate }, run)
  return { run: data.findRun(run.key), status: outcome.status }
}

module.exports = {
  addDays, weekdayOf, eventDatesFor, dueItems, dueOnce, announcementText, buildPayloads,
  resolveContent, snapshotOf, sendAnnouncement, tickAutoAnnouncements, manualSend, retrySend,
  approvePending, reconcileStale, processQueued,
}
