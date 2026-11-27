// sticker/animebrat — satu file: metadata + kode fitur (gabungan dari engine3/plugins/sticker/animebrat.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "bratanime",
  "command": [
    "bratanime",
    "animebrat"
  ],
  "category": "sticker",
  "desc": "Membuat sticker brat",
  "usage": ".animebrat <text>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 10,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/sticker").split('\\').join('/')
module.exports = __vx.plugin("sticker/animebrat", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/animebrat.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const axios = __vxDef(require("axios"));
  const config = __vxDef(require("../../lib/ext/config.e3.js"));
  const { f } = require("../../lib/ext/src/lib/vanxone-http.js");
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.js"));
  const pluginConfig = {
      name: 'bratanime',
      alias: ['animebrat'],
      category: 'sticker',
      description: 'Membuat sticker brat',
      usage: '.animebrat <text>',
      example: '.animebrat Hai semua',
      isOwner: false,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 10,
      energi: 1,
      isEnabled: true
  }
  
  async function handler(m, { sock }) {
      const text = m.args.join(' ')
      if (!text) {
          return m.reply(`🖼️ *ʙʀᴀᴛ ᴀɴɪᴍᴇ sᴛɪᴄᴋᴇʀ*\n\n> Masukkan teks\n\n\`Contoh: ${m.prefix}animebrat Hai semua\``)
      }
      
      m.react('🕕')
      
      try {
          const url = `https://api.nexray.web.id/maker/bratanime?text=${encodeURIComponent(text)}`
          await sock.sendImageAsSticker(m.chat, url, m, {
              packname: config.sticker.packname,
              author: config.sticker.author
          })
          m.react('✅')
      } catch (error) { globalThis.__vanxoneCatch?.(error);
          m.react('☢')
          m.reply(te(m.prefix, m.command, m.pushName))
      }
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
