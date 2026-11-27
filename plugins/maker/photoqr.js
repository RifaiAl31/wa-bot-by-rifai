// maker/photoqr — fitur tambahan (plugins.zip), disesuaikan untuk WhatsApp Bot
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "photoqr"
  ],
  "category": "maker",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur photoqr",
  "usage": ".photoqr"
}
const __vdir = __dirname.split('\\').join('/')
module.exports = __vx.plugin("vxnew/maker/photoqr", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + "/photoqr.js"
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxImp = async (m) => { const r = require(m); return r && r.__esModule ? r : Object.assign({ default: r }, r) };
  const __vxExports = {};
  const fetch = __vxDef(require("../../lib/newlib/fetch.js"));
  const { uploadPomf } = require("../../lib/newlib/upload.js");
  
  let handler = async (m, { conn, text, usedPrefix, command }) => {
      let q = m.quoted ? m.quoted : m
      let mime = (q.msg || q).mimetype || ''
      
      if (!text) return m.reply(`teks belum diisi\ncontoh: ${usedPrefix}${command} teks qr|prompt`)
      
      if (!mime || !mime.startsWith('image/')) return m.reply(`gambar belum dikirim, reply/kirim gambar pake caption: ${usedPrefix}${command} teks qr|prompt`)
      
      m.reply('mohon tunggu sebentar, sedang diproses')
      try {
          await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });
          
          let [qr_text, prompt] = text.split('|')
          
          let media = await q.download()
          let link = await uploadPomf(media)
          
          let url = `${global.web}/api/maker/photoqr?apikey=${(global.apikey?.vxapi)}&qr_text=${encodeURIComponent(qr_text)}&image_url=${encodeURIComponent(link)}`
          if (prompt) {
              url += `&prompt=${encodeURIComponent(prompt)}`
          }
          
          let res = await fetch(url)
          if (!res.ok) {
              let json = await res.json().catch(() => ({}))
              throw new Error(json.error || 'Server error')
          }
          
          let buffer = await res.arrayBuffer()
          
          try {
              await conn.sendFile(m.chat, Buffer.from(buffer), 'result.png', `*VANXONE - MAKER*`, m)
              await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
          } catch (e) {
              await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
              m.reply('gagal mengirim atau memproses medianya')
          }
      } catch (e) {
          await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
          m.reply('server sedang error: ' + e.message)
      }
  }
  handler.help = ['photoqr']
  handler.tags = ['maker']
  handler.command = /^photoqr$/i
  handler.limit = true;handler.limit = 1;
  
  const __vxDefault = handler

  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  for (const k of ['before', 'all']) { if (typeof __vxExports[k] === 'function' && typeof __vxDefault === 'function' && !__vxDefault[k]) __vxDefault[k] = __vxExports[k] }
  return __vxExports
})
