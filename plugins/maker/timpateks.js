// maker/timpateks — fitur tambahan (plugins.zip), disesuaikan untuk WhatsApp Bot
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "timpateks"
  ],
  "category": "maker",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur timpateks",
  "usage": ".timpateks"
}
const __vdir = __dirname.split('\\').join('/')
module.exports = __vx.plugin("vxnew/maker/timpateks", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + "/timpateks.js"
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxImp = async (m) => { const r = require(m); return r && r.__esModule ? r : Object.assign({ default: r }, r) };
  const __vxExports = {};
  const fetch = __vxDef(require("../../lib/newlib/fetch.js"));
  
  let handler = async (m, { conn, text, usedPrefix, command }) => {
      if (!text) return m.reply(`teks belum diisi\ncontoh: ${usedPrefix}${command} Rin|Katanya...`)
      if (!text.includes('|')) return m.reply(`format salah, gunakan pemisah |\ncontoh: ${usedPrefix}${command} Rin|Katanya...`)
      
      m.reply('mohon tunggu sebentar, sedang diproses')
      try {
          await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });
          let url = `${global.web}/api/maker/timpateks?apikey=${(global.apikey?.vxapi)}&text=${encodeURIComponent(text)}`
          
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
  handler.help = ['timpateks']
  handler.tags = ['maker']
  handler.command = /^timpateks$/i
  handler.limit = true;handler.limit = 1;
  
  const __vxDefault = handler

  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  for (const k of ['before', 'all']) { if (typeof __vxExports[k] === 'function' && typeof __vxDefault === 'function' && !__vxDefault[k]) __vxDefault[k] = __vxExports[k] }
  return __vxExports
})
