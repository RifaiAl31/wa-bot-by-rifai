// ai/toai — satu file: metadata + kode fitur (gabungan dari engine2/plugins/ai/toai.js)
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "aisticker",
    "sai",
    "stickerai",
    "toai",
    "toaisticker"
  ],
  "category": "tools",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur toai (dari Bot package)"
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/ai").split('\\').join('/')
module.exports = __vx.plugin("ai/toai", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/toai.js'
  const __vxExports = {};
  let handler = async (m, { conn }) => {
    if (!m.quoted) return m.reply('Reply sticker biasa yang mau dijadiin AI sticker ')
  
    let q = m.quoted
    let mime = q.mimetype || q.msg?.mimetype || ''
  
    if (!/webp/i.test(mime)) {
      return m.reply('Reply sticker webp yaa')
    }
  
    try {
      await m.react?.('🕒')
  
      let buffer = await q.download()
      if (!buffer) throw new Error('Gagal download sticker')
  
      await conn.sendMessage(
        m.chat,
        {
          sticker: buffer,
          mimetype: 'image/webp',
          isAiSticker: true
        },
        { quoted: m }
      )
  
      await m.react?.('✅')
    } catch (e) {
      await m.react?.('❌')
      m.reply(`Gagal bikin AI sticker:\n${e.message}`)
    }
  }
  
  handler.help = ['toaisticker']
  handler.tags = ['sticker']
  handler.command = /^(toai(sticker)?|aisticker|stickerai|sai)$/i
  
  const __vxDefault = handler
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})
