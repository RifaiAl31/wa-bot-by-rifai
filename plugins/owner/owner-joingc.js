// owner/owner-joingc — satu file: metadata + kode fitur (gabungan dari engine2/plugins/owner/owner-joingc.js)
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "joingc"
  ],
  "category": "owner",
  "owner": true,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur joingc (dari Bot package)"
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/owner").split('\\').join('/')
module.exports = __vx.plugin("owner/owner-joingc", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/owner-joingc.js'
  const __vxExports = {};
  let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
      return m.reply(
        `Contoh:\n${usedPrefix + command} https://chat.whatsapp.com/AbCdEfGhIjKlMnOpQrStUv`
      )
    }
  
    const match = text.trim().match(
      /(?:https?:\/\/)?chat\.whatsapp\.com\/([0-9A-Za-z]{20,30})/i
    )
  
    if (!match) {
      return m.reply('❌ Link grup WhatsApp tidak valid.')
    }
  
    const code = match[1]
  
    try {
      await m.react?.('⏳')
  
      // Preview info grup (opsional)
      let info = null
      try {
        info = await conn.groupGetInviteInfo(code)
      } catch {}
  
      // Join grup
      const jid = await conn.groupAcceptInvite(code)
  
      await m.react?.('✅')
  
      let txt = `✅ Berhasil bergabung ke grup.`
  
      if (info) {
        txt += `
  
  📌 Nama : ${info.subject || '-'}
  👥 Member : ${info.size || info.participants?.length || '-'}
  🆔 JID : ${jid}`
      }
  
      m.reply(txt)
    } catch (e) {
      console.error(e)
  
      let msg = '❌ Gagal bergabung ke grup.'
  
      if (/already/i.test(String(e))) {
        msg = 'ℹ️ Bot sudah berada di grup tersebut.'
      } else if (/expired/i.test(String(e))) {
        msg = '❌ Link grup sudah kedaluwarsa.'
      } else if (/not-authorized|401/i.test(String(e))) {
        msg = '❌ Link grup tidak valid.'
      }
  
      m.reply(msg)
    }
  }
  
  handler.help = ['joingc <link grup>']
  handler.tags = ['owner']
  handler.command = ['joingc', 'joingc']
  handler.owner = true
  
  const __vxDefault = handler
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})
