// owner/dmsg-trigger — pemicu otomatis DMSG untuk owner di grup: beri reaksi 🤓 ke pesan target, atau reply pesan target dengan teks 🤓.
const gd = require('../../lib/ghostdel')
const { normalizeMessageContent } = require('@whiskeysockets/baileys')
const { getContextInfo } = require('../../lib/utils')

const norm = (s) => String(s ?? '').replace(/\uFE0F/g, '').trim()
const TRIGGER = '🤓'
const done = new Map() // "chat:target" -> waktu, supaya satu pesan tidak diproses dua kali

module.exports = {
  hook: true,
  name: 'dmsg-trigger',
  passive: async ({ sock, msg, from, isGroup, isOwner, body, config }) => {
    if (!isGroup || !isOwner || typeof sock.relayMessage !== 'function') return false
    const content = normalizeMessageContent(msg.message)
    if (!content) return false

    let targetId = null
    let triggerId = null
    const react = content.reactionMessage
    if (react) {
      if (norm(react.text) !== TRIGGER) return false
      targetId = react.key?.id
    } else {
      if (norm(body) !== TRIGGER) return false
      const ci = getContextInfo(msg)
      if (!ci?.quotedMessage || !ci.stanzaId) return false
      targetId = ci.stanzaId
      triggerId = msg.key?.id
    }
    if (!targetId || targetId === triggerId) return false

    const now = Date.now()
    for (const [k, t] of done) if (now - t > 60000) done.delete(k)
    const key = `${from}:${targetId}`
    if (done.has(key)) return true
    done.set(key, now)

    const o = gd.opts(config)
    if (gd.limited(from, o)) { console.log(`[dmsg:auto] trigger ${TRIGGER} dibatasi untuk grup ${from}`); return true }
    try {
      await gd.ghostDelete(sock, from, targetId, config)
      gd.mark(from, o)
      if (triggerId) { try { await gd.ghostDelete(sock, from, triggerId, config) } catch (err) { console.log('[dmsg:auto:trigger]', err?.message || err) } }
    } catch (err) {
      done.delete(key)
      console.log('[dmsg:auto]', err?.message || err)
    }
    return true
  }
}
