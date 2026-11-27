// owner/setversi — satu file: metadata + kode fitur (gabungan dari engine7/plugins/owner/setversi.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "setversi",
  "command": [
    "setversi",
    "setversion",
    "gantiversi",
    "updateversion"
  ],
  "category": "owner",
  "desc": "Update versi bot di config.js",
  "usage": ".setversi <versi_baru>",
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
module.exports = __vx.plugin("owner/setversi", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/setversi.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const fs = __vxDef(require("fs"));
  const path = __vxDef(require("path"));
  const { BOT_CORE_CONFIG } = require("../../lib/ext/config.e7.js");
  const config = __vxDef(require("../../lib/ext/config.e7.js"));
  const pluginConfig = {
      name: 'setversi',
      alias: ['setversion', 'gantiversi', 'updateversion'],
      category: 'owner',
      description: 'Update versi bot di config.js',
      usage: '.setversi <versi_baru>',
      example: '.setversi 2.5.1',
      isOwner: true,
      cooldown: 5,
      isEnabled: true
  }
  
  async function handler(m) {
      const args = m.args || []
      const newVersion = args[0]
      
      // Validasi format versi (semver: x.x.x atau x.x)
      const versionRegex = /^\d+(\.\d+){1,2}$/
      
      if (!newVersion || !versionRegex.test(newVersion)) {
          return m.reply(
  `╭───〔 𝗦𝗘𝗧𝗩𝗘𝗥𝗦𝗜 〕───⬣
  │
  │ ✦ *Cara Pakai*
  │
  │  𖦹 .setversi <versi_baru>
  │
  │ ✦ *Contoh*
  │
  │  𖦹 .setversi 2.5.1
  │  𖦹 .setversi 3.0.0
  │
  │ ✦ *Format*
  │
  │  𖦹 x.x.x atau x.x
  │
  ╰──────────────────⬣`
          )
      }
      
      m.react('⏳')
      
      try {
          const configPath = path.join(process.cwd(), 'config.js')
          
          if (!fs.existsSync(configPath)) {
              throw new Error('File config.js tidak ditemukan!')
          }
          
          // Baca file config.js
          let configContent = fs.readFileSync(configPath, 'utf8')
          
          // Cari versi lama
          const oldVersionMatch = configContent.match(/version:\s*['"`]([^'"`]+)['"`]/)
          const oldVersion = oldVersionMatch ? oldVersionMatch[1] : 'tidak diketahui'
          
          // Ganti versi dengan regex
          const newConfigContent = configContent.replace(
              /(version:\s*['"`])[^'"`]+(['"`])/,
              `$1${newVersion}$2`
          )
          
          // Tulis kembali ke config.js
          fs.writeFileSync(configPath, newConfigContent, 'utf8')
          
          // Update config yang sudah di-require
          if (config.bot) {
              BOT_CORE_CONFIG.bot.version = newVersion
          }
          
          m.react('✅')
          
          return m.reply(
  `╭───〔 𝗦𝗘𝗧𝗩𝗘𝗥𝗦𝗜 〕───⬣
  │
  │ ✦ *ᴠᴇʀꜱɪ ʙᴇʀʜᴀꜱɪʟ ᴅɪᴜʙᴀʜ*
  │
  │  🗑️ ᴠᴇʀꜱɪ ʟᴀᴍᴀ: \`${oldVersion}\`
  │  ✨ ᴠᴇʀꜱɪ ʙᴀʀᴜ: \`${newVersion}\`
  │
  │ ✦ *ᴄᴀᴛᴀᴛᴀɴ*
  │
  │  💾 ʀᴇꜱᴛᴀʀᴛ ʙᴏᴛ ᴊɪᴋᴀ ᴘᴇʀʟᴜ
  │
  ╰──────────────────⬣`
          )
          
      } catch (error) {
          console.error('[SetVersi] Error:', error)
          m.react('❌')
          return m.reply(
  `╭───〔 𝗘𝗥𝗥𝗢𝗥 〕───⬣
  │
  │ ❌ *ɢᴀɢᴀʟ ᴍᴇɴɢᴜʙᴀʜ ᴠᴇʀꜱɪ*
  │
  │ > ${error.message}
  │
  ╰──────────────────⬣`
          )
      }
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
