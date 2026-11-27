// rpg/rpg-setrpg — satu file: metadata + kode fitur (gabungan dari engine2/plugins/rpg/rpg-setrpg.js)
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "setrpg"
  ],
  "category": "rpg",
  "owner": false,
  "group": true,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur setrpg (dari Bot package)"
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/rpg").split('\\').join('/')
module.exports = __vx.plugin("rpg/rpg-setrpg", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/rpg-setrpg.js'
  const __vxExports = {};
  let handler = async (m,{conn,args})=>{
  
  let user = global.db.data.users[m.sender]
  
  let type = (args[0]||'').toLowerCase()
  
  if(type !== 'WhatsApp Bot')
  return conn.reply(m.chat,'Gunakan:\n.setrpg WhatsApp Bot',m)
  
  if(user.vanxone)
  return conn.reply(m.chat,'Kamu sudah menjadi Adventurer WhatsApp Bot',m)
  
  user.vanxone = true
  
  conn.reply(m.chat,`
  🌸 *WhatsApp Bot RPG* ❀
  
  Selamat datang Adventurer!
  
  Sekarang kamu bisa berburu monster dengan:
  .huntanya
  `,m)
  
  }
  
  handler.help = ['setrpg']
  handler.tags = ['rpg']
  handler.command = /^(setrpg)$/i
  handler.group = true
  
  const __vxDefault = handler
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})
