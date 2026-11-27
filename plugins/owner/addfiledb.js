// owner/addfiledb — satu file: metadata + kode fitur (gabungan dari engine1/plugins/owner/addfiledb.js)
const __vx = require("../../lib/adapter/e1.js")
const __meta = {
  "name": "addfiledb",
  "command": [
    "addfiledb",
    "dbadd",
    "tambahdb"
  ],
  "category": "owner",
  "desc": "Tambah file JSON baru ke database",
  "usage": ".addfiledb [namafile] [folder]",
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
module.exports = __vx.plugin("owner/addfiledb", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/addfiledb.js'
  const module = { exports: {} }; const exports = module.exports;
  const fs = require('fs')
  const path = require('path')
  
  const DATABASE_DIR = '/home/container/database/'
  
  const pluginConfig = {
      name: 'addfiledb',
      alias: ['dbadd', 'tambahdb'],
      category: 'owner',
      description: 'Tambah file JSON baru ke database',
      usage: '.addfiledb [namafile] [folder]',
      example: '.addfiledb userdata users',
      isOwner: true,
      cooldown: 5,
      isEnabled: true
  }
  
  async function handler(m, { sock }) {
      const quoted = m.quoted
      const args = m.args
  
      if (!quoted) return m.reply(
  `📦 *ᴀᴅᴅ ᴅᴀᴛᴀʙᴀsᴇ*
  > Reply file dengan caption:
  > \`${m.prefix}addfiledb\` - Auto detect
  > \`${m.prefix}addfiledb namafile\` - Custom nama
  > \`${m.prefix}addfiledb namafile folder\` - Custom nama + folder`
      )
  
      let code = quoted.text || quoted.body || '{}'
      if (quoted.filename || quoted.mimetype) {
          try { code = (await quoted.download()).toString() } 
          catch { return m.reply('❌ *Gomen ne~* Gagal download file~ 🥺') }
      }
  
      if (!code) code = '{}'
  
      const fileName = (args[0] || 'file').toLowerCase().replace(/[^a-z0-9]/g,'')
      const folderName = (args[1] || 'other').toLowerCase().replace(/[^a-z0-9]/g,'')
      const folderPath = path.join(DATABASE_DIR, folderName)
      const filePath = path.join(folderPath, `${fileName}.json`)
  
      if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath, { recursive: true })
      if (fs.existsSync(filePath)) return m.reply(`❌ *Ehh~* File ${fileName}.json sudah ada~ 🥺`)
  
      fs.writeFileSync(filePath, code)
      m.react('✅')
      return m.reply(`✅ File JSON berhasil ditambahkan!\n📁 Folder: ${folderName}\n📝 Nama: ${fileName}.json\n📊 Size: ${code.length} bytes`)
  }
  
  module.exports = { config: pluginConfig, handler }
  return module.exports
})
