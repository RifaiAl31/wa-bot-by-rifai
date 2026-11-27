// owner/resetautoai — satu file: metadata + kode fitur (gabungan dari engine2/plugins/owner/resetautoai.js)
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "resetautoai"
  ],
  "category": "owner",
  "owner": true,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur resetautoai (dari Bot package)"
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/owner").split('\\').join('/')
module.exports = __vx.plugin("owner/resetautoai", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/resetautoai.js'
  const __vxExports = {};
  let handler = async (m, { conn }) => {
    try {
      const sender = String(m.sender || '').split('@')[0].split(':')[0]
  
      const ownerList = Array.isArray(global.vanxoneOwner) ? global.vanxoneOwner : []
      const isOwner = ownerList.some(v => {
        const number = Array.isArray(v) ? v[0] : v
        return String(number).replace(/\D/g, '') === sender
      })
  
      if (!isOwner) {
        return m.reply('❌ Khusus owner bot.')
      }
  
      if (!global.aiSessions) global.aiSessions = {}
      if (!global.groupContext) global.groupContext = {}
  
      // Reset session AI owner pada chat ini
      const sessionId = `${m.chat}:${sender}`
      delete global.aiSessions[sessionId]
  
      // Reset seluruh context AutoAI pada chat ini
      delete global.groupContext[m.chat]
  
      return m.reply(
        '╭─〔 🔄 RESET AUTOAI 〕─╮\n' +
        '│ ✅ Session AutoAI direset\n' +
        '│ 🧠 NoteGPT session: RESET\n' +
        '│ 🤖 Omegatech session: RESET\n' +
        '│ 💬 Group context: RESET\n' +
        '│ 📜 Riwayat AI: RESET\n' +
        '╰──────────────────╯'
      )
    } catch (e) {
      console.log('[RESET AUTOAI ERROR]', e?.stack || e?.message || e)
      return m.reply('❌ Gagal mereset AutoAI.')
    }
  }
  
  handler.help = ['resetautoai']
  handler.tags = ['owner']
  handler.command = /^resetautoai$/i
  handler.owner = true
  
  const __vxDefault = handler
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})
