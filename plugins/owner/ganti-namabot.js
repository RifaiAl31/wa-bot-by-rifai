// owner/ganti-namabot — satu file: metadata + kode fitur (gabungan dari engine3/plugins/owner/ganti-namabot.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "ganti-namabot",
  "command": [
    "ganti-namabot",
    "setnamabot",
    "setnamebot",
    "gantibot"
  ],
  "category": "owner",
  "desc": "Ganti nama bot di config.js",
  "usage": ".ganti-namabot <nama baru>",
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
module.exports = __vx.plugin("owner/ganti-namabot", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/ganti-namabot.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const fs = __vxDef(require("fs"));
  const path = __vxDef(require("path"));
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.js"));
  const pluginConfig = {
      name: 'ganti-namabot',
      alias: ['setnamabot', 'setnamebot', 'gantibot'],
      category: 'owner',
      description: 'Ganti nama bot di config.js',
      usage: '.ganti-namabot <nama baru>',
      example: '.ganti-namabot WhatsApp Bot',
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
          return m.reply(`🤖 *ɢᴀɴᴛɪ ɴᴀᴍᴀ ʙᴏᴛ*\n\n> Nama saat ini: *${config.bot?.name || '-'}*\n\n*Penggunaan:*\n\`${m.prefix}ganti-namabot <nama baru>\``)
      }
      
      try {
          const configPath = path.join(process.cwd(), 'config.js')
          let configContent = fs.readFileSync(configPath, 'utf8')
          
          configContent = configContent.replace(
              /bot:\s*\{[\s\S]*?name:\s*['"]([^'"]*)['"]/,
              (match, oldName) => match.replace(`'${oldName}'`, `'${newName}'`).replace(`"${oldName}"`, `'${newName}'`)
          )
          
          fs.writeFileSync(configPath, configContent)
          
          config.bot.name = newName
          
          m.reply(`✅ *ʙᴇʀʜᴀsɪʟ*\n\n> Nama bot diganti ke: *${newName}*`)
          
      } catch (error) {
          await m.reply(te(m.prefix, m.command, m.pushName))
      }
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
