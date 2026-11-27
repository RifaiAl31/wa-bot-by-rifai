// maker/systeminfo — fitur tambahan (plugins.zip), disesuaikan untuk WhatsApp Bot
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "systeminfo"
  ],
  "category": "maker",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur systeminfo",
  "usage": ".systeminfo"
}
const __vdir = __dirname.split('\\').join('/')
module.exports = __vx.plugin("vxnew/maker/systeminfo", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + "/systeminfo.js"
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxImp = async (m) => { const r = require(m); return r && r.__esModule ? r : Object.assign({ default: r }, r) };
  const __vxExports = {};
  const fetch = __vxDef(require("../../lib/newlib/fetch.js"));
  
  let handler = async (m, { conn, text, usedPrefix, command }) => {
      if (!text) return m.reply(`teks belum diisi\ncontoh: ${usedPrefix}${command} query`)
      
      m.reply('mohon tunggu sebentar, sedang diproses')
      try {
          await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });
          let url = `${global.web}/api/maker/systeminfo?apikey=${(global.apikey?.vxapi)}&q=${encodeURIComponent(text)}`
          
          let res = await fetch(url)
          let buffer = await res.arrayBuffer()
          
          try {
              await conn.sendFile(m.chat, Buffer.from(buffer), 'result', `*VANXONE - MAKER*`, m)
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
  handler.help = ['systeminfo']
  handler.tags = ['maker']
  handler.command = /^systeminfo$/i
  handler.limit = true;handler.limit = 1;
  
  const __vxDefault = handler

  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  for (const k of ['before', 'all']) { if (typeof __vxExports[k] === 'function' && typeof __vxDefault === 'function' && !__vxDefault[k]) __vxDefault[k] = __vxExports[k] }
  return __vxExports
})
