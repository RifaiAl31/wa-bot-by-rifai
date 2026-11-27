// group/group-delsw — satu file: metadata + kode fitur (gabungan dari engine2/plugins/group/group-delsw.js)
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "delswgc"
  ],
  "category": "group",
  "owner": false,
  "group": false,
  "admin": true,
  "botAdmin": false,
  "desc": "Fitur delswgc (dari Bot package)"
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/group").split('\\').join('/')
module.exports = __vx.plugin("group/group-delsw", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/group-delsw.js'
  const __vxExports = {};
  let handler = async (m, { conn }) => {
      if (!m.quoted) return m.reply('📌 Reply status grup yang ingin dihapus!\n\nContoh: .delswgc (reply status)')
  
      try {
          await conn.sendMessage(m.chat, {
              delete: {
                  remoteJid: m.chat,
                  fromMe: false,
                  id: m.quoted.id,
                  participant: m.quoted.sender,
              }
          })
          
          return m.reply('✅ Status berhasil dihapus!')
      } catch (e) {
          console.error('Error:', e)
          return m.reply('❌ Gagal menghapus status.\n\nPastikan bot adalah admin grup dan reply ke pesan status yang benar.')
      }
  }
  
  handler.command = ['delswgc']
  handler.admin = true
  
  const __vxDefault = handler
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})
