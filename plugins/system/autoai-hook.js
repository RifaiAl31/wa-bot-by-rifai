// Hook: Auto AI grup — jawaban AI otomatis saat bot di-reply atau di-tag di grup yang mengaktifkan .autoai
// (.autoai on --mode=... --type=text|voice). Pesan berprefix (perintah) tidak diproses di sini.
const e3 = require('../../lib/adapter/e3.js')
let handler = null
let loadErr = null
function load() {
  if (handler || loadErr) return handler
  try { handler = require('../../lib/ext/src/lib/autoaiHandler.js').handleAutoAI } catch (e) { loadErr = e; console.log('[AUTOAI] gagal memuat handler:', e.message) }
  return handler
}

module.exports = {
  name: 'autoai-hook',
  hook: true,
  async passive(ctx) {
    try {
      const { sock, msg, from, isGroup, body, prefix } = ctx
      if (!isGroup || !body || !msg || msg.key?.fromMe) return false
      if (prefix && body.startsWith(prefix)) return false
      const fn = load()
      if (!fn) return false
      e3.extend(sock)
      const reply = (text, chatId, options = {}) => sock.sendMessage(chatId || from, { text: String(text), ...options }, { quoted: msg })
      const m = e3.buildM(sock, { ...ctx, text: '', args: [], command: '' }, reply, true)
      return !!(await fn(m, sock))
    } catch (err) { console.log('[AUTOAI] hook:', err.message) }
    return false
  }
}
