// canvas/meme3 — satu file: metadata + kode fitur (gabungan dari engine7/plugins/canvas/meme3.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "meme3",
  "command": [
    "meme3",
    "3panel"
  ],
  "category": "image",
  "desc": "Membuat meme 3 panel",
  "usage": ".meme3 <text1>|<text2>|<text3>",
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
module.exports = __vx.plugin("canvas/meme3", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/meme3.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const axios = __vxDef(require("axios"));
  const config = __vxDef(require("../../lib/ext/config.e7.js"));
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.e7.js"));
  
  const pluginConfig = {
      name: 'meme3',
      alias: ['3panel'],
      category: 'canvas',
      description: 'Membuat meme 3 panel',
      usage: '.meme3 <text1>|<text2>|<text3>',
      example: '.meme3 Kemarin ada apa?|Gak tau mau tidur|Kemaren kan lu belom beli',
      isOwner: false,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 10,
      energi: 1,
      isEnabled: true
  }
  
  async function handler(m, { sock }) {
      const input = m.text?.trim() || ''
      const parts = input.split('|').map(s => s.trim())
      
      if (parts.length < 3 || !parts[0] || !parts[1] || !parts[2]) {
          return m.reply(
              `🎭 *ᴍᴇᴍᴇ 3 ᴘᴀɴᴇʟ*\n\n` +
              `> Masukkan 3 teks dengan pemisah |\n\n` +
              `> Contoh: \`${m.prefix}meme3 Text1|Text2|Text3\``
          )
      }
      
      const text1 = parts[0]
      const text2 = parts[1]
      const text3 = parts[2]
      
      const apikey = config.zeroApi?.lolhuman
      if (!apikey) {
          return m.reply(`❌ API key lolhuman tidak dikonfigurasi!`)
      }
      
      m.react('🕕')
      
      try {
          await sock.sendMedia(m.chat, `https://api.lolhuman.xyz/api/meme6?apikey=${apikey}&text1=${encodeURIComponent(text1)}&text2=${encodeURIComponent(text2)}&text3=${encodeURIComponent(text3)}`, null, m, {
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
