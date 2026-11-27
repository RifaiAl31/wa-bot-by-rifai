// ───────── invasion ─────────
// Dipecah dari plugins/rpg/tempur.js (dulu digabung dengan fitur lain dalam satu file)

import { rpgCmd } from '../../lib/rpg/bridge.js'
import { oneCommand } from '../../lib/engine/plugins.js'

const cmdInvasion = rpgCmd(["invasion"], async (A) => {
    const { reply } = A
    switch (0) {
        default:
            {
              reply(`⚔️ Kamu memulai invasi ke wilayah musuh! Gunakan *duel* untuk menyerang target.`)
              break
            }
    }
}, { tags: 'rpg' })

// satu command = nama file
export default oneCommand(cmdInvasion, 'invasion')
