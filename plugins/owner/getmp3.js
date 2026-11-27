// owner/getmp3 — satu file: metadata + kode fitur (gabungan dari engine7/plugins/owner/getmp3.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "getmp3",
  "command": [
    "getmp3",
    "getaudio",
    "ambilmp3",
    "ambilaudio"
  ],
  "category": "owner",
  "desc": "Ambil file MP3/Audio dari folder assets/audio",
  "usage": ".getmp3 <nama_file.mp3>",
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
module.exports = __vx.plugin("owner/getmp3", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/getmp3.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const fs = __vxDef(require("fs"));
  const path = __vxDef(require("path"));
  const config = __vxDef(require("../../lib/ext/config.e7.js"));
  const pluginConfig = {
      name: 'getmp3',
      alias: ['getaudio', 'ambilmp3', 'ambilaudio'],
      category: 'owner',
      description: 'Ambil file MP3/Audio dari folder assets/audio',
      usage: '.getmp3 <nama_file.mp3>',
      example: '.getmp3 WhatsApp Bot.mp3',
      isOwner: true,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 3,
      energi: 0,
      isEnabled: true
  }
  
  async function handler(m, { sock }) {
      const args = m.args || []
      const fileName = args[0]?.trim()
      
      if (!fileName) {
          return m.reply(
              `💕 *ɢᴇᴛ ᴍᴘ3* 💕\n\n` +
              `╭━━━━━━━━━━━━━━━━━━━━━⬣\n` +
              `┃ ✦ *Cara Pakai*\n` +
              `┃\n` +
              `┃   ${m.prefix}getmp3 <nama_file.mp3>\n` +
              `┃\n` +
              `┃ ✦ *Contoh*\n` +
              `┃\n` +
              `┃   ${m.prefix}getmp3 WhatsApp Bot.mp3\n` +
              `┃\n` +
              `┃ ✦ *Lihat daftar file*\n` +
              `┃   ${m.prefix}listmp3\n` +
              `╰━━━━━━━━━━━━━━━━━━━━━⬣\n\n` +
              `💗 *WhatsApp Bot:* Mau ambil audio apa darling~?`
          )
      }
      
      m.react('💕')
      
      try {
          const audioPath = path.join(process.cwd(), 'assets', 'audio', fileName)
          
          if (!fs.existsSync(audioPath)) {
              m.react('💔')
              return m.reply(
                  `💔 *ᴇʀʀᴏʀ*\n\n` +
                  `> File *${fileName}* tidak ditemukan di folder assets/audio darling~\n\n` +
                  `> Ketik *${m.prefix}listmp3* untuk lihat daftar file yang tersedia 🥺`
              )
          }
          
          const audioBuffer = fs.readFileSync(audioPath)
          const fileSizeMB = (audioBuffer.length / (1024 * 1024)).toFixed(2)
          
          await sock.sendMessage(m.chat, {
              audio: audioBuffer,
              mimetype: 'audio/mpeg',
              ptt: false,
              fileName: fileName
          }, { quoted: m })
          
          m.react('✅')
          
          await m.reply(
              `💕 *ɢᴇᴛ ᴍᴘ3* 💕\n\n` +
              `╭━━━━━━━━━━━━━━━━━━━━━⬣\n` +
              `┃ ✅ *ʙᴇʀʜᴀꜱɪʟ*\n` +
              `┃\n` +
              `┃ 🎵 *ɴᴀᴍᴇ*: ${fileName}\n` +
              `┃ 📦 *ᴜᴋᴜʀᴀɴ*: ${fileSizeMB} MB\n` +
              `┃\n` +
              `┃ 💗 *WhatsApp Bot:* Ini dia audio nya darling~ 🎶\n` +
              `╰━━━━━━━━━━━━━━━━━━━━━⬣`
          )
          
      } catch (err) {
          console.error('[GetMP3] Error:', err)
          m.react('💔')
          return m.reply(
              `💔 *ᴇʀʀᴏʀ*\n\n` +
              `> ${err.message}\n\n` +
              `> Coba lagi ya darling~ 🥺`
          )
      }
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
