import { adapt } from '../../lib/engine/plugins.js'
let handler = async (m, { conn }) => {
let user = global.kdb.data.users[m.sender]
let e = global.krpg.emoticon

let text = `
*${(global.namebot || 'BOT').toUpperCase()} RPG BANK* ❀

${e('money')} Money : ${user.money}
${e('bank')} Bank  : ${user.bank}
💳 ATM : ${user.atm > 0 ? '✔️' : '❌'}

Gunakan:
.deposit jumlah
.withdraw jumlah
.buyatm
.upgradeatm
`.trim()

conn.reply(m.chat, text, global.kfstatus)
}

handler.help = ['rpg-bank']
handler.tags = ['rpg']
handler.command = ['rpg-bank']
handler.group = true

export default adapt(handler, { category: 'rpg' })
