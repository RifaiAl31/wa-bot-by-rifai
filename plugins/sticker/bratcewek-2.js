// sticker/bratcewek — satu file: metadata + kode fitur (gabungan dari engine4/plugins/sticker/bratcewek.js)
const __vx = require("../../lib/adapter/e4.js")
const __meta = {
  "name": "cewek",
  "command": [
    "cewek"
  ],
  "category": "sticker",
  "desc": "Membuat sticker cewek dengan teks",
  "usage": ".cewek <text>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 10,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/sticker").split('\\').join('/')
module.exports = __vx.plugin("sticker/bratcewek", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/bratcewek.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const axios = __vxDef(require("axios"));
  const config = __vxDef(require("../../lib/ext/config.e4.js"));
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.e4.js"));
  const pluginConfig = {
      name: 'cewek',
      alias: [],
      category: 'sticker',
      description: 'Membuat sticker cewek dengan teks',
      usage: '.cewek <text>',
      example: '.cewek Hai semua',
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
          return m.reply(`🖼️ *ᴄᴇᴡᴇᴋ sᴛɪᴄᴋᴇʀ*\n\n> Masukkan teks\n\n\`Contoh: ${m.prefix}cewek Hai semua\``)
      }
      
      m.react('🕕')
      
      try {
          const url = `https://api.deline.web.id/maker/cewekbrat?text=${encodeURIComponent(text)}`
          await sock.sendImageAsSticker(m.chat, url, m, {
              packname: config.sticker.packname,
              author: config.sticker.author
          })
          m.react('✅')
      } catch (error) {
          m.react('☢')
          m.reply(te(m.prefix, m.command, m.pushName))
      }
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
