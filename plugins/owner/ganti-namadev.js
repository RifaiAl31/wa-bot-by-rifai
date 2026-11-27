// owner/ganti-namadev — satu file: metadata + kode fitur (gabungan dari engine3/plugins/owner/ganti-namadev.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "ganti-namadev",
  "command": [
    "ganti-namadev",
    "setnamadev",
    "setnamedev",
    "gantideveloper"
  ],
  "category": "owner",
  "desc": "Ganti nama developer di config.js",
  "usage": ".ganti-namadev <nama baru>",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/owner").split('\\').join('/')
module.exports = __vx.plugin("owner/ganti-namadev", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/ganti-namadev.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const fs = __vxDef(require("fs"));
  const path = __vxDef(require("path"));
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.js"));
  const pluginConfig = {
      name: 'ganti-namadev',
      alias: ['setnamadev', 'setnamedev', 'gantideveloper'],
      category: 'owner',
      description: 'Ganti nama developer di config.js',
      usage: '.ganti-namadev <nama baru>',
      example: '.ganti-namadev WhatsApp Bot',
      isOwner: true,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 5,
      energi: 0,
      isEnabled: true
  }
  
  async function handler(m, { sock, config }) {
      const newName = m.args.join(' ')
      
      if (!newName) {
          return m.reply(`👨‍💻 *ɢᴀɴᴛɪ ɴᴀᴍᴀ ᴅᴇᴠᴇʟᴏᴘᴇʀ*\n\n> Nama saat ini: *${config.bot?.developer || '-'}*\n\n*Penggunaan:*\n\`${m.prefix}ganti-namadev <nama baru>\``)
      }
      
      try {
          const configPath = path.join(process.cwd(), 'config.js')
          let configContent = fs.readFileSync(configPath, 'utf8')
          
          configContent = configContent.replace(
              /developer:\s*['"]([^'"]*)['"]/,
              `developer: '${newName}'`
          )
          
          fs.writeFileSync(configPath, configContent)
          
          config.bot.developer = newName
          
          m.reply(`✅ *ʙᴇʀʜᴀsɪʟ*\n\n> Nama developer diganti ke: *${newName}*`)
          
      } catch (error) {
          await m.reply(te(m.prefix, m.command, m.pushName))
      }
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
