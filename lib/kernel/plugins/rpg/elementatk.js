// ───────── elementatk ─────────
// Dipecah dari plugins/rpg/karakter.js (dulu digabung dengan fitur lain dalam satu file)

import { rpgCmd } from '../../lib/rpg/bridge.js'
import { oneCommand } from '../../lib/engine/plugins.js'

const cmdElementatk = rpgCmd(["elementatk"], async (A) => {
    const { initRpgUser, sender, pushname, text, m, reply, rpgDb, saveRpg } = A
    switch (0) {
        default:
            {
              initRpgUser(sender, pushname)
              if (!text || !m.quoted) return reply(`Gunakan: *elementatk [serangan]* (reply target)`)

              let user = rpgDb[sender]
              let elemen = user.element || 'tanpa elemen'
              let damage = 30 + (user.element === 'api' ? 20 : 0)

              let target = m.quoted.sender
              initRpgUser(target)
              rpgDb[target].hp -= damage
              saveRpg()
              reply(`🌪️ Kamu menyerang dengan elemen *${elemen}*!\nTarget kehilangan ${damage} HP.`)
              break
            }
    }
}, { tags: 'rpg' })

// satu command = nama file
export default oneCommand(cmdElementatk, 'elementatk')
