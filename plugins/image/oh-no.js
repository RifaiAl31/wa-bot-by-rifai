// canvas/oh-no — satu file: metadata + kode fitur (gabungan dari engine7/plugins/canvas/oh-no.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "oh-no",
  "command": [
    "oh-no",
    "ohno",
    "ohnomeme"
  ],
  "category": "image",
  "desc": "Membuat meme oh no",
  "usage": ".oh-no <teks>",
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
module.exports = __vx.plugin("canvas/oh-no", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/oh-no.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const axios = __vxDef(require("axios"));
  const config = __vxDef(require("../../lib/ext/config.e7.js"));
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.e7.js"));
  
  const pluginConfig = {
      name: 'oh-no',
      alias: ['ohno', 'ohnomeme'],
      category: 'canvas',
      description: 'Membuat meme oh no',
      usage: '.oh-no <teks>',
      example: '.oh-no Aku lupa ngerjain PR',
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
              `😱 *ᴏʜ ɴᴏ ᴍᴇᴍᴇ*\n\n` +
              `> Masukkan teks untuk meme\n\n` +
              `> Contoh: \`${m.prefix}oh-no Aku lupa ngerjain PR\``
          )
      }
      
      const apikey = config.zeroApi?.lolhuman
      if (!apikey) {
          return m.reply(`❌ API key lolhuman tidak dikonfigurasi!`)
      }
      
      m.react('🕕')
      
      try {
          await sock.sendMedia(m.chat, `https://api.lolhuman.xyz/api/creator/ohno?apikey=${apikey}&text=${encodeURIComponent(text)}`, null, m, {
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
