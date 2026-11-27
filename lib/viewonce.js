// Pembuka pesan sekali-lihat (view once). Media disimpan di memori begitu pesan MASUK, jadi tetap bisa dibuka
// walau sudah dilihat / sudah kedaluwarsa di server WhatsApp. Dipakai .rvo (dan alias).
const { downloadContentFromMessage, normalizeMessageContent } = require('@whiskeysockets/baileys')

const MAX_ITEMS = 60
const MAX_BYTES = 40 * 1024 * 1024 // satu berkas
const MAX_TOTAL = 160 * 1024 * 1024 // total cache
const TTL = 6 * 60 * 60 * 1000
const KINDS = ['imageMessage', 'videoMessage', 'audioMessage']
const cache = new Map() // id -> { buf, kind, mime, caption, ptt, seconds, at, size }
const inflight = new Map() // id -> Promise
let total = 0

const unwrapVO = (message) => {
  if (!message) return null
  let m = message
  for (let i = 0; i < 6 && m; i++) {
    const inner = m.viewOnceMessage?.message || m.viewOnceMessageV2?.message || m.viewOnceMessageV2Extension?.message ||
      m.ephemeralMessage?.message || m.documentWithCaptionMessage?.message || m.editedMessage?.message
    if (!inner) break
    m = inner
  }
  for (const k of KINDS) {
    const node = m[k]
    if (node) return { kind: k, node, flagged: !!node.viewOnce || !!(message.viewOnceMessage || message.viewOnceMessageV2 || message.viewOnceMessageV2Extension) }
  }
  return null
}

const evict = () => {
  const now = Date.now()
  for (const [id, v] of cache) if (now - v.at > TTL) { total -= v.size; cache.delete(id) }
  while ((cache.size > MAX_ITEMS || total > MAX_TOTAL) && cache.size) {
    const id = cache.keys().next().value
    total -= cache.get(id).size
    cache.delete(id)
  }
}

async function downloadNode(kind, node) {
  const type = kind.replace('Message', '')
  const stream = await downloadContentFromMessage(node, type)
  const chunks = []
  let size = 0
  for await (const c of stream) {
    size += c.length
    if (size > MAX_BYTES) throw new Error('berkas terlalu besar')
    chunks.push(c)
  }
  const buf = Buffer.concat(chunks)
  if (!buf.length) throw new Error('media kosong')
  return buf
}

const store = (id, kind, node, buf) => {
  cache.set(id, {
    buf, kind, mime: node.mimetype, caption: node.caption || '', ptt: !!node.ptt, seconds: node.seconds, at: Date.now(), size: buf.length
  })
  total += buf.length
  evict()
}

// Dipanggil untuk setiap pesan masuk (bot.js). Tidak pernah melempar error.
function capture(sock, msg) {
  try {
    const id = msg?.key?.id
    if (!id || cache.has(id) || inflight.has(id)) return
    const vo = unwrapVO(normalizeMessageContent ? msg.message : msg.message)
    if (!vo || !vo.flagged) return
    const p = downloadNode(vo.kind, vo.node)
      .then((buf) => store(id, vo.kind, vo.node, buf))
      .catch(() => {})
      .finally(() => inflight.delete(id))
    inflight.set(id, p)
  } catch {}
}

// Cari media sekali-lihat dari pesan yang di-reply. Mengembalikan { buf, kind, mime, caption, ptt } atau null.
async function find(msg) {
  const ctx = msg.message?.extendedTextMessage?.contextInfo ||
    Object.values(msg.message || {}).map((v) => v?.contextInfo).find(Boolean) ||
    normalizeMessageContent(msg.message)?.extendedTextMessage?.contextInfo
  const id = ctx?.stanzaId
  const q = ctx?.quotedMessage
  if (id) {
    if (inflight.has(id)) await inflight.get(id)
    if (cache.has(id)) return cache.get(id)
  }
  if (!q) return null
  const vo = unwrapVO(q)
  if (!vo) return null
  try {
    const buf = await downloadNode(vo.kind, vo.node)
    if (id) store(id, vo.kind, vo.node, buf)
    return { buf, kind: vo.kind, mime: vo.node.mimetype, caption: vo.node.caption || '', ptt: !!vo.node.ptt }
  } catch {
    return null
  }
}

setInterval(evict, 10 * 60 * 1000).unref?.()

module.exports = { capture, find, unwrapVO }
