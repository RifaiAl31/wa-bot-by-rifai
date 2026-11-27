// tools/tools-rbg2 — satu file: metadata + kode fitur (gabungan dari engine2/plugins/tools/tools-rbg2.js)
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "removebg2"
  ],
  "category": "tools",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur removebg2 (dari Bot package)"
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/tools").split('\\').join('/')
module.exports = __vx.plugin("tools/tools-rbg2", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/tools-rbg2.js'
  const __vxExports = {};
  const { pixelcutRemove, removalAi } = require("../../lib/ext/lib/scrape/removebg.js");
  
  let handler = async (m, { conn, usedPrefix, command }) => {
    let q = m.quoted || m
    let mime = (q.msg || q).mimetype || ''
  
    if (!mime.startsWith('image/')) {
      throw `Reply / kirim gambar dengan caption ${usedPrefix + command}`
    }
  
    await m.react('✨')
  
    let media = await q.download()
    if (!media) throw 'Gagal mengambil gambar'
  
    if (media.length > 5 * 1024 * 1024) {
      throw 'Ukuran gambar terlalu besar (max 5MB)'
    }
  
    let result
  
    try {
      result = await pixelcutRemove(media)
    } catch {
      try {
        result = await removalAi(media)
      } catch {
        throw 'Gagal remove background, coba lagi nanti'
      }
    }
  
    let caption = `
  — remove background —
  
  ❀ status :
  Berhasil dihapus
  `.trim()
  
    await conn.sendMessage(
      m.chat,
      {
        image: result,
        caption
      },
      { quoted: m }
    )
  
    await m.react('✅')
  }
  
  handler.help = ['removebg2']
  handler.tags = ['tools']
  handler.command = /^removebg2?$/i
  handler.limit = true
  
  const __vxDefault = handler
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})
