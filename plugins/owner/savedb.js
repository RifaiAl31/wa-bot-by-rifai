// owner/savedb — satu file: metadata + kode fitur (gabungan dari engine3/plugins/owner/savedb.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "savedb",
  "command": [
    "savedb",
    "backupdb",
    "downloaddb"
  ],
  "category": "owner",
  "desc": "Download file database",
  "usage": ".savedb",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 30,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/owner").split('\\').join('/')
module.exports = __vx.plugin("owner/savedb", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/savedb.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const moment = __vxDef(require("moment-timezone"));
  const fs = __vxDef(require("fs"));
  const path = __vxDef(require("path"));
  const config = __vxDef(require("../../lib/ext/config.e3.js"));
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.js"));
  const pluginConfig = {
      name: 'savedb',
      alias: ['backupdb', 'downloaddb', 'getdb'],
      category: 'owner',
      description: 'Download file database',
      usage: '.savedb',
      example: '.savedb',
      isOwner: true,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 30,
      energi: 0,
      isEnabled: true
  }
  async function handler(m, { sock }) {
      if (!config.isOwner(m.sender)) {
          return m.reply('❌ *Owner Only!*')
      }
      const dbPath = path.join(process.cwd(), 'database', 'db.json')
      if (!fs.existsSync(dbPath)) {
          return m.reply(`❌ File database tidak ditemukan!`)
      }
      try {
          const stats = fs.statSync(dbPath)
          const data = fs.readFileSync(dbPath)
          const now = moment().tz('Asia/Jakarta')
          const timestamp = now.format('YYYY-MM-DD_HH-mm-ss')
          const fileName = `db_backup_${timestamp}.json`
          await sock.sendMessage(m.chat, {
              document: data,
              fileName: fileName,
              mimetype: 'application/json',
              caption: `📦 *ᴅᴀᴛᴀʙᴀsᴇ ʙᴀᴄᴋᴜᴘ*\n\n` +
                  `╭┈┈⬡「 📋 *ɪɴғᴏ* 」\n` +
                  `┃ 📁 File: \`db.json\`\n` +
                  `┃ 📊 Size: \`${(stats.size / 1024).toFixed(2)} KB\`\n` +
                  `┃ 📅 Date: \`${now.format('DD/MM/YYYY')}\`\n` +
                  `┃ ⏰ Time: \`${now.format('HH:mm:ss')}\`\n` +
                  `╰┈┈┈┈┈┈┈┈⬡`
          }, { quoted: m })
      } catch (error) {
          await m.reply(te(m.prefix, m.command, m.pushName))
      }
  }
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
