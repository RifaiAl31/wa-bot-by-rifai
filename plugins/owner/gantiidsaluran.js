// owner/gantiidsaluran — satu file: metadata + kode fitur (gabungan dari engine7/plugins/owner/gantiidsaluran.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "gantiidsaluran",
  "command": [
    "gantiidsaluran",
    "setidsaluran"
  ],
  "category": "owner",
  "desc": "Mengganti semua ID saluran di SC",
  "usage": ".gantiidsaluran|id",
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
module.exports = __vx.plugin("owner/gantiidsaluran", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/gantiidsaluran.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const fs = __vxDef(require("fs"));
  const path = __vxDef(require("path"));
  const pluginConfig = {
      name: 'gantiidsaluran',
      alias: ['setidsaluran'],
      category: 'owner',
      description: 'Mengganti semua ID saluran di SC',
      usage: '.gantiidsaluran|id',
      example: '.gantiidsaluran|120363xxxx@newsletter',
      isOwner: true,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 3,
      energi: 0,
      isEnabled: true
  }
  
  async function handler(m) {
  
      let msg = m.text || ""
      let input = msg.split("|")[1]
  
      if (!input) {
          return m.reply("Contoh:\n.gantiidsaluran|120363xxxx@newsletter")
      }
  
      const newId = input.trim()
  
      function scan(dir){
          const files = fs.readdirSync(dir)
  
          for (let file of files){
              const full = path.join(dir, file)
              const stat = fs.statSync(full)
  
              if (stat.isDirectory()){
                  scan(full)
              } else if (file.endsWith(".js")){
                  let data = fs.readFileSync(full, "utf8")
  
                  let replaced = data.replace(/\d+@newsletter/g, newId)
  
                  fs.writeFileSync(full, replaced)
              }
          }
      }
  
      scan("./")
  
      await m.reply(`╭━━〔 ❤️ WhatsApp Bot SYSTEM ❤️ 〕━━⬣
  ┃ ✅ ID Saluran berhasil diganti
  ┃
  ┃ ID Baru :
  ┃ ${newId}
  ┃
  ┃ 🔄 Bot akan restart dalam 5 detik...
  ╰━━━━━━━━━━━━━━━━⬣`)
  
      setTimeout(() => {
          process.exit()
      }, 5000)
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
