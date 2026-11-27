// Hook pasif fitur tambahan (lib/kernel): jawaban game tanpa prefix, AFK, auto-download tautan, dll.
// Hanya untuk pesan yang BUKAN perintah; perintah dijalankan plugin masing-masing lewat lib/adapter/e9.js.
'use strict'
const SKIP = new Set(['reactionMessage', 'protocolMessage', 'pollUpdateMessage', 'senderKeyDistributionMessage'])
let busy = 0

module.exports = {
  name: 'kernel-passive',
  hook: true,
  async passive(ctx) {
    try {
      const { msg, body, prefix, isOwner, settings, from } = ctx
      if (!body || !msg?.message || !from) return false
      if (msg.key?.fromMe && !isOwner) return false
      if (from === 'status@broadcast' || String(from).endsWith('@broadcast')) return false
      if (SKIP.has(Object.keys(msg.message)[0])) return false
      if (prefix && body.startsWith(prefix)) return false
      if (settings && settings.mode === 'self' && !isOwner) return false
      if (busy > 25) return false // jangan menumpuk saat bot sibuk
      busy++
      try { await require('../../lib/adapter/e9.js').passive(ctx) } finally { busy-- }
    } catch (err) {
      console.log('[KERNEL] pasif:', err.message)
    }
    return false
  }
}
