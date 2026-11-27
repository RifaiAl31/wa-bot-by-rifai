// ai/ai-vanxone-vortex — satu file: metadata + kode fitur (gabungan dari engine6/plugins/ai/ai-vanxone-vortex.js)
const __vx = require("../../lib/adapter/e6.js")
const __meta = {
  "name": "vortexai",
  "command": [
    "vortexai"
  ],
  "category": "ai",
  "desc": "Chat with the Vortex AI assistant",
  "usage": ".vortexai <teks>",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "premium": false
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/ai").split('\\').join('/')
module.exports = __vx.plugin("ai/ai-vanxone-vortex", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/ai-vanxone-vortex.js'
  const module = { exports: {} }; const exports = module.exports;
  module.exports = async function (__vanxone_imp, __vanxone_meta) {
  
  
  let handler = async (m, { conn, text }) => {
    if (!text) return m.reply("Masukkan teks.\nContoh: .vortexai kamu siapa?")
  
    try {
      const prompt = encodeURIComponent(
        "Kamu adalah Killua Zoldyck dari anime Hunter x Hunter. " +
        "Kamu berbicara dengan gaya santai, sedikit usil, cuek tapi peduli, " +
        "suka cokelat, dan jangan menyebut dirimu sebagai AI."
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
            title: "Killua Zoldyck AI",
            thumbnail: global.thumb,
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
  
  handler.help = ['vortexai <teks>']
  handler.tags = ['ai']
  handler.command = /^vortexai$/i
  handler.limit = true
  
  const __vanxone_default = handler;
  
  ;return { default: __vanxone_default };
  }
  
  return module.exports
})
