// sticker/attp — satu file: metadata + kode fitur (gabungan dari engine3/plugins/sticker/attp.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "attp",
  "command": [
    "attp",
    "attp3",
    "attp2"
  ],
  "category": "sticker",
  "desc": "Membuat sticker animated text",
  "usage": ".attp <teks>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 10,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/sticker").split('\\').join('/')
module.exports = __vx.plugin("sticker/attp", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/attp.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const { addExifToWebp } = require("../../lib/ext/src/lib/vanxone-exif.js");
  const axios = __vxDef(require("axios"));
  const config = __vxDef(require("../../lib/ext/config.e3.js"));
  const { f } = require("../../lib/ext/src/lib/vanxone-http.js");
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.js"));
  const NEOXR_APIKEY = config.APIkey?.neoxr || ''
  const pluginConfig = {
      name: 'attp',
      alias: ['attp2', 'attp3'],
      category: 'sticker',
      description: 'Membuat sticker animated text',
      usage: '.attp <teks>',
      example: '.attp Hello World',
      isOwner: false,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 10,
      energi: 1,
      isEnabled: true
  }
  function getRandomColor() {
      const colors = ['FF5733', 'C70039', '900C3F', '581845', '2E86AB', 'A23B72', 'F18F01', 'C73E1D', '3A0CA3', '7209B7', '4361EE', '4CC9F0']
      return colors[Math.floor(Math.random() * colors.length)]
  }
  async function handler(m, { sock }) {
      let text = m.text?.trim()
      if (!text && m.quoted?.text) {
          text = m.quoted.text.trim()
      }
      if (!text) {
          return m.reply(
              `🎨 *ᴀɴɪᴍᴀᴛᴇᴅ ᴛᴇxᴛ sᴛɪᴄᴋᴇʀ*\n\n` +
              `> Masukkan teks untuk sticker\n\n` +
              `> Contoh: \`${m.prefix}attp Hello World\``
          )
      }
      if (text.length > 100) {
          return m.reply(`❌ Teks terlalu panjang! Maksimal 100 karakter.`)
      }
      m.react('🕕')
      try {
          const color = getRandomColor()
          const url = `https://api.neoxr.eu/api/attp3?text=${encodeURIComponent(text)}&color=${color}&apikey=${NEOXR_APIKEY}`
          const data = await f(url)
          if (!data?.status || !data?.data?.url) {
              throw new Error('API tidak mengembalikan data yang valid')
          }
          const stickerUrl = data.data.url
          const stickerRes = await f(stickerUrl, 'buffer')
          if (!stickerRes) throw new Error('Gagal mengunduh sticker dari server')
          let finalSticker = stickerRes
          try {
              finalSticker = await addExifToWebp(stickerRes, {
                  packname: config.sticker.packname,
                  author: config.sticker.author
              })
          } catch (e) { globalThis.__vanxoneCatch?.(e);
              console.log('Exif error:', e)
          }
          await sock.sendMessage(m.chat, { sticker: finalSticker }, { quoted: m })
          m.react('✅')
      } catch (err) { globalThis.__vanxoneCatch?.(err);
          m.react('☢')
          m.reply(te(m.prefix, m.command, m.pushName))
      }
  }
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
