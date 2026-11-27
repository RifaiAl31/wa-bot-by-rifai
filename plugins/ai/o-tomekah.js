// ai/tomekah — satu file: metadata + kode fitur (gabungan dari engine3/plugins/ai/tomekah.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "tomekah",
  "command": [
    "tomekah",
    "mekah",
    "mecca",
    "tomecca"
  ],
  "category": "ai",
  "desc": "Ubah background gambar ke Mekah",
  "usage": ".tomekah (reply gambar)",
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
module.exports = __vx.plugin("ai/tomekah", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/tomekah.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const axios = __vxDef(require("axios"));
  const { uploadImage } = require("../../lib/ext/src/lib/vanxone-uploader.js");
  const { f } = require("../../lib/ext/src/lib/vanxone-http.js");
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.js"));
  const pluginConfig = {
      name: 'tomekah',
      alias: ['mekah', 'mecca', 'tomecca'],
      category: 'ai',
      description: 'Ubah background gambar ke Mekah',
      usage: '.tomekah (reply gambar)',
      example: '.tomekah',
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
          return m.reply(`🕋 *ᴍᴇᴋᴀʜ sᴛʏʟᴇ*\n\n> Kirim/reply gambar\n\n\`${m.prefix}tomekah\``)
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
          
          const imageUrl = await uploadImage(buffer, 'image.jpg')
          
          const url = `https://api-faa.my.id/faa/tomekah?url=${encodeURIComponent(imageUrl)}`
          const res = await f(url, 'arrayBuffer')
          
          m.react('✅')
          
          await sock.sendMedia(m.chat, Buffer.from(res), null, m, {
              type: 'image',
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
