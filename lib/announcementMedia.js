// Lampiran pengumuman: terima JPG/JPEG/PNG/WEBP/PDF/DOC/DOCX, unduh dari WhatsApp,
// dan simpan permanen di disk. Path relatif disimpan di baris pengumuman yang sama.
'use strict'
const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const { downloadMediaMessage } = require('./baileys-compat')

const ROOT = path.join(__dirname, '..')
const MEDIA_DIR = process.env.ANNOUNCEMENT_MEDIA_DIR
  ? path.resolve(process.env.ANNOUNCEMENT_MEDIA_DIR)
  : path.join(ROOT, 'database', 'announcement-media')
const MAX_BYTES = (Number(process.env.ANNOUNCEMENT_MEDIA_MAX_MB) || 20) * 1024 * 1024

const BY_EXT = new Map([
  ['jpg', 'image/jpeg'], ['jpeg', 'image/jpeg'], ['png', 'image/png'], ['webp', 'image/webp'],
  ['pdf', 'application/pdf'], ['doc', 'application/msword'],
  ['docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
])
const BY_MIME = new Map([...BY_EXT].map(([ext, mime]) => [mime, ext]))
const IMAGE_EXT = new Set(['jpg', 'jpeg', 'png', 'webp'])

function supportedFormats() { return [...BY_EXT.keys()] }

function cleanName(name) {
  return path.basename(String(name || '')).replace(/[^\w.\- ()]/g, '').slice(0, 120)
}

// null = bukan lampiran yang didukung; melempar = pesan lampiran yang ditolak.
function detectAttachment(msg) {
  const m = msg?.message
  if (!m) return null
  if (m.viewOnceMessage || m.viewOnceMessageV2 || m.viewOnceMessageV2Extension) {
    throw new Error('Lampiran sekali-lihat tidak didukung. Kirim file biasa.')
  }
  if (m.imageMessage) return { kind: 'image', content: m.imageMessage }
  if (m.documentMessage) return { kind: 'document', content: m.documentMessage }
  return null
}

function extensionOf(attachment) {
  const name = String(attachment?.content?.fileName || '')
  const fromName = path.extname(name).toLowerCase().replace(/^\./, '')
  if (BY_EXT.has(fromName)) return fromName
  const mime = String(attachment?.content?.mimetype || '').toLowerCase().split(';')[0]
  return BY_MIME.get(mime) || null
}

function validate(attachment) {
  if (!attachment) throw new Error('Lampiran tidak ditemukan. Kirim foto atau dokumen ke chat ini.')
  const ext = extensionOf(attachment)
  if (!ext) throw new Error(`Format tidak didukung. Kirim ${supportedFormats().join(', ').toUpperCase()}.`)
  const declared = Number(attachment.content?.fileLength || 0)
  if (declared > MAX_BYTES) throw new Error(`File terlalu besar. Maksimal ${Math.round(MAX_BYTES / 1048576)} MB.`)
  return ext
}

async function download(msg) {
  const attachment = detectAttachment(msg)
  const ext = validate(attachment)
  const buffer = await downloadMediaMessage(msg, 'buffer', {})
  if (!Buffer.isBuffer(buffer) || !buffer.length) throw new Error('Lampiran gagal diunduh.')
  if (buffer.length > MAX_BYTES) throw new Error(`File terlalu besar. Maksimal ${Math.round(MAX_BYTES / 1048576)} MB.`)
  const mime = BY_EXT.get(ext) || String(attachment.content.mimetype || 'application/octet-stream')
  const name = cleanName(attachment.content.fileName) || `lampiran-${Date.now()}.${ext}`
  return { buffer, ext, name, mime }
}

function save({ buffer, ext, name, mime }) {
  fs.mkdirSync(MEDIA_DIR, { recursive: true })
  const absolute = path.join(MEDIA_DIR, `${crypto.randomUUID()}.${ext}`)
  fs.writeFileSync(absolute, buffer)
  return {
    path: path.relative(ROOT, absolute).split(path.sep).join('/'),
    name: cleanName(name) || `lampiran.${ext}`,
    mime: mime || BY_EXT.get(ext) || 'application/octet-stream',
    size: buffer.length,
  }
}

function read(media) {
  if (!media?.path) throw new Error('Data lampiran tidak ditemukan.')
  const absolute = path.isAbsolute(media.path) ? media.path : path.join(ROOT, media.path)
  const buffer = fs.readFileSync(absolute)
  return { buffer, ext: path.extname(absolute).toLowerCase().replace(/^\./, '') }
}

// Payload dikirim apa adanya; caption = isi pengumuman tanpa tambahan judul/format.
function buildPayload(row) {
  if (row.type !== 'img' || !row.media) return { text: String(row.body || '') }
  const { buffer, ext } = read(row.media)
  if (IMAGE_EXT.has(ext) && (row.media.mime || '').startsWith('image/')) {
    return { image: buffer, caption: String(row.body || ''), mimetype: row.media.mime }
  }
  if (IMAGE_EXT.has(ext)) {
    return { image: buffer, caption: String(row.body || ''), mimetype: BY_EXT.get(ext) }
  }
  return {
    document: buffer,
    fileName: row.media.name || `lampiran.${ext || 'bin'}`,
    mimetype: row.media.mime || BY_EXT.get(ext) || 'application/octet-stream',
    caption: String(row.body || ''),
  }
}

module.exports = {
  MEDIA_DIR, MAX_BYTES, supportedFormats, detectAttachment, validate, download, save, read, buildPayload,
}
