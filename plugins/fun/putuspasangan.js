// relationship/putuspasangan — satu file: metadata + kode fitur (gabungan dari engine2/plugins/relationship/putuspasangan.js)
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "delpasangan",
    "putuspasangan"
  ],
  "category": "fun",
  "owner": true,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur putuspasangan (dari Bot package)"
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/relationship").split('\\').join('/')
module.exports = __vx.plugin("relationship/putuspasangan", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/putuspasangan.js'
  const __vxExports = {};
  const createUser = (jid) => {
    const users = global.db.data.users
  
    if (!users[jid]) users[jid] = {}
  
    if (!users[jid].relationship) {
      users[jid].relationship = {
        pasangan: '',
        pending: '',
        dari: '',
        sejak: 0
      }
    }
  
    return users[jid]
  }
  
  const tag = jid => '@' + jid.split('@')[0]
  
  let handler = async (m, { conn, text, usedPrefix, command }) => {
    let target = null
  
    // Mention
    if (m.mentionedJid.length) {
      target = m.mentionedJid[0]
    }
  
    // Reply
    else if (m.quoted) {
      target = m.quoted.sender
    }
  
    // Nomor
    else if (text) {
      let nomor = text.replace(/[^0-9]/g, '')
      if (nomor) target = nomor + '@s.whatsapp.net'
    }
  
    if (!target) {
      return m.reply(
  `Contoh penggunaan:
  
  ${usedPrefix + command} @user
  
  ${usedPrefix + command} 6281234567890
  
  Atau reply target:
  
  ${usedPrefix + command}`
      )
    }
  
    let user = createUser(target)
  
    if (!user.relationship.pasangan)
      return m.reply('❌ User tersebut tidak memiliki pasangan.')
  
    let pasangan = user.relationship.pasangan
    let partner = createUser(pasangan)
  
    // Reset target
    user.relationship = {
      pasangan: '',
      pending: '',
      dari: '',
      sejak: 0
    }
  
    // Reset pasangan jika masih sinkron
    if (partner.relationship.pasangan === target) {
      partner.relationship = {
        pasangan: '',
        pending: '',
        dari: '',
        sejak: 0
      }
    }
  
    conn.reply(
      m.chat,
  `💔 *PASANGAN BERHASIL DIPUTUSKAN*
  
  ${tag(target)} 💔 ${tag(pasangan)}
  
  Hubungan mereka telah diputuskan oleh Owner.`,
      m,
      {
        mentions: [target, pasangan]
      }
    )
  }
  
  handler.help = ['putuspasangan']
  handler.tags = ['owner']
  handler.command = /^(putuspasangan|delpasangan)$/i
  handler.owner = true
  
  const __vxDefault = handler
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})
