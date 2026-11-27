// ───────── riddle ─────────
// Dipecah dari plugins/rpg/cerita.js (dulu digabung dengan fitur lain dalam satu file)

import { rpgCmd } from '../../lib/rpg/bridge.js'
import { oneCommand } from '../../lib/engine/plugins.js'

const cmdRiddle = rpgCmd(["riddle"], async (A) => {
    const { reply } = A
    switch (0) {
        default:
            {
              let soal = `❓ Aku punya kaki tapi tak bisa jalan. Siapa aku?`
              reply(soal)
              break
            }
    }
}, { tags: 'rpg' })

// satu command = nama file
export default oneCommand(cmdRiddle, 'riddle')
