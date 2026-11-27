// maker/iqcdark — fitur tambahan (plugins.zip), disesuaikan untuk WhatsApp Bot
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "iqcdark"
  ],
  "category": "maker",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur iqcdark",
  "usage": ".iqcdark"
}
const __vdir = __dirname.split('\\').join('/')
module.exports = __vx.plugin("vxnew/maker/iqcdark", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + "/iqcdark.js"
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxImp = async (m) => { const r = require(m); return r && r.__esModule ? r : Object.assign({ default: r }, r) };
  const __vxExports = {};
  const fetch = __vxDef(require("../../lib/newlib/fetch.js"));
  const uploadImage = __vxDef(require("../../lib/newlib/upload.js"));
  
  
  let handler = async (m, { conn, text, usedPrefix, command }) => {
      let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
      let target = m.quoted ? m.quoted.sender : who
      let q = m.quoted ? m.quoted : m
      let mime = (q.msg || q).mimetype || ''
  
      let txt = text || (m.quoted && m.quoted.text ? m.quoted.text : '')
      if (!txt && !/image/.test(mime)) return m.reply(`teks belum diisi\ncontoh: ${usedPrefix}${command} query`)
  
      m.reply('mohon tunggu sebentar, sedang diproses')
      try {
          await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });
          
          let imgUrl
          if (/image/.test(mime)) {
              let media = await q.download()
              imgUrl = await uploadImage(media)
          } else {
              try {
                  let ppUrl = await conn.profilePictureUrl(target, 'image')
                  let ppRes = await fetch(ppUrl)
                  let ppBuffer = Buffer.from(await ppRes.arrayBuffer())
                  imgUrl = await uploadImage(ppBuffer)
              } catch {
                  imgUrl = 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg'
              }
          }
          
          const timeNow = new Intl.DateTimeFormat("id-ID", { timeZone: "Asia/Jakarta", hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date()).replace(":", ".");
  
          let url = `${global.web}/api/maker/iqcdark?apikey=${global.apikey?.vxapi}&txt=${encodeURIComponent(txt)}&imgUrl=${encodeURIComponent(imgUrl)}&timeStr=${encodeURIComponent(timeNow)}`
          
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
  handler.help = ['iqcdark']
  handler.tags = ['maker']
  handler.command = /^iqcdark$/i
  handler.limit = true;handler.limit = 1;
  
  const __vxDefault = handler

  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  for (const k of ['before', 'all']) { if (typeof __vxExports[k] === 'function' && typeof __vxDefault === 'function' && !__vxDefault[k]) __vxDefault[k] = __vxExports[k] }
  return __vxExports
})
