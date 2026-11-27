// jpm/stopjpmbasic — satu file: metadata + kode fitur (gabungan dari engine7/plugins/jpm/stopjpmbasic.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "stopjpmbasic",
  "command": [
    "stopjpmbasic",
    "stopjpmb"
  ],
  "category": "broadcast",
  "desc": "Menghentikan JPM Basic yang sedang berjalan",
  "usage": ".stopjpmbasic",
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
module.exports = __vx.plugin("jpm/stopjpmbasic", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/stopjpmbasic.js'
  const __vxExports = {};
  const pluginConfig = {
      name: 'stopjpmbasic',
      alias: ['stopjpmb'],
      category: 'jpm',
      description: 'Menghentikan JPM Basic yang sedang berjalan',
      usage: '.stopjpmbasic',
      example: '.stopjpmbasic',
      isOwner: true,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 0,
      energi: 0,
      isEnabled: true
  }
  
  async function handler(m, { sock }) {
      if (!global.statusjpmbasic) {
          return m.reply(`❌ *ɢᴀɢᴀʟ*\n\n> Tidak ada JPM Basic yang sedang berjalan`)
      }
      
      global.stopjpmbasic = true
      m.react('⏹️')
      await m.reply(`⏹️ *sᴛᴏᴘ ᴊᴘᴍ ʙᴀsɪᴄ*\n\n> Menghentikan JPM Basic...`)
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
