// tools/txt2qr — satu file: metadata + kode fitur (gabungan dari engine3/plugins/tools/txt2qr.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "txt2qr",
  "command": [
    "txt2qr",
    "texttoqr",
    "qrcreate"
  ],
  "category": "tools",
  "desc": "Generate QR code dari teks",
  "usage": ".txt2qr <text>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/tools").split('\\').join('/')
module.exports = __vx.plugin("tools/txt2qr", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/txt2qr.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const axios = __vxDef(require("axios"));
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.js"));
  const pluginConfig = {
      name: 'txt2qr',
      alias: ['texttoqr', 'qrcode', 'qrcreate'],
      category: 'tools',
      description: 'Generate QR code dari teks',
      usage: '.txt2qr <text>',
      example: '.txt2qr https://google.com',
      isOwner: false,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 5,
      energi: 0,
      isEnabled: true
  }
  
  async function handler(m, { sock }) {
      const text = m.args.join(' ')
      
      if (!text) {
          return m.reply(`📱 *ᴛᴇxᴛ ᴛᴏ Qʀ*\n\n> Masukkan teks/URL\n\n\`Contoh: ${m.prefix}txt2qr https://google.com\``)
      }
      
      m.react('📱')
      
      try {
          const url = `https://api-faa.my.id/faa/qr-create?text=${encodeURIComponent(text)}`
          const res = await axios.get(url, {
              responseType: 'arraybuffer',
              timeout: 30000
          })
          
          m.react('✅')
          
          await sock.sendMessage(m.chat, {
              image: Buffer.from(res.data),
              caption: `📱 *Qʀ ᴄᴏᴅᴇ*\n\n> ${text.substring(0, 100)}${text.length > 100 ? '...' : ''}`
          }, { quoted: m })
          
      } catch (error) {
          m.react('☢')
          m.reply(te(m.prefix, m.command, m.pushName))
      }
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
