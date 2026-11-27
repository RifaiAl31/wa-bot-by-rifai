// maker/maker-wq — satu file: metadata + kode fitur (gabungan dari engine2/plugins/maker/maker-wq.js)
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "wq"
  ],
  "category": "maker",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur wq (dari Bot package)"
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/maker").split('\\').join('/')
module.exports = __vx.plugin("maker/maker-wq", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/maker-wq.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const { createCanvas, loadImage, GlobalFonts } = require("@napi-rs/canvas");
  const { writeFile, mkdir } = require("node:fs/promises");
  const { existsSync } = require("node:fs");
  const { join } = require("node:path");
  const axios = __vxDef(require("axios"));
  
  const BG_URL =
    'https://raw.githubusercontent.com/ryyntwx/allimagerin/refs/heads/main/wdws.png'
  
  let handler = async (m, { conn, text, command }) => {
    if (!text) {
      return m.reply(
        `*Format salah!*\n\nContoh penggunaan:\n.${command} just friend kok manggil sayang dan cemburu`
      )
    }
  
    try {
      await m.reply('⏳ Memproses pembuatan gambar...')
  
      const ASSETS_DIR = join(process.cwd(), 'assets', 'wdws_meme')
      const FONTS_DIR = join(ASSETS_DIR, 'fonts')
      const BG_LOCAL = join(ASSETS_DIR, 'template_wdws.png')
  
      await mkdir(FONTS_DIR, { recursive: true })
  
      const fontConfigs = [
        {
          url: 'https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuFuYAZ9hiJ-Ek-_EeA.woff2',
          name: 'Inter-Bold.ttf',
          family: 'InterBoldMeme'
        }
      ]
  
      for (const font of fontConfigs) {
        const fontPath = join(FONTS_DIR, font.name)
  
        if (!existsSync(fontPath)) {
          const res = await axios.get(font.url, {
            responseType: 'arraybuffer',
            headers: {
              'User-Agent': 'Mozilla/5.0'
            }
          })
  
          await writeFile(fontPath, Buffer.from(res.data))
        }
  
        GlobalFonts.registerFromPath(fontPath, font.family)
      }
  
      if (!existsSync(BG_LOCAL)) {
        const res = await axios.get(BG_URL, {
          responseType: 'arraybuffer',
          headers: {
            'User-Agent': 'Mozilla/5.0'
          }
        })
  
        await writeFile(BG_LOCAL, Buffer.from(res.data))
      }
  
      const bgImg = await loadImage(BG_LOCAL)
  
      const canvas = createCanvas(bgImg.width, bgImg.height)
      const ctx = canvas.getContext('2d')
  
      ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height)
  
      const x = 127
      const y = 406
      const w = 450
      const h = 601
  
      let fontSize = 150
      const lineHeight = 1.3
  
      const rawText = text.trim()
  
      ctx.fillStyle = '#1c1d21'
      ctx.textBaseline = 'top'
  
      function getWrappedLines(context, str, maxWidth) {
        const words = str.split(/\s+/)
        const lines = []
  
        let current = ''
  
        for (let i = 0; i < words.length; i++) {
          if (!words[i]) continue
  
          const test = current + words[i] + ' '
  
          if (context.measureText(test.trim()).width > maxWidth && i > 0) {
            lines.push(current.trim())
            current = words[i] + ' '
          } else {
            current = test
          }
        }
  
        if (current.trim()) lines.push(current.trim())
  
        return lines
      }
          ctx.font = `700 ${fontSize}px InterBoldMeme`
  
      let lines = getWrappedLines(ctx, rawText, w)
      let totalHeight = lines.length * (fontSize * lineHeight)
  
      // Auto resize font sampai muat di area
      while (totalHeight > h && fontSize > 24) {
        fontSize -= 4
  
        ctx.font = `700 ${fontSize}px InterBoldMeme`
  
        lines = getWrappedLines(ctx, rawText, w)
        totalHeight = lines.length * (fontSize * lineHeight)
      }
  
      // Auto center secara vertikal
      let startY = y
  
      if (totalHeight < h) {
        startY = y + ((h - totalHeight) / 2)
      }
  
      const wordCount = rawText
        .split(/\s+/)
        .filter(Boolean)
        .length
  
      // Render text
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        const currentY = startY + (i * (fontSize * lineHeight))
  
        if (currentY + fontSize > y + h) break
  
        if (wordCount === 1) {
          ctx.textAlign = 'center'
          ctx.fillText(
            line,
            x + (w / 2),
            currentY
          )
        } else {
          ctx.textAlign = 'left'
          ctx.fillText(
            line,
            x,
            currentY
          )
        }
      }
  
      // Encode langsung ke Buffer
      const buffer = await canvas.encode('png')
  
      const caption =
        `💬 *Quotes Windows Done*\n\n"${rawText}"`
            await conn.sendFile(
        m.chat,
        buffer,
        'meme_wdws.png',
        caption,
        m
      )
  
    } catch (err) {
      console.error(err)
  
      m.reply(
        `❌ Terjadi kesalahan saat memproses gambar\n\n${err.message}`
      )
    }
  }
  
  handler.help = ['wq <text>']
  handler.tags = ['maker']
  handler.command = ['wq']
  
  const __vxDefault = handler
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})
