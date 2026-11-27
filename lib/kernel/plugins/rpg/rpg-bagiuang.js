import { adapt } from '../../lib/engine/plugins.js'
let handler = async (m, { conn, args }) => {
let user = global.kdb.data.users[m.sender]
let target = m.mentionedJid[0]

if (!target) return conn.reply(m.chat, `Tag orang yang ingin kamu beri uang

Contoh:
.bagiuang @user 5000`, global.kfstatus)

if (!args[1]) return conn.reply(m.chat, `Masukkan jumlah uang yang ingin diberikan`, global.kfstatus)

let jumlah = parseInt(args[1])

if (!Number.isFinite(jumlah) || jumlah < 1) return conn.reply(m.chat, `Jumlah tidak valid`, global.kfstatus)

if (user.money < jumlah) return conn.reply(m.chat, `Uang kamu tidak cukup`, global.kfstatus)

if (target === m.sender) return conn.reply(m.chat, `Tidak bisa memberi uang ke diri sendiri`, global.kfstatus)

let targetUser = global.kdb.data.users[target]
if (!targetUser) return conn.reply(m.chat, `Target belum pernah memakai bot, suruh dia kirim command apa saja dulu`, global.kfstatus)

user.money -= jumlah
targetUser.money += jumlah

let teks = `${(global.namebot || 'BOT').toUpperCase()} BERBAGI ❀

💸 @${m.sender.split('@')[0]} memberikan uang kepada
🎁 @${target.split('@')[0]}

💰 Jumlah : ${jumlah} Money

Baik sekali kamu hari ini`

conn.reply(m.chat, teks, global.kfstatus, {
mentions: [m.sender, target]
})
}

handler.help = ['rpg-bagiuang']
handler.tags = ['rpg']
handler.command = ['rpg-bagiuang']
handler.group = true

export default adapt(handler, { category: 'rpg' })
