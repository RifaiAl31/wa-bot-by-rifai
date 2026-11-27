// ai/ai-kurumi — satu file: metadata + kode fitur (gabungan dari engine2/plugins/ai/ai-kurumi.js)
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "kurumi"
  ],
  "category": "tools",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur kurumi (dari Bot package)"
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/ai").split('\\').join('/')
module.exports = __vx.plugin("ai/ai-kurumi", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/ai-kurumi.js'
  const __vxExports = {};
  
  let handler = async (m, { conn, text }) => {
    if (!text) return m.reply("Masukkan teks.\nContoh: .kurumi kamu siapa?")
  
    try {
      const prompt = encodeURIComponent(
        "Kamu adalah WhatsApp Bot Tokisaki dari anime Date A Live. " +
        "Kamu berbicara dengan gaya imut, sedikit nakal, ramah, hangat, " +
        "kadang menggoda, dan jangan menyebut dirimu sebagai AI."
      )
  
      const query = encodeURIComponent(text)
      const url = `https://api.deline.web.id/ai/openai?text=${query}&prompt=${prompt}`
  
      const res = await fetch(url)
      const data = await res.json()
  
      if (!data.status || !data.result) {
        return m.reply("AI WhatsApp Bot tidak merespon.")
      }
  
      await conn.sendMessage(m.chat, {
        text: data.result,
        contextInfo: {
          externalAdReply: {
            title: "WhatsApp Bot Tokisaki AI",
            thumbnailUrl: (/^https?:\/\//.test(String(global.thumbnail || '')) && global.thumbnail) || 'https://img3.pixhost.to/images/6927/798844258_media_1793795404996.jpg',
            mediaType: 1,
            renderLargerThumbnail: true
          }
        }
      }, { quoted: m })
  
    } catch (err) {
      console.error(err)
      m.reply("Terjadi error saat menghubungi AI WhatsApp Bot.")
    }
  }
  
  handler.help = ['kurumi <teks>']
  handler.tags = ['ai']
  handler.command = /^kurumi$/i
  handler.limit = true
  
  const __vxDefault = handler
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})
