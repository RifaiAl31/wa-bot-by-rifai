// Alur .analisis-catatan (kumpulkan foto -> analisis AI -> koreksi -> simpan)
// dan .catatan pengumuman (ambil data dari arsip tanpa mengetik ulang).
'use strict'
const fs = require('fs')
const path = require('path')
const media = require('./announcementMedia')
const data = require('./noteData')
const vision = require('./noteVision')
const autoFlow = require('./autoAnnouncementFlow')
const { userOf } = require('./utils')

const sessions = new Map()
const PREFIX = () => String(global.__prefix || '.')
const keyOf = (ctx) => `${ctx.from || ''}|${userOf(ctx.sender)}`
const MAX_PAGES = 10
const MAX_TOTAL_BYTES = 40 * 1024 * 1024
const TTL_MS = 45 * 60 * 1000

function sweep() {
  for (const [key, session] of sessions) {
    if (Date.now() - session.touchedAt > TTL_MS) sessions.delete(key)
  }
}
function touch(session) { session.touchedAt = Date.now() }

function imageFrom(msg) {
  if (!msg?.message) return null
  const m = msg.message
  if (m.viewOnceMessage || m.viewOnceMessageV2 || m.viewOnceMessageV2Extension) {
    throw new Error('Foto sekali-lihat tidak didukung. Kirim foto biasa.')
  }
  if (m.imageMessage) return msg
  const quoted = m.extendedTextMessage?.contextInfo?.quotedMessage
  if (quoted?.imageMessage) return { message: quoted, key: msg.key }
  return null
}

function categoryText(transcript, key) {
  const block = transcript?.[key] || { tertulis: [], interpretasi: [] }
  const lines = []
  if (block.tertulis.length) lines.push(...block.tertulis.map((x) => `  • ${x}`))
  else lines.push('  • (tidak ada)')
  if (block.interpretasi.length) lines.push('  Interpretasi AI:', ...block.interpretasi.map((x) => `    - ${x}`))
  return lines.join('\n')
}

function renderTranscript(transcript, meta = {}) {
  const out = [
    'HASIL ANALISIS CATATAN RAPAT',
    ...(meta.id ? [`ID: ${meta.id}`] : []),
    ...(meta.provider ? [`Model: ${meta.provider}`] : []),
    '',
  ]
  for (const [key, label] of vision.CATEGORIES) {
    out.push(label, categoryText(transcript, key), '')
  }
  const pages = Array.isArray(transcript.teks_per_halaman) ? transcript.teks_per_halaman : []
  if (pages.length) {
    out.push('TRANSKRIPSI MENTAH PER HALAMAN')
    for (const page of pages) {
      out.push(`HALAMAN ${page.halaman}:`, String(page.mentah || '(kosong)').slice(0, 8000), '')
    }
  }
  const unclear = [
    ...(Array.isArray(transcript.tidak_terbaca) ? transcript.tidak_terbaca : []),
    ...(transcript.perlu_konfirmasi?.tertulis || []),
  ]
  out.push('BAGIAN PERLU DIKONFIRMASI', ...(unclear.length ? unclear.map((x) => `  • ${x}`) : ['  • (tidak ada)']))
  return out.join('\n').slice(0, 30000)
}

async function discard(session) {
  if (!session) return
  for (const page of session.pages || []) {
    if (!page?.ref?.path) continue
    const absolute = path.isAbsolute(page.ref.path) ? page.ref.path : path.join(__dirname, '..', page.ref.path)
    try { fs.unlinkSync(absolute) } catch { /* sudah terhapus */ }
  }
}

async function addPage(ctx, session) {
  if (session.pages.length >= MAX_PAGES) {
    await autoFlow.sendPlain(ctx.sock, ctx.from, `Maksimal ${MAX_PAGES} halaman per sesi. Ketik selesai untuk menganalisis.`, ctx.msg)
    return
  }
  let attachment
  try { attachment = imageFrom(ctx.msg) } catch (err) {
    await autoFlow.sendPlain(ctx.sock, ctx.from, `Foto ditolak: ${err.message}`, ctx.msg)
    return
  }
  if (!attachment) {
    await autoFlow.sendPlain(ctx.sock, ctx.from, 'Kirim foto halaman buku, atau ketik selesai untuk menganalisis.', ctx.msg)
    return
  }
  try {
    const downloaded = await media.download(attachment)
    if (!['jpg', 'jpeg', 'png', 'webp'].includes(downloaded.ext)) throw new Error('Hanya foto JPG/PNG/WEBP yang didukung.')
    const total = session.pages.reduce((n, p) => n + (p.ref?.size || 0), 0) + downloaded.buffer.length
    if (total > MAX_TOTAL_BYTES) throw new Error('Total ukuran foto melebihi 40 MB.')
    session.pages.push({ ref: media.save(downloaded), mime: downloaded.mime })
    touch(session)
    await autoFlow.sendPlain(ctx.sock, ctx.from,
      `Halaman ${session.pages.length} tersimpan. Kirim halaman berikutnya atau ketik *selesai* untuk dianalisis.`, ctx.msg)
  } catch (err) {
    await autoFlow.sendPlain(ctx.sock, ctx.from, `Gagal menyimpan foto: ${err.message}`, ctx.msg)
  }
}

async function runAnalysis(ctx, session) {
  if (!session.pages.length) {
    await autoFlow.sendPlain(ctx.sock, ctx.from, 'Belum ada foto. Kirim foto halaman rapat dulu.', ctx.msg)
    return
  }
  await autoFlow.sendPlain(ctx.sock, ctx.from, `⏳ Membaca ${session.pages.length} halaman dengan AI vision...`, ctx.msg)
  try {
    const images = session.pages.map((page) => {
      const { buffer } = media.read(page.ref)
      return { buffer, mime: page.mime || 'image/jpeg' }
    })
    const { result, provider } = await vision.analyzePages(images)
    session.transcript = result
    session.provider = provider
    session.step = 'review'
    touch(session)
    const text = renderTranscript(result, { provider })
    await autoFlow.sendPlain(ctx.sock, ctx.from, [
      text,
      '',
      'Periksa hasil di atas.',
      `Ketik ${PREFIX()}ya untuk menyimpan ke arsip,`,
      `${PREFIX()}edit 1 <teks> untuk mengganti isi kategori 1 (atau ${PREFIX()}edit tambah 1 <teks>),`,
      `atau ${PREFIX()}batal untuk membuang.`,
    ].join('\n'), ctx.msg)
  } catch (err) {
    console.log('[CATATAN] gagal analisis:', err.message)
    await autoFlow.sendPlain(ctx.sock, ctx.from, `❌ Analisis gagal:\n${err.message}\n\nFoto masih tersimpan. Ketik selesai untuk mencoba lagi.`, ctx.msg)
  }
}

async function saveSession(ctx, session) {
  if (session.step !== 'review') return false
  const transcript = session.transcript || {}
  const first = transcript.judul_dan_tanggal?.tertulis?.[0] || 'Catatan rapat'
  const tanggal = transcript.judul_dan_tanggal?.tertulis?.find((x) => /\d{1,4}[-/]\d{1,2}[-/]\d{1,4}|\d{1,2}\s+\w+\s+\d{4}/i.test(x)) || ''
  const row = data.add({
    title: String(first).slice(0, 160),
    tanggal,
    transcript,
    raw: (transcript.teks_per_halaman || []).map((p) => `HALAMAN ${p.halaman}\n${p.mentah}`).join('\n\n'),
    pages: session.pages.map((p) => p.ref),
    unclear: transcript.tidak_terbaca || [],
    provider: session.provider,
    createdBy: ctx.sender,
  })
  sessions.delete(keyOf(ctx))
  session.pages = []
  await autoFlow.sendPlain(ctx.sock, ctx.from, [
    `✅ Catatan tersimpan sebagai ${row.id}.`,
    `Judul: ${row.title}`,
    '',
    `Lihat: ${PREFIX()}catatan detail ${row.id}`,
    `Buat pengumuman: ${PREFIX()}catatan pengumuman ${row.id}`,
  ].join('\n'), ctx.msg)
  return true
}

async function applyEdit(ctx, session, raw) {
  const normalized = String(raw || '').trim().replace(/^\./, '')
  const match = /^edit\s+(tambah\s+)?(\d+|judul|tanggal)\s+([\s\S]+)$/i.exec(normalized)
  if (!match) {
    await autoFlow.sendPlain(ctx.sock, ctx.from,
      `Contoh: ${PREFIX()}edit 1 Nama benar adalah Siti (bukan Sitih) | ${PREFIX()}edit judul Rapat RT | ${PREFIX()}edit tanggal 12 Desember 2026`, ctx.msg)
    return
  }
  const [, tambah, field, value] = match
  if (field === 'judul') session.transcript.judul_dan_tanggal.tertulis = [value]
  else if (field === 'tanggal') session.transcript.judul_dan_tanggal.tertulis.push(`Tanggal: ${value}`)
  else {
    const index = Number(field) - 1
    const key = vision.CATEGORIES[index]?.[0]
    if (!key) { await autoFlow.sendPlain(ctx.sock, ctx.from, 'Nomor kategori 1–10 saja.', ctx.msg); return }
    if (tambah) session.transcript[key].tertulis.push(value)
    else session.transcript[key].tertulis = [value]
  }
  touch(session)
  await autoFlow.sendPlain(ctx.sock, ctx.from,
    `Bagian diperbarui.\n\n${renderTranscript(session.transcript, { provider: session.provider })}\n\nKetik ${PREFIX()}ya untuk menyimpan.`, ctx.msg)
}

async function startAnalysis(ctx) {
  if (ctx.msg?.key?.fromMe) return
  const key = keyOf(ctx)
  const old = sessions.get(key)
  if (old) { await discard(old); sessions.delete(key) }
  const session = { kind: 'analysis', step: 'collect', pages: [], transcript: null, provider: '', touchedAt: Date.now() }
  sessions.set(key, session)
  await addPage(ctx, session)
}

async function startPengumuman(ctx, id) {
  if (ctx.msg?.key?.fromMe) return
  const row = data.get(id)
  if (!row) {
    await autoFlow.sendPlain(ctx.sock, ctx.from, `Catatan ${id} tidak ditemukan.`, ctx.msg)
    return
  }
  const key = keyOf(ctx)
  const old = sessions.get(key)
  if (old) { await discard(old); sessions.delete(key) }
  sessions.set(key, { kind: 'pengumuman', step: 'pick', noteId: row.id, row, touchedAt: Date.now() })
  await autoFlow.sendPlain(ctx.sock, ctx.from, [
    `PILIH INFORMASI DARI ${row.id}`,
    '',
    ...vision.CATEGORIES.map(([k, label], i) => `${i + 1}. ${label} — ${(row.transcript?.[k]?.tertulis || []).length} butir`),
    '',
    'Ketik nomor kategori untuk dijadikan pengumuman. Judul dan isi akan diisi otomatis dari arsip.',
    `Ketik ${PREFIX()}batal untuk membatalkan.`,
  ].join('\n'), ctx.msg)
}

async function passive(ctx) {
  if (ctx.msg?.key?.fromMe) return false
  sweep()
  const key = keyOf(ctx)
  const session = sessions.get(key)
  if (!session) return false
  const body = String(ctx.body || '').trim()
  const normalized = body.toLowerCase().replace(/^\./, '').trim()

  if (normalized === 'batal' || normalized === 'batalkan' || normalized === 'cancel') {
    await discard(session)
    sessions.delete(key)
    await autoFlow.sendPlain(ctx.sock, ctx.from, 'Dibatalkan. Tidak ada yang disimpan.', ctx.msg)
    return true
  }
  if (session.kind === 'analysis') {
    if (session.step === 'collect') {
      if (['selesai', 'selesai.', 'analisis', 'done'].includes(normalized)) { await runAnalysis(ctx, session); return true }
      if (/^edit\b/i.test(body)) { await autoFlow.sendPlain(ctx.sock, ctx.from, 'Koreksi tersedia setelah analisis selesai.', ctx.msg); return true }
      if (body.startsWith('.')) return false
      await addPage(ctx, session)
      return true
    }
    if (session.step === 'review') {
      if (['ya', 'iya', 'y', 'simpan', 'save'].includes(normalized)) { await saveSession(ctx, session); return true }
      if (/^edit\b/i.test(body)) { await applyEdit(ctx, session, body); return true }
      if (body.startsWith('.')) return false
      await autoFlow.sendPlain(ctx.sock, ctx.from, `Ketik ${PREFIX()}ya untuk menyimpan atau ${PREFIX()}edit <nomor> <teks> untuk mengoreksi.`, ctx.msg)
      return true
    }
  }
  if (session.kind === 'pengumuman' && session.step === 'pick') {
    if (/^\d+$/.test(normalized)) {
      const entry = vision.CATEGORIES[Number(normalized) - 1]
      if (!entry) { await autoFlow.sendPlain(ctx.sock, ctx.from, 'Pilih nomor 1 sampai 10.', ctx.msg); return true }
      const block = session.row.transcript?.[entry[0]] || { tertulis: [] }
      const bodyText = block.tertulis.length ? block.tertulis.join('\n') : '(kategori ini kosong pada catatan)'
      const title = `${entry[1].replace(/^\d+\.\s*/, '')} — ${session.row.title}`.slice(0, 120)
      const noteId = session.noteId
      sessions.delete(key) // kunci sama dengan wizard auto-pengumuman
      await autoFlow.startFromNote(ctx, { title, body: bodyText, noteId })
      return true
    }
    if (body.startsWith('.')) return false
    await autoFlow.sendPlain(ctx.sock, ctx.from, 'Ketik nomor 1 sampai 10.', ctx.msg)
    return true
  }
  return false
}

module.exports = {
  sessions, keyOf, clearSession: (ctx) => {
    const session = sessions.get(keyOf(ctx))
    if (session) { discard(session); sessions.delete(keyOf(ctx)) }
  },
  imageFrom, renderTranscript, startAnalysis, startPengumuman, passive,
}
