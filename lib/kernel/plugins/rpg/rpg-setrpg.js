import { adapt } from '../../lib/engine/plugins.js'
let handler = async (m,{conn,args})=>{
let user = global.kdb.data.users[m.sender]

let type = (args[0]||'').toLowerCase()

if(type !== 'vanxone')
return conn.reply(m.chat,'Gunakan:\n.setrpg vanxone',m)

if(user.vanxone)
return conn.reply(m.chat,`Kamu sudah menjadi Adventurer ${global.namebot || 'Bot'}`,m)

user.vanxone = true

conn.reply(m.chat,`
*${(global.namebot || 'BOT').toUpperCase()} RPG* ❀

Selamat datang Adventurer!

Sekarang kamu bisa berburu monster dengan:
.huntanya
`,m)
}

handler.help = ['rpg-setrpg']
handler.tags = ['rpg']
handler.command = ['rpg-setrpg']
handler.group = true

export default adapt(handler, { category: 'rpg' })
