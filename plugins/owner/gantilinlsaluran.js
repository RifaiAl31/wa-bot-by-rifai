// owner/gantilinlsaluran — satu file: metadata + kode fitur (gabungan dari engine7/plugins/owner/gantilinlsaluran.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "gantilinksaluran",
  "command": [
    "gantilinksaluran",
    "setlinksaluran"
  ],
  "category": "owner",
  "desc": "Mengganti semua link saluran di SC",
  "usage": ".gantilinksaluran|link",
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
module.exports = __vx.plugin("owner/gantilinlsaluran", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/gantilinlsaluran.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const fs = __vxDef(require("fs"));
  const path = __vxDef(require("path"));
  const pluginConfig = {
      name: 'gantilinksaluran',
      alias: ['setlinksaluran'],
      category: 'owner',
      description: 'Mengganti semua link saluran di SC',
      usage: '.gantilinksaluran|link',
      example: '.gantilinksaluran|https://whatsapp.com/channel/xxxxxxxxxxxx',
      isOwner: true,
      cooldown: 3,
      isEnabled: true
  }
  
  async function handler(m) {
  
      let msg = m.text || ""
      let input = msg.split("|")[1]
  
      if (!input) {
          return m.reply(`Contoh:
  .gantilinksaluran|https://whatsapp.com/channel/xxxxxxxxxxxx`)
      }
  
      const newLink = input.trim()
  
      function scan(dir){
          const files = fs.readdirSync(dir)
  
          for (let file of files){
              const full = path.join(dir, file)
              const stat = fs.statSync(full)
  
              if (stat.isDirectory()){
                  scan(full)
              } else if (file.endsWith(".js")){
                  let data = fs.readFileSync(full, "utf8")
  
                  // regex ganti semua link channel WA
                  let replaced = data.replace(/https:\/\/whatsapp\.com\/channel\/[a-zA-Z0-9]+/g, newLink)
  
                  fs.writeFileSync(full, replaced)
              }
          }
      }
  
      scan("./")
  
      await m.reply(`╭━━〔 💗 WhatsApp Bot SYSTEM 💗 〕━━⬣
  ┃ ✅ Link saluran berhasil diganti
  ┃
  ┃ 🔗 Link Baru :
  ┃ ${newLink}
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
