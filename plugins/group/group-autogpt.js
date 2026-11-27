// group/group-autogpt — satu file: metadata + kode fitur (gabungan dari engine2/plugins/group/group-autogpt.js)
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "autoanya"
  ],
  "category": "group",
  "owner": false,
  "group": true,
  "admin": true,
  "botAdmin": false,
  "desc": "Fitur autoanya (dari Bot package)"
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/group").split('\\').join('/')
module.exports = __vx.plugin("group/group-autogpt", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/group-autogpt.js'
  const __vxExports = {};
  let handler = async (m, { conn, args, isAdmin, isOwner }) => {
    if (!m.isGroup) return m.reply('Khusus grup.')
  
    // Admin grup ATAU owner bot boleh akses
    if (!isAdmin && !isOwner) {
      return m.reply('Fitur ini khusus admin grup atau owner bot.')
    }
  
    if (!global.db.data.chats[m.chat]) {
      global.db.data.chats[m.chat] = {}
    }
    let chat = global.db.data.chats[m.chat]
  
    if (!args[0]) {
      return m.reply(
  `*AUTO WhatsApp Bot*
  
  Contoh:
  .autoanya on
  .autoanya off`
      )
    }
  
    let type = args[0].toLowerCase()
  
    if (type === 'on') {
      chat.autogpt = true
      return m.reply(
  `Waku waku~ 🤗
  
  Auto WhatsApp Bot berhasil diaktifkan.`
      )
    }
  
    if (type === 'off') {
      chat.autogpt = false
      return m.reply(
  `Hweh... 🥹
  
  Auto WhatsApp Bot dimatikan dulu yaa.`
      )
    }
  
    return m.reply('Pilih on / off')
  }
  
  handler.help = ['autoanya']
  handler.tags = ['group']
  handler.command = /^(autoanya)$/i
  
  handler.group = true
  // Jangan pakai handler.admin = true
  // Biar owner bot tetap bisa akses walaupun bukan admin grup
  
  const __vxDefault = handler
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})
