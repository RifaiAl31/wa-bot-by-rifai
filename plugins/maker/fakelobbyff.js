// maker/fakelobbyff — fitur tambahan (plugins.zip), disesuaikan untuk WhatsApp Bot
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "fakelobbyff"
  ],
  "category": "maker",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur fakelobbyff",
  "usage": ".fakelobbyff <nama>|<lobby>"
}
const __vdir = __dirname.split('\\').join('/')
module.exports = __vx.plugin("vxnew/maker/fakelobbyff", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + "/fakelobbyff.js"
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxImp = async (m) => { const r = require(m); return r && r.__esModule ? r : Object.assign({ default: r }, r) };
  const __vxExports = {};
  const fetch = __vxDef(require("../../lib/newlib/fetch.js"));
  
  let handler = async (m, { conn, text, usedPrefix, command }) => {
      if (!text) return m.reply(`teks belum diisi\ncontoh: ${usedPrefix}${command} nama | lobby`)
      
      m.reply('mohon tunggu sebentar, sedang diproses')
      try {
          await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });
          let [nama, lobby] = text.split('|').map(v => v.trim())
          if (!nama) return m.reply(`nama wajib diisi\ncontoh: ${usedPrefix}${command} nama | 5`)
  
          let url = `${global.web}/api/maker/fakelobbyff?apikey=${global.apikey?.vxapi}&nama=${encodeURIComponent(nama)}`
          if (lobby) url += `&lobby=${encodeURIComponent(lobby)}`
          
          let res = await fetch(url)
          if (!res.ok) throw new Error('API error')
          
          let buffer = await res.arrayBuffer()
          
          await conn.sendFile(m.chat, Buffer.from(buffer), 'result.jpg', `*VANXONE - MAKER*`, m)
          await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
      } catch (e) {
          await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
          m.reply('server sedang error, coba lagi nanti')
      }
  }
  handler.help = ['fakelobbyff <nama>|<lobby>']
  handler.tags = ['maker']
  handler.command = /^fakelobbyff$/i
  handler.limit = true;handler.limit = 1;
  
  const __vxDefault = handler

  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  for (const k of ['before', 'all']) { if (typeof __vxExports[k] === 'function' && typeof __vxDefault === 'function' && !__vxDefault[k]) __vxDefault[k] = __vxExports[k] }
  return __vxExports
})
