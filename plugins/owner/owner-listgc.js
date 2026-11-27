// owner/owner-listgc — satu file: metadata + kode fitur (gabungan dari engine2/plugins/owner/owner-listgc.js)
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "listgrup"
  ],
  "category": "owner",
  "owner": true,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur list (dari Bot package)"
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/owner").split('\\').join('/')
module.exports = __vx.plugin("owner/owner-listgc", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/owner-listgc.js'
  const __vxExports = {};
  let handler = async (m, { conn }) => {
    let groups = await conn.groupFetchAllParticipating()
    let list = Object.values(groups)
  
    if (!list.length) throw 'Bot belum masuk grup manapun.'
  
    let teks = `📋 *LIST GRUP BOT*\n\n`
    for (let i = 0; i < list.length; i++) {
      let g = list[i]
      teks += `${i + 1}. *${g.subject}*\n`
      teks += `   🆔 ID: ${g.id}\n`
      teks += `   👥 Member: ${g.participants?.length || 0}\n\n`
    }
  
    teks += `Total Grup: ${list.length}`
    m.reply(teks)
  }
  
  handler.help = ['listgc']
  handler.tags = ['owner']
  handler.command = /^list(gc|grup)?$/i
  handler.limit = false
  handler.owner = true 
  
  const __vxDefault = handler
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})
