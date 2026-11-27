// sticker/smemevid — satu file: metadata + kode fitur (gabungan dari engine3/plugins/sticker/smemevid.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "smemevid",
  "command": [
    "smemevideo",
    "memevid"
  ],
  "category": "sticker",
  "desc": "Membuat sticker meme dari video",
  "usage": ".smemevid <top>|<bottom>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 15,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/sticker").split('\\').join('/')
module.exports = __vx.plugin("sticker/smemevid", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/smemevid.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const fs = __vxDef(require("fs"));
  const path = __vxDef(require("path"));
  const os = __vxDef(require("os"));
  const ffmpeg = __vxDef(require("fluent-ffmpeg"));
  const ffmpegInstaller = __vxDef(require("@ffmpeg-installer/ffmpeg"));
  const { createCanvas } = require("@napi-rs/canvas");
  const config = __vxDef(require("../../lib/ext/config.e3.js"));
  
  ffmpeg.setFfmpegPath(ffmpegInstaller.path)
  
  const pluginConfig = {
      name: 'smemevid',
      alias: ['smemevideo', 'memevid'],
      category: 'sticker',
      description: 'Membuat sticker meme dari video',
      usage: '.smemevid <top>|<bottom>',
      example: '.smemevid WIDTH OR HEIGHT|WHY NOT BOTH?',
      isOwner: false,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 15,
      energi: 1,
      isEnabled: true
  }
  
  async function handler(m, { sock }) {
      const isVideo = m.isVideo || (m.quoted && m.quoted.isVideo) || (m.quoted && m.quoted.type === 'videoMessage')
      if (!isVideo) {
          return m.reply(`🎬 *ᴍᴇᴍᴇ ᴠɪᴅᴇᴏ*\n\n> Reply atau kirim video dengan caption\n\n\`Contoh: ${m.prefix}smemevid Top|Bottom\``)
      }
  
      const input = m.args.join(' ')
      if (!input || !input.includes('|')) {
          return m.reply(`🎬 *ᴍᴇᴍᴇ ᴠɪᴅᴇᴏ*\n\n> Format: top|bottom\n\n\`Contoh: ${m.prefix}smemevid WIDTH OR HEIGHT|WHY NOT BOTH?\``)
      }
  
      const [top, bottom] = input.split('|').map(s => s.trim().toUpperCase())
  
      m.react('🕕')
  
      try {
          let mediaBuffer
          if (m.quoted) {
              mediaBuffer = await m.quoted.download()
          } else if (m.download) {
              mediaBuffer = await m.download()
          }
  
          if (!mediaBuffer) {
              m.react('❌')
              return m.reply(`❌ *ɢᴀɢᴀʟ*\n\n> Gagal mengunduh video`)
          }
  
          const tempId = Date.now()
          const inputVideo = path.join(os.tmpdir(), `vid-${tempId}.mp4`)
          const outputVideo = path.join(os.tmpdir(), `vid-out-${tempId}.mp4`)
          const overlayImage = path.join(os.tmpdir(), `overlay-${tempId}.png`)
  
          fs.writeFileSync(inputVideo, mediaBuffer)
  
          const getMetadata = (file) => {
              return new Promise((resolve, reject) => {
                  ffmpeg.ffprobe(file, (err, metadata) => {
                      if (err) reject(err)
                      else resolve(metadata)
                  })
              })
          }
  
          const metadata = await getMetadata(inputVideo)
          const videoStream = metadata.streams.find(s => s.codec_type === 'video')
          if (!videoStream) throw new Error('Stream video tidak ditemukan')
  
          const size = 512
  
          const canvas = createCanvas(size, size)
          const ctx = canvas.getContext('2d')
  
          const drawMemeText = (ctx, text, x, y, width, isBottom) => {
              if (!text) return
  
              ctx.fillStyle = 'white'
              ctx.strokeStyle = 'black'
              ctx.textAlign = 'center'
              ctx.textBaseline = isBottom ? 'bottom' : 'top'
              ctx.lineJoin = 'round'
  
              let fontSize = Math.floor(width / 8)
              ctx.font = `bold ${fontSize}px Impact, Arial`
  
              while (ctx.measureText(text).width > width - 20) {
                  fontSize -= 2
                  ctx.font = `bold ${fontSize}px Impact, Arial`
                  if (fontSize < 10) break
              }
  
              ctx.lineWidth = Math.floor(fontSize / 6)
              ctx.strokeText(text, x, y)
              ctx.fillText(text, x, y)
          }
  
          drawMemeText(ctx, top, size / 2, 10, size, false)
          drawMemeText(ctx, bottom, size / 2, size - 10, size, true)
  
          const bufferImage = canvas.toBuffer('image/png')
          fs.writeFileSync(overlayImage, bufferImage)
  
          await new Promise((resolve, reject) => {
              ffmpeg(inputVideo)
                  .input(overlayImage)
                  .complexFilter([
                      `[0:v]crop='min(iw,ih)':'min(iw,ih)',scale=${size}:${size},fps=8[vid]`,
                      `[vid][1:v]overlay=0:0[out]`
                  ])
                  .outputOptions([
                      '-map [out]',
                      '-an',
                      '-c:v libx264',
                      '-preset fast',
                      '-crf 26',
                      '-t 4'
                  ])
                  .save(outputVideo)
                  .on('end', () => resolve())
                  .on('error', (err) => reject(err))
          })
  
          const stickerConfig = config.sticker || { packname: 'WhatsApp Bot', author: 'Bot' }
  
          await sock.sendVideoAsSticker(m.chat, outputVideo, m, {
              packname: stickerConfig.packname,
              author: stickerConfig.author
          })
  
          m.react('✅')
  
          try {
              fs.unlinkSync(inputVideo)
              fs.unlinkSync(outputVideo)
              fs.unlinkSync(overlayImage)
          } catch (e) { globalThis.__vanxoneCatch?.(e); }
  
      } catch (error) { globalThis.__vanxoneCatch?.(error);
          m.react('☢')
          m.reply(`❌ *ɢᴀɢᴀʟ*\n\n> Terjadi kesalahan saat memproses video`)
      }
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
