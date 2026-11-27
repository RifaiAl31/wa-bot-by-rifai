// tools/kirimpesangc — satu file: metadata + kode fitur (gabungan dari engine7/plugins/tools/kirimpesangc.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "kirimpesangc",
  "command": [
    "kirimpesangc",
    "sendgc",
    "pesangc"
  ],
  "category": "tools",
  "desc": "Kirim pesan ke group tertentu",
  "usage": ".kirimpesangc pesan",
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
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/tools").split('\\').join('/')
module.exports = __vx.plugin("tools/kirimpesangc", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/kirimpesangc.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const FEATURE_CREDIT = "Fitur by: Owner Bot";
  
  
  const config = __vxDef(require("../../lib/ext/config.e7.js"));
  const pluginConfig = {
  name: "kirimpesangc",
  alias: ["sendgc","pesangc"],
  category: "tools",
  description: "Kirim pesan ke group tertentu",
  usage: ".kirimpesangc pesan",
  example: ".kirimpesangc ingat masa sewa kalian tinggal dikit",
  isOwner: true,
  cooldown: 5,
  energi: 0,
  isEnabled: true
  }
  
  const pendingMessage = new Map()
  
  async function handler(m,{ sock }){
  
  const args = m.args || []
  const text = args.join(" ")
  
  if (args[0] === "--send" && args[1]) {
  
  const groupId = args[1]
  const message = pendingMessage.get(m.sender)
  
  if (!message) {
  return m.reply("⚠️ Tidak ada pesan pending.")
  }
  
  try{
  
  let meta = await sock.groupMetadata(groupId)
  let groupName = meta.subject
  
  const sendText = `
  ${message}
  
  > Pesan dari : Owner bot
  `
  
  await sock.sendMessage(groupId,{ text: sendText })
  
  await m.reply(`
  ╭━━━〔 💗 *PESAN TERKIRIM* 💗 〕━━━⬣
  ┃
  ┃ 🏠 Group :
  ┃ *${groupName}*
  ┃
  ┃ 📡 Status :
  ┃ *Berhasil terkirim*
  ┃
  ╰━━━━━━━━━━━━━━━━━━⬣
  `)
  
  pendingMessage.delete(m.sender)
  
  }catch(e){
  
  await m.reply(`
  ╭━━━〔 ⚠️ *GAGAL MENGIRIM* ⚠️ 〕━━━⬣
  ┃
  ┃ Alasan :
  ┃ ${e.message}
  ┃
  ╰━━━━━━━━━━━━━━━━━━⬣
  `)
  
  }
  
  return
  }
  
  if (!text) {
  return m.reply(`
  ╭━━━〔 💗 *WhatsApp Bot SEND GC* 💗 〕━━━⬣
  ┃
  ┃ Hai Owner 😋
  ┃
  ┃ Masukkan pesan yang
  ┃ ingin dikirim ke group
  ┃
  ┃ Contoh:
  ┃
  ┃ .kirimpesangc
  ┃ ingat masa sewa kalian tinggal dikit
  ┃
  ╰━━━━━━━━━━━━━━━━━━⬣
  `)
  }
  
  pendingMessage.set(m.sender,text)
  
  try{
  
  const groups = await sock.groupFetchAllParticipating()
  const groupList = Object.entries(groups)
  
  if (groupList.length === 0){
  return m.reply("⚠️ Bot tidak berada di group manapun.")
  }
  
  const rows = groupList.map(([id,meta])=>({
  title: meta.subject || "Unknown Group",
  description: id,
  id: `.kirimpesangc --send ${id}`
  }))
  
  await sock.sendMessage(m.chat,{
  text: `
  ╭━━━〔 💗 *PILIH GROUP TUJUAN* 💗 〕━━━⬣
  ┃
  ┃ Pilih group yang ingin
  ┃ dikirim pesan oleh bot
  ┃
  ┃ 📊 Total group :
  ┃ *${groupList.length}*
  ┃
  ╰━━━━━━━━━━━━━━━━━━⬣
  `,
  footer: "WhatsApp Bot BOT",
  interactiveButtons: [
  {
  name: "single_select",
  buttonParamsJson: JSON.stringify({
  title: "📂 Pilih Group",
  sections: [{
  title: "Daftar Group",
  rows: rows
  }]
  })
  }
  ]
  },{ quoted:m })
  
  }catch(e){
  
  m.reply(`
  ❌ Error mengambil group
  
  ${e.message}
  `)
  
  }
  
  }
  
  
  
  Object.defineProperty(__vxExports, "FEATURE_CREDIT", { enumerable: true, get: () => FEATURE_CREDIT });
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
