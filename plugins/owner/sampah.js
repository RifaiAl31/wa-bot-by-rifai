// owner/sampah — satu file: metadata + kode fitur (gabungan dari engine3/plugins/owner/sampah.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "sampah",
  "command": [
    "sampah",
    "clearsampah",
    "cleartemp",
    "deltemp"
  ],
  "category": "owner",
  "desc": "Menghapus semua sampah di temp",
  "usage": ".sampah",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 60,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/owner").split('\\').join('/')
module.exports = __vx.plugin("owner/sampah", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/sampah.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const fs = __vxDef(require("fs"));
  const path = __vxDef(require("path"));
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.js"));
  const pluginConfig = {
      name: 'sampah',
      alias: ['clearsampah', 'cleartemp', 'deltemp'],
      category: 'owner',
      description: 'Menghapus semua sampah di temp',
      usage: '.sampah',
      example: '.sampah',
      isOwner: true,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 60,
      energi: 0,
      isEnabled: true
  }
  
  async function handler(m) {
      const tempPath = path.join(process.cwd(), 'temp')
  
      if (!fs.existsSync(tempPath)) {
          return m.reply('❌ Folder temp tidak ditemukan!')
      }
  
      await m.react('🗑️')
  
      try {
          const files = fs.readdirSync(tempPath)
  
          if (!files.length) {
              return m.reply('📁 Folder temp sudah kosong!')
          }
  
          let deleted = 0
  
          for (const file of files) {
              const filePath = path.join(tempPath, file)
  
              fs.rmSync(filePath, { recursive: true, force: true })
              deleted++
          }
  
          await m.react('✅')
          await m.reply(
              `🗑️ *TEMP CLEANED!*\n\n` +
              `> Total file/folder dihapus: *${deleted}*`
          )
  
      } catch (error) {
          await m.react('☢')
          await m.reply(te(m.prefix, m.command, m.pushName))
      }
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
