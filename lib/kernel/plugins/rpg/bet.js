// ───────── bet ─────────
// Dipasang dari menu RPG WhatsApp Bot (.bet). Memakai rpgDb yang tersambung ke akun user WhatsApp Bot
// (coin = money, bank = bank, exp = exp), jadi datanya sama dengan seluruh fitur RPG lain.

import { rpgCmd } from '../../lib/rpg/bridge.js'
import { oneCommand } from '../../lib/engine/plugins.js'

const cmd = rpgCmd(["bet"], async (A) => {
    const { initRpgUser, sender, pushname, rpgDb, text, reply, fmt, saveRpg, prefix } = A
    initRpgUser(sender, pushname)
    if (!text) return reply(`Masukkan jumlah coin: contoh *${prefix}bet 500*`)
    const jumlah = parseInt(text, 10)
    if (!Number.isInteger(jumlah) || jumlah <= 0) return reply('Jumlah tidak valid.')
    const u = rpgDb[sender]
    if (u.coin < jumlah) return reply(`💸 Coin tidak cukup. Kamu punya ${fmt(u.coin)}.`)

    const menang = Math.random() < 0.45 // peluang menang 45%
    if (menang) u.coin += jumlah
    else u.coin -= jumlah
    saveRpg()
    return reply(menang
        ? `🎲 Kamu bertaruh ${fmt(jumlah)} coin di arena dan *MENANG*! 🎉\n+💰 ${fmt(jumlah)} (total ${fmt(u.coin)})`
        : `🎲 Kamu bertaruh ${fmt(jumlah)} coin di arena dan *KALAH*... 😢\n-💰 ${fmt(jumlah)} (sisa ${fmt(u.coin)})`)
}, { tags: 'rpg', desc: 'Taruhan coin' })

// satu command = nama file
export default oneCommand(cmd, 'bet')
