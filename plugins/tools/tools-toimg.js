// tools/tools-toimg — satu file: metadata + kode fitur (gabungan dari engine2/plugins/tools/tools-toimg.js)
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "sticker2img",
    "stikertoimg"
  ],
  "category": "tools",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur sticker2img (dari Bot package)"
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/tools").split('\\').join('/')
module.exports = __vx.plugin("tools/tools-toimg", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/tools-toimg.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxUrl = require('url').pathToFileURL(__filename).href;
  const __vxExports = {};
  const { writeFileSync, unlinkSync, existsSync, mkdirSync } = require("fs");
  const { join, dirname } = require("path");
  const { fileURLToPath } = require("url");
  const sharp = __vxDef(require("sharp")); // untuk konversi WebP → PNG/JPG
  
  
  
  
  let handler = async (m, { conn, usedPrefix, command }) => {
      try {
          // pastikan ada sticker
          let q = m.quoted ? m.quoted : m
          let mime = (q.msg || q).mimetype || ''
  
          if (!/webp/.test(mime)) {
              return m.reply(
  `✨ *TOIMAGE ENGINE*
  Reply sticker untuk dikonversi menjadi gambar
  
  Contoh:
  ${usedPrefix + command}`
              )
          }
  
          // pastikan folder tmp ada
          const tmpDir = join(__dirname, '../../tmp')
          if (!existsSync(tmpDir)) mkdirSync(tmpDir)
  
          const inputPath = join(tmpDir, `${Date.now()}_sticker.webp`)
          const outputPath = join(tmpDir, `${Date.now()}_toimg.png`)
  
          const buffer = await q.download()
          writeFileSync(inputPath, buffer)
  
          // konversi WebP → PNG
          await sharp(inputPath)
              .png()
              .toFile(outputPath)
  
          const imgBuffer = Buffer.from(await sharp(outputPath).toBuffer())
  
          await conn.sendMessage(m.chat, {
              image: imgBuffer,
              caption: '✨ Sticker berhasil dikonversi menjadi gambar'
          }, { quoted: m })
  
          unlinkSync(inputPath)
          unlinkSync(outputPath)
  
      } catch (err) {
          console.error(err)
          return m.reply('❌ Gagal mengubah sticker menjadi gambar.')
      }
  }
  
  handler.help = ['toimg <reply sticker>']
  handler.tags = ['tools']
  handler.command = /^(toimg|sticker2img|stikertoimg)$/i
  handler.limit = true
  
  const __vxDefault = handler
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})
