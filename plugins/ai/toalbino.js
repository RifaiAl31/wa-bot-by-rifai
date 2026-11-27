// ai/toalbino — satu file: metadata + kode fitur (gabungan dari engine8/plugins/ai/toalbino.js)
const __vx = require("../../lib/adapter/e8.js")
const __meta = {
  "name": "toalbino",
  "command": [
    "toalbino",
    "albino",
    "albinostyle"
  ],
  "category": "ai",
  "desc": "Ubah gambar ke style Albino",
  "usage": ".toalbino (reply gambar)",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 30,
  "energi": 2,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/ai").split('\\').join('/')
module.exports = __vx.plugin("ai/toalbino", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/toalbino.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const { uploadImage } = require("../../lib/ext/src/lib/vanxone-uploader.e8.js");
  const { f } = require("../../lib/ext/src/lib/vanxone-http.e8.js");
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.e8.js"));
  
  const pluginConfig = {
      name: 'toalbino',
      alias: ['albino', 'albinostyle'],
      category: 'ai',
      description: 'Ubah gambar ke style Albino',
      usage: '.toalbino (reply gambar)',
      example: '.toalbino',
      isOwner: false,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 30,
      energi: 2,
      isEnabled: true
  }
  
  async function handler(m, { sock }) {
      const isImage = m.isImage || (m.quoted && m.quoted.type === 'imageMessage')
  
      if (!isImage) {
          return m.reply(`👻 *ᴀʟʙɪɴᴏ sᴛʏʟᴇ*\n\n> Kirim/reply gambar untuk diubah ke style Albino\n\n\`${m.prefix}toalbino\``)
      }
  
      m.react('🕕')
  
      try {
          let buffer
          if (m.quoted && m.quoted.isMedia) {
              buffer = await m.quoted.download()
          } else if (m.isMedia) {
              buffer = await m.download()
          }
  
          if (!buffer || buffer.length === 0) {
              m.react('❌')
              return m.reply(`❌ Gagal mendownload gambar`)
          }
  
          const imageUrl = await uploadImage(buffer, 'image.jpg')
          if (!imageUrl) {
              m.react('❌')
              return m.reply(`❌ Gagal upload gambar ke server`)
          }
  
          const stylePrompt = 'Transform the person in this photo to have albinism: ' +
              'change the hair color to pure white or very pale platinum white, ' +
              'change the skin tone to very pale, light, and fair with minimal pigmentation, ' +
              'change the eye color to light pale blue, pink, or very light grey, ' +
              'keep the same person, same face structure, same identity, same pose, same outfit, and same background, ' +
              'photorealistic, high detail, natural lighting'
  
          const apiUrl = `https://api.lexcode.biz.id/api/ai/nano-banana?url=${encodeURIComponent(imageUrl)}&prompt=${encodeURIComponent(stylePrompt)}`
  
          let json = await f(apiUrl, 'json')
          if (!json) {
              json = await f(apiUrl, 'json') 
          }
  
          if (!json || !json.success || !json.result || !json.result.image) {
              m.react('❌')
              return m.reply(`❌ Gagal memproses gambar. API sedang gangguan atau menolak request.`)
          }
  
          const resultImageUrl = json.result.image
  
          let imgBuffer = await f(resultImageUrl, 'arrayBuffer')
          if (!imgBuffer) {
              imgBuffer = await f(resultImageUrl, 'arrayBuffer') 
          }
  
          if (!imgBuffer || imgBuffer.byteLength < 1000) {
              m.react('❌')
              return m.reply(`❌ Gagal mengunduh hasil gambar dari server`)
          }
  
          m.react('✅')
  
          await sock.sendMedia(m.chat, Buffer.from(imgBuffer), null, m, {
              type: 'image',
          })
  
      } catch (error) {
          console.log('[toalbino error]', error)
          m.react('☢')
          m.reply(te(m.prefix, m.command, m.pushName))
      }
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
