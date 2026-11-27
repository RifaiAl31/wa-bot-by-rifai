// maker/igpost — fitur tambahan (plugins.zip), disesuaikan untuk WhatsApp Bot
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "igpost"
  ],
  "category": "maker",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur igpost",
  "usage": ".igpost"
}
const __vdir = __dirname.split('\\').join('/')
module.exports = __vx.plugin("vxnew/maker/igpost", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + "/igpost.js"
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxImp = async (m) => { const r = require(m); return r && r.__esModule ? r : Object.assign({ default: r }, r) };
  const __vxExports = {};
  const fetch = __vxDef(require("../../lib/newlib/fetch.js"));
  const uploadImage = __vxDef(require("../../lib/newlib/upload.js"));
  
  let handler = async (m, { conn, text, usedPrefix, command }) => {
      let q = m.quoted ? m.quoted : m
      let mime = (q.msg || q).mimetype || ''
      
      if (!mime) return m.reply(`balas gambar pake perintah *${usedPrefix}${command} username|like|comment|repost*`)
      if (!/image/.test(mime)) return m.reply(`Tipe media tidak didukung!`)
  
      m.reply('mohon tunggu sebentar, sedang diproses')
      try {
          await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });
          let media = await q.download()
          let mainPhoto = await uploadImage(media)
          let profilePhoto = ''
          try {
              let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
              let target = m.quoted ? m.quoted.sender : who
              let ppUrl = await conn.profilePictureUrl(target, 'image')
              let ppRes = await fetch(ppUrl)
              let ppBuffer = Buffer.from(await ppRes.arrayBuffer())
              profilePhoto = await uploadImage(ppBuffer)
          } catch {
              profilePhoto = 'https://raw.githubusercontent.com/Ditzzx-vibecoder/Assets/main/avatar_contact.png'
          }
          
          let [username, like, comment, repost] = text ? text.split('|') : []
          
          let url = new URL(`${global.web}/api/maker/igpost`)
          url.searchParams.append('apikey', global.apikey?.vxapi)
          url.searchParams.append('mainPhoto', mainPhoto)
          url.searchParams.append('profilePhoto', profilePhoto)
          if (username) url.searchParams.append('username', username)
          if (like) url.searchParams.append('like', like)
          if (comment) url.searchParams.append('comment', comment)
          if (repost) url.searchParams.append('repost', repost)
          
          let res = await fetch(url.toString())
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
  handler.help = ['igpost']
  handler.tags = ['maker']
  handler.command = /^igpost$/i
  handler.limit = true;handler.limit = 1;
  
  const __vxDefault = handler

  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  for (const k of ['before', 'all']) { if (typeof __vxExports[k] === 'function' && typeof __vxDefault === 'function' && !__vxDefault[k]) __vxDefault[k] = __vxExports[k] }
  return __vxExports
})
