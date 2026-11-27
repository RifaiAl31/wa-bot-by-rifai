// group/resettopaktif — satu file: metadata + kode fitur (gabungan dari engine1/plugins/group/resettopaktif.js)
const __vx = require("../../lib/adapter/e1.js")
const __meta = {
  "name": "resettopaktif",
  "command": [
    "resettopaktif",
    "resetactive",
    "resetleaderboard"
  ],
  "category": "group",
  "desc": "",
  "usage": ".resettopaktif",
  "owner": false,
  "group": true,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 2,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/group").split('\\').join('/')
module.exports = __vx.plugin("group/resettopaktif", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/resettopaktif.js'
  const module = { exports: {} }; const exports = module.exports;
  const fs = require('fs')
  const path = require('path')
  
  const DB_PATH = path.join(__dirname, '../../database/other/topaktif.json')
  if (!fs.existsSync(path.dirname(DB_PATH))) fs.mkdirSync(path.dirname(DB_PATH), { recursive: true })
  
  function saveDB(data) {
      fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2))
  }
  
  const pluginConfig = {
      name: 'resettopaktif',
      alias: ['resetactive', 'resetleaderboard'],
      category: 'group',
      usage: '.resettopaktif',
      cooldown: 5,
      energi: 2,
      isGroup: true,
      isAdmin: true
  }
  
  async function handler(m, { sock }) {
      try {
          const jid = m.chat
  
          let cmd = (m.command || '').toLowerCase()
          if (!cmd) {
              cmd = (m.text || '').trim().toLowerCase()
              cmd = cmd.replace(/^\./, '').split(' ')[0]
          }
  
          if (cmd === 'resettopaktif') {
              let db = {}
              if (fs.existsSync(DB_PATH)) db = JSON.parse(fs.readFileSync(DB_PATH))
              
              if (!db[jid]) db[jid] = {}
  
              // Set semua jadi 0
              for (let user in db[jid]) {
                  db[jid][user] = 0
              }
              
              saveDB(db)
  
              let reply = `╭───〔 🎤 *H O S H I N O* 〕───⬡
  ┃ ✨ *S Y S T E M • R E S E T*
  ╰───────────────────────⬡
  
  ✅ *Data Top Aktif berhasil direset!*
  📉 Semua poin diset ke **0**.
  📊 Mari mulai kompetisi lagi~
  
  ╭───────────────────────⬡
  ┃ ✨ WhatsApp Bot Idol
  ╰───────────────────────⬡`
              
              return m.reply(reply)
          }
  
      } catch (err) {
          console.error('[RESET TOPAKTIF ERROR]', err)
      }
  }
  
  module.exports = {
      config: pluginConfig,
      handler
  }
  return module.exports
})
