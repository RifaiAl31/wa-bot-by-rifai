// owner/setThumbnail — satu file: metadata + kode fitur (gabungan dari engine2/plugins/owner/setThumbnail.js)
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "setthumbnail"
  ],
  "category": "owner",
  "owner": true,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur setthumbnail (dari Bot package)"
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/owner").split('\\').join('/')
module.exports = __vx.plugin("owner/setThumbnail", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/setThumbnail.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  // plugins/owner/setthumbnail.js
  // Set Thumbnail Bot
  // Owner Only
  
  const fs = __vxDef(require("fs"));
  const path = __vxDef(require("path"));
  
  const THUMB_PATH = './lib/ext/media/thumbnail.jpg'
  
  let handler = async (m, { isOwner }) => {
    if (!isOwner) return m.reply('❌ Khusus Owner!')
  
    const quoted = m.quoted
  
    if (!quoted) {
      return m.reply(
        '🖼️ Reply gambar yang ingin dijadikan thumbnail!\n\n' +
        'Contoh:\n' +
        '.setthumbnail'
      )
    }
  
    try {
      const mime = quoted.mimetype || quoted.msg?.mimetype || ''
  
      if (!mime.startsWith('image/')) {
        return m.reply(
          '❌ Yang kamu reply bukan gambar!\n\n' +
          '📸 Reply gambar lalu ketik *.setthumbnail*'
        )
      }
  
      await m.reply('⏳ Menyimpan thumbnail...')
  
      const buffer = await quoted.download()
  
      if (!buffer || !buffer.length) {
        throw new Error('Gagal mengunduh gambar.')
      }
  
      const dir = path.dirname(THUMB_PATH)
  
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
      }
  
      // Timpa thumbnail lama
      fs.writeFileSync(THUMB_PATH, buffer)
  
      await m.reply(
        '✅ Thumbnail berhasil diganti!\n\n' +
        '🖼️ File: `./lib/ext/media/thumbnail.jpg`'
      )
  
    } catch (e) {
      console.error('SET THUMBNAIL ERROR:', e)
  
      await m.reply(
        `❌ Gagal mengganti thumbnail!\n\n${e?.message || e}`
      )
    }
  }
  
  handler.help = ['setthumbnail']
  handler.tags = ['owner']
  handler.command = /^setthumbnail$/i
  handler.owner = true
  
  const __vxDefault = handler
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})
