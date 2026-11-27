// canvas/meme2 — satu file: metadata + kode fitur (gabungan dari engine7/plugins/canvas/meme2.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "meme2",
  "command": [
    "meme2",
    "changemymind"
  ],
  "category": "image",
  "desc": "Membuat meme change my mind",
  "usage": ".meme2 <teks>",
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
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/canvas").split('\\').join('/')
module.exports = __vx.plugin("canvas/meme2", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/meme2.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const axios = __vxDef(require("axios"));
  const config = __vxDef(require("../../lib/ext/config.e7.js"));
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.e7.js"));
  
  const pluginConfig = {
      name: 'meme2',
      alias: ['changemymind'],
      category: 'canvas',
      description: 'Membuat meme change my mind',
      usage: '.meme2 <teks>',
      example: '.meme2 Tahu bacem enak banget',
      isOwner: false,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 10,
      energi: 1,
      isEnabled: true
  }
  
  async function handler(m, { sock }) {
      let text = m.text?.trim()
      
      if (!text && m.quoted?.text) {
          text = m.quoted.text.trim()
      }
      
      if (!text) {
          return m.reply(
              `🎭 *ᴄʜᴀɴɢᴇ ᴍʏ ᴍɪɴᴅ*\n\n` +
              `> Masukkan teks untuk meme\n\n` +
              `> Contoh: \`${m.prefix}meme2 Tahu bacem enak\``
          )
      }
      
      const apikey = config.zeroApi?.lolhuman
      if (!apikey) {
          return m.reply(`❌ API key lolhuman tidak dikonfigurasi!`)
      }
      
      m.react('🕕')
      
      try {
          await sock.sendMedia(m.chat, `https://api.lolhuman.xyz/api/meme4?apikey=${apikey}&text=${encodeURIComponent(text)}`, null, m, {
              type: 'image',
          })
          
          m.react('✅')
          
      } catch (err) {
          m.react('☢')
          m.reply(te(m.prefix, m.command, m.pushName))
      }
  }
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
