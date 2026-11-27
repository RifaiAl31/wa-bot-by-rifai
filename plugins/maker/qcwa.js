// maker/qcwa — fitur tambahan (plugins.zip), disesuaikan untuk WhatsApp Bot
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "qcwa"
  ],
  "category": "maker",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur qcwa",
  "usage": ".qcwa"
}
const __vdir = __dirname.split('\\').join('/')
module.exports = __vx.plugin("vxnew/maker/qcwa", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + "/qcwa.js"
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxImp = async (m) => { const r = require(m); return r && r.__esModule ? r : Object.assign({ default: r }, r) };
  const __vxExports = {};
  const fetch = __vxDef(require("../../lib/newlib/fetch.js"));
  const uploadImage = __vxDef(require("../../lib/newlib/upload.js"));
  
  let handler = async (m, { conn, text, usedPrefix, command }) => {
      if (!text) return m.reply(`teksnya belum diisi\ncontoh: ${usedPrefix}${command} halo`)
      
      let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
      let pp
      try {
          let ppUrl = await conn.profilePictureUrl(who, 'image')
          let ppRes = await fetch(ppUrl)
          let ppBuffer = Buffer.from(await ppRes.arrayBuffer())
          pp = await uploadImage(ppBuffer)
      } catch {
          pp = 'https://raw.githubusercontent.com/Ditzzx-vibecoder/Assets/main/avatar_contact.png'
      }
      
      let name = await conn.getName(who)
      let phoneNum = '+' + who.split('@')[0].replace(/[^0-9]/g, '')
  
      m.reply('mohon tunggu sebentar, sedang diproses')
      try {
          let url = `${global.web}/api/maker/qcwa?apikey=${global.apikey?.vxapi}&text=${encodeURIComponent(text)}&username=${encodeURIComponent(name)}&pp=${encodeURIComponent(pp)}&phone=${encodeURIComponent(phoneNum)}`
          let res = await fetch(url)
          let buffer = await res.arrayBuffer()
          await conn.sendFile(m.chat, Buffer.from(buffer), 'qcwa.png', '*VANXONE - MAKER*', m)
      } catch (e) {
          m.reply('server sedang error, coba lagi nanti')
      }
  }
  handler.help = ['qcwa']
  handler.tags = ['maker']
  handler.command = /^qcwa$/i
  handler.limit = 1;
  
  const __vxDefault = handler

  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  for (const k of ['before', 'all']) { if (typeof __vxExports[k] === 'function' && typeof __vxDefault === 'function' && !__vxDefault[k]) __vxDefault[k] = __vxExports[k] }
  return __vxExports
})
