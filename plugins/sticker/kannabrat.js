// sticker/kannabrat — satu file: metadata + kode fitur (gabungan dari engine7/plugins/sticker/kannabrat.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "kannabrat",
  "command": [
    "kannabrat",
    "kanna",
    "kannagen"
  ],
  "category": "sticker",
  "desc": "Membuat sticker Kanna dengan teks",
  "usage": ".kannabrat <teks>",
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
module.exports = __vx.plugin("sticker/kannabrat", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/kannabrat.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const axios = __vxDef(require("axios"));
  const config = __vxDef(require("../../lib/ext/config.e7.js"));
  const pluginConfig = {
      name: 'kannabrat',
      alias: ['kanna', 'kannagen'],
      category: 'sticker',
      description: 'Membuat sticker Kanna dengan teks',
      usage: '.kannabrat <teks>',
      example: '.kannabrat Hello World',
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
              `🎀 *ᴋᴀɴɴᴀ ʙʀᴀᴛ*\n\n` +
              `> Masukkan teks untuk sticker\n\n` +
              `> Contoh: \`${m.prefix}kannabrat Hello World\``
          )
      }
      
      if (text.length > 50) {
          return m.reply(`❌ Teks terlalu panjang! Maksimal 50 karakter.`)
      }
      
      const apikey = config.APIkey?.lolhuman
      if (!apikey) {
          return m.reply(`❌ API key lolhuman tidak dikonfigurasi!`)
      }
      
      m.react('🎀')
      
      try {
          const apiUrl = `https://api.lolhuman.xyz/api/creator/kannagen?apikey=${apikey}&text=${encodeURIComponent(text)}`
          const response = await axios.get(apiUrl, { 
              responseType: 'arraybuffer',
              timeout: 30000 
          })
          
          await sock.sendImageAsSticker(m.chat, Buffer.from(response.data), m)
          
          m.react('✅')
          
      } catch (err) {
          m.react('❌')
          m.reply(`❌ *ᴇʀʀᴏʀ*\n\n> ${err.message}`)
      }
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
