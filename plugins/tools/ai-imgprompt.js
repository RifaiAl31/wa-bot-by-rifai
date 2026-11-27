// ai/ai-imgprompt — satu file: metadata + kode fitur (gabungan dari engine2/plugins/ai/ai-imgprompt.js)
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "imgprompt"
  ],
  "category": "tools",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur imgprompt (dari Bot package)"
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/ai").split('\\').join('/')
module.exports = __vx.plugin("ai/ai-imgprompt", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/ai-imgprompt.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  // • Image to prompt 
  // • Type : Plugins ESM 
  
  // • Author : WhatsApp Bot
  const axios = __vxDef(require("axios"));
  const FormData = __vxDef(require("form-data"));
  const fs = __vxDef(require("fs"));
  
  let handler = async (m, { conn }) => {
    let q = m.quoted?.mimetype ? m.quoted : m
    if (!q.mimetype?.includes("image")) return conn.reply(m.chat, "🍭 Kirim atau reply gambar!", m)
  
    let img = await q.download?.()
    if (!img) return conn.reply(m.chat, "🍬 Gagal ambil gambar", m)
  
    try {
      const form = new FormData()
      form.append("file", img, "img.jpg")
  
      const res = await axios.post("https://be.neuralframes.com/clip_interrogate/", form, {
        headers: {
          ...form.getHeaders(),
          "Authorization": "Bearer uvcKfXuj6Ygncs6tiSJ6VXLxoapJdjQ3EEsSIt45Zm+vsl8qcLAAOrnnGWYBccx4sbEaQtCr416jxvc/zJNAlcDjLYjfHfHzPpfJ00l05h0oy7twPKzZrO4xSB+YGrmCyb/zOduHh1l9ogFPg/3aeSsz+wZYL9nlXfXdvCqDIP9bLcQMHiUKB0UCGuew2oRt",
          "User-Agent": "Mozilla/5.0 (Linux; Android 10)",
          "Referer": "https://www.neuralframes.com/tools/image-to-prompt"
        }
      })
  
      conn.reply(m.chat, res.data?.caption || res.data?.prompt || "🍬 Tidak ada prompt ditemukan", m)
    } catch (e) {
      conn.reply(m.chat, "❌ Yahh error: " + e.message, m)
    }
  }
  
  handler.help = ["imgprompt"]
  handler.tags = ["ai"]
  handler.command = /^imgprompt$/i
  handler.limit = true 
  handler.register = true 
  
  const __vxDefault = handler
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})
