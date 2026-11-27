// tools/tools-tomp3 — satu file: metadata + kode fitur (gabungan dari engine2/plugins/tools/tools-tomp3.js)
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "mp3"
  ],
  "category": "tools",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur mp3 (dari Bot package)"
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/tools").split('\\').join('/')
module.exports = __vx.plugin("tools/tools-tomp3", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/tools-tomp3.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const { spawn } = require("child_process");
  const fs = __vxDef(require("fs"));
  const path = __vxDef(require("path"));
  const { tmpdir } = require("os");
  
  const handler = async (m, { conn, usedPrefix, command }) => {
    const quoted = m.quoted ? m.quoted : m
    const mime = (quoted.msg || quoted).mimetype || ''
    const isMedia = /video|audio/.test(mime)
  
    if (!isMedia) {
      return m.reply(`Balas pesan video/audio dengan caption *${usedPrefix + command}*`)
    }
  
    m.reply("tunggu sebentar ")
  
    try {
      const inputPath = path.join(tmpdir(), `${Date.now()}_input`)
      const outputPath = path.join(tmpdir(), `${Date.now()}_output.mp3`)
  
      const buffer = await quoted.download()
      fs.writeFileSync(inputPath, buffer)
  
      await new Promise((resolve, reject) => {
        const ffmpeg = spawn('ffmpeg', ['-i', inputPath, '-vn', '-ab', '128k', '-ar', '44100', '-y', outputPath])
        ffmpeg.on('close', (code) => {
          if (code === 0) resolve()
          else reject(new Error(`ffmpeg gagal dengan kode ${code}`))
        })
      })
  
      await conn.sendMessage(m.chat, {
        audio: { url: outputPath },
        mimetype: 'audio/mpeg',
        ptt: false
      }, { quoted: m })
  
      fs.unlinkSync(inputPath)
      fs.unlinkSync(outputPath)
    } catch (err) {
      console.error(err)
      m.reply('Terjadi error saat mengonversi ke MP3.')
    }
  }
  
  handler.command = ['tomp3', 'mp3','toaudio']
  handler.tags = ['tools']
  handler.help = ["tomp3"]
  
  const __vxDefault = handler
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})
