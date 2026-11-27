// ai/tochibi — satu file: metadata + kode fitur (gabungan dari engine3/plugins/ai/tochibi.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "tochibi",
  "command": [
    "tochibi",
    "chibi",
    "chibistyle"
  ],
  "category": "ai",
  "desc": "Ubah gambar ke style Chibi",
  "usage": ".tochibi (reply gambar)",
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
module.exports = __vx.plugin("ai/tochibi", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/tochibi.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const { uploadImage } = require("../../lib/ext/src/lib/vanxone-uploader.js");
  const { f } = require("../../lib/ext/src/lib/vanxone-http.js");
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.js"));
  const { live3d } = require("../../lib/ext/src/scraper/seaart.e3.js");
  const pluginConfig = {
      name: 'tochibi',
      alias: ['chibi', 'chibistyle'],
      category: 'ai',
      description: 'Ubah gambar ke style Chibi',
      usage: '.tochibi (reply gambar)',
      example: '.tochibi',
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
          return m.reply(`🎀 *ᴄʜɪʙɪ sᴛʏʟᴇ*\n\n> Kirim/reply gambar untuk diubah ke style Chibi\n\n\`${m.prefix}tochibi\``)
      }
      
      m.react('🕕')
  
      try {
          let buffer
          if (m.quoted && m.quoted.isMedia) {
              buffer = await m.quoted.download()
          } else if (m.isMedia) {
              buffer = await m.download()
          }
          
          if (!buffer) {
              m.react('❌')
              return m.reply(`❌ Gagal mendownload gambar`)
          }
  
          const PROMPT = `Transform into chibi style, big head and small body proportions, cute expression, big sparkling eyes, smooth shading, soft lighting, highly detailed, high quality`
          
          const result = await live3d(buffer, PROMPT)
          
          m.react('✅')
          
          await sock.sendMedia(m.chat, result.image, null, m, {
              type: 'image'
          })
          
      } catch (error) { globalThis.__vanxoneCatch?.(error);
          m.react('☢')
          m.reply(te(m.prefix, m.command, m.pushName))
      }
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
