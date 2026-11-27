// Hook: Badge Realtime — stiker badge dikirim sebagai reaction (messageAssociation tipe 11) pada tiap pesan masuk.
// Tiap stiker dikirim sebanyak jumlahnya sendiri (n), tanpa batas. Pengiriman lewat antrian di latar belakang
// supaya pemrosesan pesan/command lain tidak tertahan.
const st = require('../../lib/badge')
const { prepareWAMessageMedia } = require('@whiskeysockets/baileys')
const SKIP = new Set(['reactionMessage', 'protocolMessage', 'pollUpdateMessage', 'senderKeyDistributionMessage'])
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const GAP = 120 // jeda antar stiker (ms)
const MAX_BACKLOG = 5000 // pengaman memori: kalau antrian menumpuk sebanyak ini, pesan baru dilewati dulu

// cache hasil upload per stiker (30 menit) supaya tidak upload ulang tiap pesan
const cache = new Map()
async function prepare(sock, item) {
  const key = item.b64.length + ':' + item.b64.slice(-40)
  const hit = cache.get(key)
  if (hit && Date.now() - hit.t < 30 * 60 * 1000) return hit.m
  const prepared = await prepareWAMessageMedia({ sticker: Buffer.from(item.b64, 'base64') }, { upload: sock.waUploadToServer })
  if (!prepared?.stickerMessage) return null
  cache.set(key, { t: Date.now(), m: prepared.stickerMessage })
  if (cache.size > 100) cache.delete(cache.keys().next().value)
  return prepared.stickerMessage
}

const queue = []
let backlog = 0
let running = false

async function drain() {
  if (running) return
  running = true
  try {
    while (queue.length) {
      const job = queue.shift()
      let fails = 0
      for (let i = 0; i < job.n; i++) {
        try {
          await job.sock.relayMessage(job.from, {
            messageContextInfo: { messageAssociation: { associationType: 11, parentMessageKey: job.parent, messageIndex: 0 } },
            stickerMessage: job.stickerMessage
          }, {})
          fails = 0
        } catch (err) {
          if (++fails >= 3) { console.log('[BADGE] kirim dihentikan untuk pesan ini:', err.message); backlog -= job.n - i - 1; break }
        }
        backlog--
        await sleep(GAP)
      }
    }
  } finally { running = false }
}

module.exports = {
  name: 'badge-hook',
  hook: true,
  async passive({ sock, msg, from, body, prefix }) {
    try {
      if (!st.data.enabled || !st.data.list.length) return false
      if (!msg?.message || msg.key?.fromMe || !msg.key?.id) return false
      if (!from || from === 'status@broadcast' || from.endsWith('@broadcast')) return false
      if (SKIP.has(Object.keys(msg.message)[0])) return false
      if (body && body.startsWith(prefix) && /^badge(realtime|count)?\b/i.test(body.slice(prefix.length).trim())) return false
      if (typeof sock.waUploadToServer !== 'function') return false
      if (backlog >= MAX_BACKLOG) return false
      const parent = { ...msg.key, remoteJid: msg.key.remoteJid || from }
      for (const item of st.data.list) {
        const stickerMessage = await prepare(sock, item)
        if (!stickerMessage) continue
        const n = st.countOf(item)
        queue.push({ sock, from, parent, stickerMessage, n })
        backlog += n
      }
      drain().catch((e) => console.log('[BADGE] antrian:', e.message))
    } catch (err) { console.log('[BADGE] hook:', err.message) }
    return false
  }
}
