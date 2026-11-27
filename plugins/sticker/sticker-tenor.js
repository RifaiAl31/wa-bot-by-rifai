// sticker/sticker-tenor — satu file: metadata + kode fitur (gabungan dari engine2/plugins/sticker/sticker-tenor.js)
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "tenor"
  ],
  "category": "sticker",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur tenor (dari Bot package)"
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/sticker").split('\\').join('/')
module.exports = __vx.plugin("sticker/sticker-tenor", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/sticker-tenor.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const axios = __vxDef(require("axios"));
  const { sticker } = require("../../lib/ext/lib/sticker.js");
  const { StickerTypes } = require("wa-sticker-formatter");
  
  let handler = async (m, { conn, text, usedPrefix, command }) => {
    await m.react('✨')
  
    if (!text) {
      return conn.reply(
        m.chat,
        `*Example :* ${usedPrefix + command} Ryo Yamada`,
        m
      )
    }
  
    try {
      const { data } = await axios.get(
        `${global.APIs.faa}/faa/stickerly?q=${encodeURIComponent(text)}`
      )
  
      const results = data?.results?.slice(0, 5)
      if (!results?.length) return
  
      for (const i of results) {
        try {
          let img = await axios.get(i.url, { responseType: 'arraybuffer' })
          let buffer = Buffer.from(img.data)
  
          const stiker = await sticker(
            buffer,
            false,
            i.title || 'WhatsApp Bot',
            i.creator || 'WhatsApp Bot',
            { type: StickerTypes.FULL, animated: true }
          )
  
          if (stiker) {
            await conn.sendFile(m.chat, stiker, 'sticker.webp', '', m, { asSticker: true })
          }
        } catch {}
      }
    } catch {}
  }
  
  handler.help = ['tenor']
  handler.tags = ['sticker']
  handler.command = /^tenor$/i
  handler.limit = true
  
  const __vxDefault = handler
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})
