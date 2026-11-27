// canvas/pacarsertifikat — satu file: metadata + kode fitur (gabungan dari engine7/plugins/canvas/pacarsertifikat.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "pacarsertifikat",
  "command": [
    "pacarsertifikat",
    "sertifikatpacar",
    "certpacar",
    "pacarcert"
  ],
  "category": "image",
  "desc": "Membuat sertifikat pacar",
  "usage": ".pacarsertifikat <nama1> <nama2>",
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
module.exports = __vx.plugin("canvas/pacarsertifikat", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/pacarsertifikat.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const axios = __vxDef(require("axios"));
  const config = __vxDef(require("../../lib/ext/config.e7.js"));
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.e7.js"));
  
  const pluginConfig = {
      name: 'pacarsertifikat',
      alias: ['sertifikatpacar', 'certpacar', 'pacarcert'],
      category: 'canvas',
      description: 'Membuat sertifikat pacar',
      usage: '.pacarsertifikat <nama1> <nama2>',
      example: '.pacarsertifikat Budi Ani',
      isOwner: false,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 10,
      energi: 1,
      isEnabled: true
  }
  
  async function handler(m, { sock }) {
      const args = m.args || []
      
      if (args.length < 2) {
          return m.reply(
              `💑 *sᴇʀᴛɪꜰɪᴋᴀᴛ ᴘᴀᴄᴀʀ*\n\n` +
              `╭┈┈⬡「 📋 *ᴄᴀʀᴀ ᴘᴀᴋᴀɪ* 」\n` +
              `┃ ◦ \`${m.prefix}pacarsertifikat <nama1> <nama2>\`\n` +
              `╰┈┈⬡\n\n` +
              `> Contoh: \`${m.prefix}pacarsertifikat Budi Ani\``
          )
      }
      
      const name1 = args[0]
      const name2 = args.slice(1).join(' ')
      
      m.react('💑')
      
      try {
          const apiKey = config.zeroApi?.lolhuman
          
          if (!apiKey) {
              throw new Error('API Key tidak ditemukan di config')
          }
          
          const apiUrl = `https://api.lolhuman.xyz/api/pacarserti?apikey=${apiKey}&name1=${encodeURIComponent(name1)}&name2=${encodeURIComponent(name2)}`
          
          await sock.sendMedia(m.chat, apiUrl, null, m, {
              type: 'image',
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
