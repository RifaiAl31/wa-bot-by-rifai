// ───────── farm ─────────
// Dipasang dari menu RPG WhatsApp Bot (.farm). Memakai rpgDb yang tersambung ke akun user WhatsApp Bot
// (coin = money, bank = bank, exp = exp), jadi datanya sama dengan seluruh fitur RPG lain.

import { rpgCmd } from '../../lib/rpg/bridge.js'
import { oneCommand } from '../../lib/engine/plugins.js'

const cmd = rpgCmd(["farm"], async (A) => {
    const { initRpgUser, sender, pushname, rpgDb, reply, saveRpg, msToTime } = A
    initRpgUser(sender, pushname)
    const u = rpgDb[sender]
    const now = Date.now()
    const remaining = 60000 - (now - (u.lastFarm || 0))
    if (remaining > 0) return reply(`🌱 Tanaman belum siap panen. Tunggu *${msToTime(remaining)}* lagi.`)
    const hasil = ['gandum', 'apel'][Math.floor(Math.random() * 2)]
    u.inv.push(hasil)
    u.lastFarm = now
    saveRpg()
    return reply(`🌾 Kamu memanen *${hasil}*!`)
}, { tags: 'rpg', desc: 'Bertani, panen gandum/apel' })

// satu command = nama file
export default oneCommand(cmd, 'farm')
