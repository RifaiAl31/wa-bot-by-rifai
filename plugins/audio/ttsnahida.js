// tts/ttsnahida — satu file: metadata + kode fitur (gabungan dari engine7/plugins/tts/ttsnahida.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "ttsnahida",
  "command": [
    "ttsnahida",
    "nahidatts"
  ],
  "category": "audio",
  "desc": "Text to Speech dengan suara Nahida",
  "usage": ".ttsnahida <text>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 15,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/tts").split('\\').join('/')
module.exports = __vx.plugin("tts/ttsnahida", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/ttsnahida.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const axios = __vxDef(require("axios"));
  const { spawn } = require("child_process");
  const fs = __vxDef(require("fs"));
  const path = __vxDef(require("path"));
  const pluginConfig = {
      name: 'ttsnahida',
      alias: ['nahidatts'],
      category: 'tts',
      description: 'Text to Speech dengan suara Nahida',
      usage: '.ttsnahida <text>',
      example: '.ttsnahida Halo traveler!',
      isOwner: false,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 15,
      energi: 1,
      isEnabled: true
  }
  
  async function convertToOpus(inputPath, outputPath) {
      return new Promise((resolve, reject) => {
          const ffmpeg = spawn('ffmpeg', [
              '-i', inputPath,
              '-c:a', 'libopus',
              '-b:a', '64k',
              '-vbr', 'on',
              '-compression_level', '10',
              '-y',
              outputPath
          ])
          ffmpeg.on('close', (code) => code === 0 ? resolve(true) : reject(new Error(`FFmpeg error`)))
          ffmpeg.on('error', reject)
      })
  }
  
  async function handler(m, { sock }) {
      const text = m.text?.trim()
      
      if (!text) {
          return m.reply(`🎤 *ɴᴀʜɪᴅᴀ ᴛᴛs*\n\n> Gunakan: \`${m.prefix}ttsnahida <text>\``)
      }
      
      m.react('🌿')
      
      try {
          const res = await axios.get(`https://api.emiliabot.my.id/tools/text-to-speech?text=${encodeURIComponent(text)}`, { timeout: 60000 })
          
          const voice = res.data?.result?.find(v => v.nahida && !v.error)
          if (!voice) {
              m.react('❌')
              return m.reply(`❌ Nahida voice error. Coba \`${m.prefix}ttsgoku\` atau \`${m.prefix}ttsnami\``)
          }
          
          const tempDir = path.join(process.cwd(), 'temp')
          if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true })
          
          const wavPath = path.join(tempDir, `tts_${Date.now()}.wav`)
          const opusPath = path.join(tempDir, `tts_${Date.now()}.ogg`)
          
          const audioRes = await axios.get(voice.nahida, { responseType: 'arraybuffer' })
          fs.writeFileSync(wavPath, Buffer.from(audioRes.data))
          await convertToOpus(wavPath, opusPath)
          
          await sock.sendMessage(m.chat, {
              audio: fs.readFileSync(opusPath),
              mimetype: 'audio/ogg; codecs=opus',
              ptt: true,
              contextInfo: {
                  isForwarded: true,
                  forwardingScore: 999,
                  externalAdReply: {
                      title: '🌿 Nahida TTS',
                      body: text.substring(0, 50),
                      thumbnailUrl: 'https://i.ibb.co/5xK7QnW/tts.png',
                      mediaType: 2
                  }
              }
          }, { quoted: m })
          
          fs.unlinkSync(wavPath)
          fs.unlinkSync(opusPath)
          m.react('✅')
          
      } catch (err) {
          m.react('❌')
          m.reply(`❌ *ᴇʀʀᴏʀ*\n\n> ${err.message}`)
      }
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
