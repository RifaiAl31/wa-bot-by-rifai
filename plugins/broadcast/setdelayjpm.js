// jpm/setdelayjpm — satu file: metadata + kode fitur (gabungan dari engine1/plugins/jpm/setdelayjpm.js)
const __vx = require("../../lib/adapter/e1.js")
const __meta = {
  "name": "setdelayjpm",
  "command": [
    "setdelayjpm",
    "delayjpm",
    "jedajpm",
    "setjedajpm"
  ],
  "category": "broadcast",
  "desc": "Atur jeda antar kirim JPM ke grup",
  "usage": ".setdelayjpm <ms>",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/jpm").split('\\').join('/')
module.exports = __vx.plugin("jpm/setdelayjpm", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/setdelayjpm.js'
  const module = { exports: {} }; const exports = module.exports;
  const { getDatabase } = require("../../lib/ext/src/lib/database.js")
  const config = require("../../lib/ext/config.js")
  
  const pluginConfig = {
      name: 'setdelayjpm',
      alias: ['delayjpm', 'jedajpm', 'setjedajpm'],
      category: 'jpm',
      description: 'Atur jeda antar kirim JPM ke grup',
      usage: '.setdelayjpm <ms>',
      example: '.setdelayjpm 3000',
      isOwner: true,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 5,
      energi: 0,
      isEnabled: true
  }
  
  async function handler(m, { sock }) {
      const db = getDatabase()
      const input = m.text?.trim()
      const current = db.setting('jedaJpm') || 5000
  
      if (!input) {
          return sock.sendMessage(m.chat, {
              text: `⏱️ *ᴊᴘᴍ ᴅᴇʟᴀʏ*\n\n` +
                  `> Delay saat ini: *${current}ms* (${(current / 1000).toFixed(1)}s)\n\n` +
                  `*ᴄᴀʀᴀ ᴘᴀᴋᴀɪ:*\n` +
                  `> \`${m.prefix}setdelayjpm <ms>\`\n\n` +
                  `*ᴄᴏɴᴛᴏʜ:*\n` +
                  `> \`${m.prefix}setdelayjpm 3000\` → 3 detik\n` +
                  `> \`${m.prefix}setdelayjpm 5000\` → 5 detik\n` +
                  `> \`${m.prefix}setdelayjpm 10000\` → 10 detik\n\n` +
                  `> Range: *1000ms - 30000ms*`,
              interactiveButtons: [
                  {
                      name: 'quick_reply',
                      buttonParamsJson: JSON.stringify({
                          display_text: '⏱️ 3 detik',
                          id: `${m.prefix}setdelayjpm 3000`
                      })
                  },
                  {
                      name: 'quick_reply',
                      buttonParamsJson: JSON.stringify({
                          display_text: '⏱️ 5 detik',
                          id: `${m.prefix}setdelayjpm 5000`
                      })
                  },
                  {
                      name: 'quick_reply',
                      buttonParamsJson: JSON.stringify({
                          display_text: '⏱️ 10 detik',
                          id: `${m.prefix}setdelayjpm 10000`
                      })
                  }
              ]
          }, { quoted: m })
      }
  
      const ms = parseInt(input)
  
      if (isNaN(ms) || ms < 1000 || ms > 30000) {
          return m.reply(`❌ *Ehh~* Delay harus antara *1000ms* (1s) sampai *30000ms* (30s)~ 🥺`)
      }
  
      db.setting('jedaJpm', ms)
  
      return sock.sendMessage(m.chat, {
          text: `✅ *ᴅᴇʟᴀʏ ᴊᴘᴍ ᴅɪᴜʙᴀʜ*\n\n` +
              `> Sebelumnya: *${current}ms* (${(current / 1000).toFixed(1)}s)\n` +
              `> Sekarang: *${ms}ms* (${(ms / 1000).toFixed(1)}s)\n\n` +
              `> Estimasi ${100} grup: *${Math.ceil((100 * ms) / 60000)} menit*`,
          interactiveButtons: [
              {
                  name: 'quick_reply',
                  buttonParamsJson: JSON.stringify({
                      display_text: '📢 Test JPM',
                      id: `${m.prefix}jpm`
                  })
              }
          ]
      }, { quoted: m })
  }
  
  module.exports = {
      config: pluginConfig,
      handler
  }
  
  return module.exports
})
