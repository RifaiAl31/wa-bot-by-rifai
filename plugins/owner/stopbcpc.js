// owner/stopbcpc — satu file: metadata + kode fitur (gabungan dari engine3/plugins/owner/stopbcpc.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "stopbcpc",
  "command": [
    "stopbcpc",
    "stopbroadcastpc"
  ],
  "category": "owner",
  "desc": "Hentikan broadcast private yang sedang berjalan",
  "usage": ".stopbcpc",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 3,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/owner").split('\\').join('/')
module.exports = __vx.plugin("owner/stopbcpc", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/stopbcpc.js'
  const __vxExports = {};
  const pluginConfig = {
    name: 'stopbcpc',
    alias: ['stopbroadcastpc'],
    category: 'owner',
    description: 'Hentikan broadcast private yang sedang berjalan',
    usage: '.stopbcpc',
    isOwner: true,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 3,
    energi: 0,
    isEnabled: true
  }
  
  async function handler(m) {
    if (!global.statusBcpc) {
      return m.reply('❌ Tidak ada broadcast private yang sedang berjalan.')
    }
    global.stopBcpc = true
    return m.reply('⏹️ Menghentikan broadcast private...')
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
