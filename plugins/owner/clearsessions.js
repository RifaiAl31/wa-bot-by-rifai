// owner/clearsessions — satu file: metadata + kode fitur (gabungan dari engine3/plugins/owner/clearsessions.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "clearsessions",
  "command": [
    "clearsessions",
    "clearsession",
    "delsession",
    "delsessions"
  ],
  "category": "owner",
  "desc": "Menghapus semua session di storage/sessions/",
  "usage": ".clearsessions",
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
module.exports = __vx.plugin("owner/clearsessions", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/clearsessions.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const fs = __vxDef(require("fs"));
  const path = __vxDef(require("path"));
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.js"));
  const pluginConfig = {
      name: 'clearsessions',
      alias: ['clearsession', 'delsession', 'delsessions'],
      category: 'owner',
      description: 'Menghapus semua session di storage/sessions/',
      usage: '.clearsessions',
      example: '.clearsessions',
      isOwner: true,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 60,
      energi: 0,
      isEnabled: true
  }
  
  async function handler(m)  {
      const sessionsPath = path.join(process.cwd(), 'storage', 'sessions')
      
      if (!fs.existsSync(sessionsPath)) {
          return m.reply(`❌ Folder sessions tidak ditemukan!`)
      }
      
      await m.react('🗑️')
      
      try {
          const files = fs.readdirSync(sessionsPath)
          
          if (files.length === 0) {
              return m.reply(`📁 Folder sessions sudah kosong!`)
          }
          
          let deleted = 0
          let skipped = 0
          
          for (const file of files) {
              if (file === 'creds.json') {
                  skipped++
                  continue
              }
              
              const filePath = path.join(sessionsPath, file)
              try {
                  const stat = fs.statSync(filePath)
                  if (stat.isDirectory()) {
                      fs.rmSync(filePath, { recursive: true, force: true })
                  } else {
                      fs.unlinkSync(filePath)
                  }
                  deleted++
              } catch {}
          }
          
          await m.react('✅')
          await m.reply(
              `╭┈┈⬡「 🗑️ *ᴄʟᴇᴀʀ sᴇssɪᴏɴs* 」
  ┃
  ┃ ㊗ ᴅᴇʟᴇᴛᴇᴅ: *${deleted}* file
  ┃ ㊗ sᴋɪᴘᴘᴇᴅ: *${skipped}* file
  ┃ ㊗ ɴᴏᴛᴇ: creds.json tidak dihapus
  ┃
  ╰┈┈⬡
  
  > _Session files berhasil dibersihkan!_
  > _Restart bot jika diperlukan._`
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
