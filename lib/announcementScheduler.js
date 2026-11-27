// Satu scheduler untuk semua pengumuman (teks dan media). Dipanggil dari lib/scheduler.js
// pada loop yang sama dengan pengingat, jadi tidak ada timer kedua.
'use strict'
const data = require('./announcementData')
const media = require('./announcementMedia')

const WEEKDAY_MAP = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }

function jakartaNow(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Jakarta', year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hourCycle: 'h23', weekday: 'short',
  }).formatToParts(date)
  const p = Object.fromEntries(parts.map((x) => [x.type, x.value]))
  return {
    year: Number(p.year), month: Number(p.month), day: Number(p.day),
    hour: Number(p.hour), minute: Number(p.minute),
    weekday: WEEKDAY_MAP[p.weekday] ?? 0,
    date: `${p.year}-${p.month}-${p.day}`,
    time: `${p.hour}:${p.minute}`,
  }
}

const jakartaDate = () => jakartaNow().date

function online(sock) {
  if (!sock || !sock.user?.id) return false
  if (sock.ws && typeof sock.ws.readyState === 'number' && sock.ws.readyState !== 1) return false
  return true
}

async function tickAnnouncements(sock) {
  const result = { processed: 0, sent: 0, failed: 0, skipped: 0 }
  // Jangan klaim jadwal saat WhatsApp offline: slot yang diklaim tapi tidak terkirim hilang.
  if (!online(sock)) { result.offline = true; return result }
  const now = jakartaNow()
  const due = data.list().filter((row) =>
    Number(row.is_active) !== 0 && row.eventDate === now.date && row.sendTime === now.time)

  for (const row of due) {
    const run = data.claimRun(row.id, now.date, now.time)
    if (!run) { result.skipped += 1; continue } // sudah pernah dikirim/dicoba di menit ini
    result.processed += 1
    try {
      if (!row.targets.length) throw new Error('Pengumuman tidak memiliki grup tujuan')
      const payload = media.buildPayload(row)
      const details = []
      const send = sock.__rawSend || sock.sendMessage // lewati kartu/richui: teks harus tetap teks
      for (const jid of row.targets) {
        try {
          await send.call(sock, jid, payload)
          details.push({ jid, status: 'sent' })
        } catch (err) {
          details.push({ jid, status: 'failed', reason: err.message })
        }
      }
      const allOk = details.length > 0 && details.every((d) => d.status === 'sent')
      data.finishRun(run, { status: allOk ? 'sent' : 'failed', details })
      result[allOk ? 'sent' : 'failed'] += 1
    } catch (err) {
      data.finishRun(run, { status: 'failed', details: [{ reason: err.message }] })
      result.failed += 1
      console.log(`[ANN] gagal mengirim ${row.id}:`, err.message)
    }
  }
  return result
}

module.exports = { jakartaNow, jakartaDate, online, tickAnnouncements }
