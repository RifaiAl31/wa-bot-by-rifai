// maker/beautifulmeme — fitur tambahan (plugins.zip), disesuaikan untuk WhatsApp Bot
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "beautifulmeme"
  ],
  "category": "maker",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur beautifulmeme",
  "usage": ".beautifulmeme"
}
const __vdir = __dirname.split('\\').join('/')
module.exports = __vx.plugin("vxnew/maker/beautifulmeme", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + "/beautifulmeme.js"
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxImp = async (m) => { const r = require(m); return r && r.__esModule ? r : Object.assign({ default: r }, r) };
  const __vxExports = {};
  const fetch = __vxDef(require("../../lib/newlib/fetch.js"));
  
  let handler = async (m, { conn, text, usedPrefix, command }) => {
      let [image1, image2] = text.split('|')
      
      if (!image1 || !image2) {
          return m.reply(`Format salah!\nContoh penggunaan:\n${usedPrefix}${command} link_gambar1|link_gambar2`)
      }
      
      if (!image1.startsWith('http') || !image2.startsWith('http')) {
          return m.reply('Kedua parameter harus berupa link (URL) gambar yang valid (dimulai dengan http/https)!')
      }
      
      m.reply('mohon tunggu sebentar, sedang diproses')
      try {
          await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });
          let url = `${global.web}/api/maker/beautifulmeme?apikey=${global.apikey?.vxapi}&image1=${encodeURIComponent(image1.trim())}&image2=${encodeURIComponent(image2.trim())}`
          
          let res = await fetch(url)
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
          m.reply('server sedang error, coba lagi nanti')
      }
  }
  handler.help = ['beautifulmeme']
  handler.tags = ['maker']
  handler.command = /^beautifulmeme$/i
  handler.limit = true;handler.limit = 1;
  
  const __vxDefault = handler

  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  for (const k of ['before', 'all']) { if (typeof __vxExports[k] === 'function' && typeof __vxDefault === 'function' && !__vxDefault[k]) __vxDefault[k] = __vxExports[k] }
  return __vxExports
})
