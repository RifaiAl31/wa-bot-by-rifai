// jpm/stopjpm — satu file: metadata + kode fitur (gabungan dari engine1/plugins/jpm/stopjpm.js)
const __vx = require("../../lib/adapter/e1.js")
const __meta = {
  "name": "stopjpm",
  "command": [
    "stopjpm",
    "stopjasher",
    "stopjaser"
  ],
  "category": "broadcast",
  "desc": "Hentikan proses JPM",
  "usage": ".stopjpm",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 0,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/jpm").split('\\').join('/')
module.exports = __vx.plugin("jpm/stopjpm", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/stopjpm.js'
  const module = { exports: {} }; const exports = module.exports;
  const pluginConfig = {
      name: 'stopjpm',
      alias: ['stopjasher', 'stopjaser'],
      category: 'jpm',
      description: 'Hentikan proses JPM',
      usage: '.stopjpm',
      example: '.stopjpm',
      isOwner: true,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 0,
      energi: 0,
      isEnabled: true
  }
  
  async function handler(m, { sock }) {
      if (!global.statusjpm) {
          return m.reply(`❌ *Gomen ne~* ✦\n\n> Tidak ada JPM yang sedang berjalan~ 🥺`)
      }
      
      global.stopjpm = true
      
      m.react('⏹️')
      await m.reply(`⏹️ *sᴛᴏᴘ ᴊᴘᴍ*\nMenghentikan proses JPM...`)
  }
  
  module.exports = {
      config: pluginConfig,
      handler
  }
  
  return module.exports
})
