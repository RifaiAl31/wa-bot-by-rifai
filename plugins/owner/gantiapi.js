// owner/gantiapi — satu file: metadata + kode fitur (gabungan dari engine7/plugins/owner/gantiapi.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "gantiapi",
  "command": [
    "gantiapi",
    "setapi"
  ],
  "category": "owner",
  "desc": "Mengganti API di plugin tertentu",
  "usage": ".gantiapi <plugin> <api>",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 3,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/owner").split('\\').join('/')
module.exports = __vx.plugin("owner/gantiapi", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/gantiapi.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const fs = __vxDef(require("fs"));
  const path = __vxDef(require("path"));
  const pluginConfig = {
      name: 'gantiapi',
      alias: ['setapi'],
      category: 'owner',
      description: 'Mengganti API di plugin tertentu',
      usage: '.gantiapi <plugin> <api>',
      example: '.gantiapi tomediafire sk-xxxx',
      isOwner: true,
      cooldown: 3,
      energi: 0,
      isEnabled: true
  }
  
  async function handler(m) {
  
      const args = m.args || []
  
      if (args.length < 2) {
          return m.reply(
  `╭━━〔 💗 WhatsApp Bot API SYSTEM 💗 〕━━⬣
  ┃
  ┃ Darling, formatnya salah 😖
  ┃
  ┃ Contoh :
  ┃ .gantiapi tomediafire sk-xxxx
  ┃
  ╰━━━━━━━━━━━━━━━━⬣`)
      }
  
      const pluginName = args[0]
      const newApi = args.slice(1).join(' ')
  
      const pluginPath = path.join(process.cwd(), 'plugins', `${pluginName}.js`)
  
      if (!fs.existsSync(pluginPath)) {
          return m.reply(
  `╭━━〔 ❌ WhatsApp Bot SYSTEM 〕━━⬣
  ┃ Plugin *${pluginName}* tidak ditemukan
  ╰━━━━━━━━━━━━━━━━⬣`)
      }
  
      try {
  
          let file = fs.readFileSync(pluginPath, 'utf8')
  
          const apiRegex = /(apiKey\s*[:=]\s*['"`])(.*?)(['"`])/i
  
          if (!apiRegex.test(file)) {
              return m.reply(
  `╭━━〔 ⚠️ WhatsApp Bot SYSTEM 〕━━⬣
  ┃ API tidak ditemukan di plugin
  ┃ *${pluginName}*
  ╰━━━━━━━━━━━━━━━━⬣`)
          }
  
          file = file.replace(apiRegex, `$1${newApi}$3`)
  
          fs.writeFileSync(pluginPath, file)
  
          await m.reply(
  `╭━━〔 💗 WhatsApp Bot API UPDATED 💗 〕━━⬣
  ┃
  ┃ Plugin : *${pluginName}*
  ┃ API baru : *${newApi}*
  ┃
  ┃ API berhasil diganti darling 😋
  ┃ Jangan lupa restart bot ya
  ┃
  ╰━━━━━━━━━━━━━━━━⬣`
          )
  
      } catch (err) {
  
          m.reply(
  `╭━━〔 ❌ WhatsApp Bot ERROR 〕━━⬣
  ┃ ${err.message}
  ╰━━━━━━━━━━━━━━━━⬣`)
      }
  
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
