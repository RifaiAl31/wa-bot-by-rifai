// search/chords — satu file: metadata + kode fitur (gabungan dari engine3/plugins/search/chords.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "chords",
  "command": [
    "chords",
    "chord",
    "kunci",
    "kuncigitar"
  ],
  "category": "search",
  "desc": "Cari chord/kunci gitar lagu",
  "usage": ".chords <judul lagu>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [
      "neoxr"
    ],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/search").split('\\').join('/')
module.exports = __vx.plugin("search/chords", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/chords.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const axios = __vxDef(require("axios"));
  const config = __vxDef(require("../../lib/ext/config.e3.js"));
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.js"));
  const pluginConfig = {
      name: 'chords',
      alias: ['chord', 'kunci', 'kuncigitar'],
      category: 'search',
      description: 'Cari chord/kunci gitar lagu',
      usage: '.chords <judul lagu>',
      example: '.chords komang',
      isOwner: false,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 5,
      energi: 0,
      isEnabled: true
  }
  
  const NEOXR_APIKEY = config.APIkey?.neoxr || ''
  
  async function handler(m, { sock }) {
      const text = m.text?.trim()
      
      if (!text) {
          return m.reply(
              `🎸 *ᴄʜᴏʀᴅs sᴇᴀʀᴄʜ*\n\n` +
              `> Cari chord/kunci gitar lagu\n\n` +
              `> Contoh:\n` +
              `\`${m.prefix}chords komang\`\n` +
              `\`${m.prefix}chord perjalanan terindah\``
          )
      }
      
      m.react('🕕')
      
      try {
          const { data } = await axios.get(`https://api.neoxr.eu/api/chord?q=${encodeURIComponent(text)}&apikey=${NEOXR_APIKEY}`, {
              timeout: 30000
          })
          
          if (!data?.status || !data?.data?.chord) {
              m.react('❌')
              return m.reply(`❌ Chord tidak ditemukan untuk: \`${text}\``)
          }
          
          const chord = data.data.chord
  
          const caption = `${chord}`
          await m.reply(caption)
          m.react('✅')
          
      } catch (err) {
          m.react('☢')
          return m.reply(te(m.prefix, m.command, m.pushName))
      }
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
