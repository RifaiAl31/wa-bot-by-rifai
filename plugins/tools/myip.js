// tools/myip — satu file: metadata + kode fitur (gabungan dari engine7/plugins/tools/myip.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "myip",
  "command": [
    "myip",
    "botip",
    "publicip"
  ],
  "category": "tools",
  "desc": "Cek IP publik server bot",
  "usage": ".myip",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 10,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/tools").split('\\').join('/')
module.exports = __vx.plugin("tools/myip", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/myip.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  /*
    Fitur tambahan hasil audit FURINA V17 → WhatsApp Bot.
  */
  
  const axios = __vxDef(require("axios"));
  
  const pluginConfig = {
      name: 'myip',
      alias: ['botip', 'publicip'],
      category: 'tools',
      description: 'Cek IP publik server bot',
      usage: '.myip',
      example: '.myip',
      isOwner: true,
      cooldown: 10,
      energi: 0,
      isEnabled: true
  }
  
  async function handler(m) {
      try {
          m.react('🔎')
          const { data } = await axios.get('https://api.ipify.org?format=json', { timeout: 10000 })
          const ip = data?.ip
          if (!ip) throw new Error('IP kosong')
          return m.reply(`🔎 *IP Publik Bot:* ${ip}`)
      } catch (error) {
          console.error('[myip]', error)
          return m.reply('❌ Gagal mengambil IP publik server.')
      }
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
