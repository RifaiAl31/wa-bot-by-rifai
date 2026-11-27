// owner/uppreset — satu file: metadata + kode fitur (gabungan dari engine7/plugins/owner/uppreset.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "uppreset",
  "command": [
    "uppreset",
    "uploadpreset",
    "sendpreset"
  ],
  "category": "owner",
  "desc": "Upload preset ke channel",
  "usage": ".uppreset link5mb | linkxml | caption",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/owner").split('\\').join('/')
module.exports = __vx.plugin("owner/uppreset", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/uppreset.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const config = __vxDef(require("../../lib/ext/config.e7.js"));
  
  const CHANNEL_ID = config.saluran?.id
  
  const pluginConfig = {
  name: "uppreset",
  alias: ["uploadpreset","sendpreset"],
  category: "owner",
  description: "Upload preset ke channel",
  usage: ".uppreset link5mb | linkxml | caption",
  example: ".uppreset https://5mb.link | https://xml.link | preset jj anime",
  isOwner: true,
  cooldown: 5,
  isEnabled: true
  }
  
  async function handler(m,{ sock }){
  
  if(!m.text) return
  
  const text = m.text.split("|").map(v => v.trim())
  
  const link5mb = text[0]
  const linkxml = text[1]
  const captionUser = text[2] || "Preset baru"
  
  if(!link5mb || !linkxml){
  return m.reply(
  `╭━━〔 *❤️ WhatsApp Bot PRESET UPLOADER* 〕━━⬣
  ┃
  ┃ *Format :*
  ┃
  ┃ .uppreset link5mb | xml | caption
  ┃
  ┃ *Contoh :*
  ┃ .uppreset https://5mb.link | https://xml.link | preset jj anime
  ┃
  ╰━━━━━━━━━━━━━━━━⬣`
  )
  }
  
  m.react("⏳")
  
  try{
  
  const time = new Date().toLocaleTimeString()
  
  const caption =
  `╭━━〔 *❤️ WhatsApp Bot PRESET STORE* 〕━━⬣
  ┃
  ┃ ✨ *${captionUser}*
  ┃
  ┃ 📦 *Link 5MB*
  ┃ ${link5mb}
  ┃
  ┃ 📂 *Link XML*
  ┃ ${linkxml}
  ┃
  ┃ 👑 *Uploader*
  ┃ ${m.pushName}
  ┃
  ┃ ⏰ *Waktu*
  ┃ ${time}
  ┃
  ┃ 💌 *Ara Ara Darling~*
  ┃ *Preset baru sudah rilis ❤️*
  ┃
  ╰━━━━━━━━━━━━━━━━⬣`
  
  await sock.sendMessage(
  CHANNEL_ID,
  { text: caption }
  )
  
  m.react("✅")
  
  return m.reply(
  `╭━━〔 *❤️ WhatsApp Bot SYSTEM* 〕━━⬣
  ┃
  ┃ ✅ *Preset berhasil dikirim*
  ┃
  ┃ 📡 *Sudah masuk ke channel*
  ┃
  ┃ 👑 *Uploader*
  ┃ ${m.pushName}
  ┃
  ╰━━━━━━━━━━━━━━━━⬣`
  )
  
  }catch(e){
  
  console.log(e)
  
  m.react("❌")
  
  return m.reply(
  `╭━━〔 *❌ ERROR SYSTEM* 〕━━⬣
  ┃
  ┃ ${e.message}
  ┃
  ╰━━━━━━━━━━━━━━━━⬣`
  )
  
  }
  
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
