// owner/getjpg — satu file: metadata + kode fitur (gabungan dari engine7/plugins/owner/getjpg.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "getjpg",
  "command": [
    "getjpg",
    "lihatjpg",
    "showjpg"
  ],
  "category": "owner",
  "desc": "Ambil gambar dari folder assets/images",
  "usage": ".getjpg <nama_file.jpg>",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/owner").split('\\').join('/')
module.exports = __vx.plugin("owner/getjpg", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/getjpg.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const fs = __vxDef(require("fs"));
  const path = __vxDef(require("path"));
  const config = __vxDef(require("../../lib/ext/config.e7.js"));
  const pluginConfig = {
      name: 'getjpg',
      alias: ['lihatjpg', 'showjpg'],
      category: 'owner',
      description: 'Ambil gambar dari folder assets/images',
      usage: '.getjpg <nama_file.jpg>',
      example: '.getjpg WhatsApp Bot.jpg',
      isOwner: true,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 5,
      energi: 0,
      isEnabled: true
  }
  
  async function handler(m, { sock }) {
      const args = m.args || []
      const fileName = args[0]?.trim()
  
      if (!fileName) {
          return m.reply(`❌ Gunakan:\n.getjpg <nama_file.jpg>\nContoh: .getjpg WhatsApp Bot.jpg`)
      }
  
      const filePath = path.join(process.cwd(), 'assets', 'images', fileName)
  
      if (!fs.existsSync(filePath)) {
          return m.reply(`❌ File tidak ditemukan!\n> Cek nama file dan pastikan sudah tersimpan di assets/images`)
      }
  
      try {
          const buffer = fs.readFileSync(filePath)
          await sock.sendMessage(m.chat, {
              image: buffer,
              caption: `📸 *WhatsApp Bot Gallery*\n\n> File: ${fileName}`,
          }, { quoted: m })
  
      } catch (err) {
          m.reply(`❌ *Error*: ${err.message}`)
      }
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
