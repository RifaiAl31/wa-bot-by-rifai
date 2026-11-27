// misc/birthdaylist — satu file: metadata + kode fitur (gabungan dari engine2/plugins/misc/birthdaylist.js)
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "listbirthday"
  ],
  "category": "tools",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur listbirthday (dari Bot package)"
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/misc").split('\\').join('/')
module.exports = __vx.plugin("misc/birthdaylist", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/birthdaylist.js'
  const __vxExports = {};
  let handler = async (m) => {
    const db = global.db?.data?.users
    if (!db) return m.reply('❌ DB tidak ditemukan')
  
    const list = Object.entries(db)
      .filter(([_, u]) => u?.birthday)
  
    if (!list.length) return m.reply('❌ Belum ada birthday')
  
    let text = `📋 *LIST BIRTHDAY*\n\n`
  
    for (let [jid, u] of list) {
      text += `• @${jid.split('@')[0]} → ${u.birthday}\n`
    }
  
    m.reply(text, { mentions: list.map(v => v[0]) })
  }
  
  handler.help = ['listbirthday']
  handler.tags = ['info', 'xp']
  handler.command = /^listbirthday$/i
  const __vxDefault = handler
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})
