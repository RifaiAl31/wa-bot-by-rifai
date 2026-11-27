// owner/delfiledb — satu file: metadata + kode fitur (gabungan dari engine1/plugins/owner/delfiledb.js)
const __vx = require("../../lib/adapter/e1.js")
const __meta = {
  "name": "delfiledb",
  "command": [
    "delfiledb",
    "dbdel",
    "hapusdb"
  ],
  "category": "owner",
  "desc": "Hapus file JSON dari database",
  "usage": ".delfiledb [namafile] [folder]",
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
module.exports = __vx.plugin("owner/delfiledb", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/delfiledb.js'
  const module = { exports: {} }; const exports = module.exports;
  const fs = require('fs')
  const path = require('path')
  
  const DATABASE_DIR = '/home/container/database/'
  
  const pluginConfig = {
      name: 'delfiledb',
      alias: ['dbdel', 'hapusdb'],
      category: 'owner',
      description: 'Hapus file JSON dari database',
      usage: '.delfiledb [namafile] [folder]',
      example: '.delfiledb userdata users',
      isOwner: true,
      cooldown: 5,
      isEnabled: true
  }
  
  async function handler(m) {
      const args = m.args
      const fileName = args[0]?.toLowerCase().replace(/[^a-z0-9]/g,'')
      const folderName = (args[1]?.toLowerCase().replace(/[^a-z0-9]/g,'') || 'other')
  
      if (!fileName) return m.reply('❌ *Ehh~* Masukkan nama file untuk dihapus~ 🥺')
  
      const filePath = path.join(DATABASE_DIR, folderName, `${fileName}.json`)
      if (!fs.existsSync(filePath)) return m.reply(`❌ *Ehh~* File ${fileName}.json tidak ditemukan~ 🥺`)
  
      fs.unlinkSync(filePath)
      m.react('✅')
      return m.reply(`✅ *Yatta~* File ${fileName}.json berhasil dihapus dari folder ${folderName} ✨`)
  }
  
  module.exports = { config: pluginConfig, handler }
  return module.exports
})
