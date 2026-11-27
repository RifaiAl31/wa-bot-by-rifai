// maker/fakeigprofile — fitur tambahan (plugins.zip), disesuaikan untuk WhatsApp Bot
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "fakeigprofile"
  ],
  "category": "maker",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur fakeigprofile",
  "usage": ".fakeigprofile"
}
const __vdir = __dirname.split('\\').join('/')
module.exports = __vx.plugin("vxnew/maker/fakeigprofile", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + "/fakeigprofile.js"
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxImp = async (m) => { const r = require(m); return r && r.__esModule ? r : Object.assign({ default: r }, r) };
  const __vxExports = {};
  const fetch = __vxDef(require("../../lib/newlib/fetch.js"));
  const uploadImage = __vxDef(require("../../lib/newlib/upload.js"));
  
  let handler = async (m, { conn, text, usedPrefix, command }) => {
      if (!text) return m.reply(`teks belum diisi\ncontoh: ${usedPrefix}${command} username|bio|pengikut|mengikuti|postingan`)
      let [username, bio, pengikut, mengikuti, postingan] = text.split('|')
      if (!username || !bio || !pengikut || !mengikuti || !postingan) return m.reply(`Format salah!\nContoh: ${usedPrefix}${command} username|bio|pengikut|mengikuti|postingan`)
      
      let q = m.quoted ? m.quoted : m
      let mime = (q.msg || q).mimetype || ''
      let pp = ''
  
      if (/image/.test(mime)) {
          let media = await q.download()
          pp = await uploadImage(media)
      } else {
          try {
              let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
              let target = m.quoted ? m.quoted.sender : who
              let ppUrl = await conn.profilePictureUrl(target, 'image')
              let ppRes = await fetch(ppUrl)
              let ppBuffer = Buffer.from(await ppRes.arrayBuffer())
              pp = await uploadImage(ppBuffer)
          } catch {
              pp = 'https://raw.githubusercontent.com/Ditzzx-vibecoder/Assets/main/avatar_contact.png'
          }
      }
      
      m.reply('mohon tunggu sebentar, sedang diproses')
      try {
          await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });
          
          let url = new URL(`${global.web}/api/maker/fakeigprofile`)
          url.searchParams.append('apikey', global.apikey?.vxapi)
          url.searchParams.append('pp', pp)
          url.searchParams.append('username', username)
          url.searchParams.append('bio', bio)
          url.searchParams.append('pengikut', pengikut)
          url.searchParams.append('mengikuti', mengikuti)
          url.searchParams.append('postingan', postingan)
          
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
  handler.help = ['fakeigprofile']
  handler.tags = ['maker']
  handler.command = /^fakeigprofile$/i
  handler.limit = true;handler.limit = 1;
  
  const __vxDefault = handler

  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  for (const k of ['before', 'all']) { if (typeof __vxExports[k] === 'function' && typeof __vxDefault === 'function' && !__vxDefault[k]) __vxDefault[k] = __vxExports[k] }
  return __vxExports
})
