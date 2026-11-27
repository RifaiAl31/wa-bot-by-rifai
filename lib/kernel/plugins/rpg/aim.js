// ───────── aim ─────────
// Dipecah dari plugins/rpg/tempur.js (dulu digabung dengan fitur lain dalam satu file)

import { rpgCmd } from '../../lib/rpg/bridge.js'
import { oneCommand } from '../../lib/engine/plugins.js'

const cmdAim = rpgCmd(["aim"], async (A) => {
    const { m, reply, initRpgUser, rpgDb, saveRpg } = A
    switch (0) {
        default:
            {
              if (!m.quoted) return reply('reply target musuh.')
              let target = m.quoted.sender
              initRpgUser(target)
              rpgDb[target].hp -= 50
              saveRpg()
              reply(`🎯 Kamu membidik dan menyerang ${target}, -50 HP!`)
              break
            }
    }
}, { tags: 'rpg' })

// satu command = nama file
export default oneCommand(cmdAim, 'aim')
