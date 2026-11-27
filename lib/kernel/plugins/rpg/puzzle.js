// ───────── puzzle ─────────
// Dipecah dari plugins/rpg/cerita.js (dulu digabung dengan fitur lain dalam satu file)

import { rpgCmd } from '../../lib/rpg/bridge.js'
import { oneCommand } from '../../lib/engine/plugins.js'

const cmdPuzzle = rpgCmd(["puzzle"], async (A) => {
    const { reply } = A
    switch (0) {
        default:
            {
              const teka = `❓ *TEKA-TEKI RPG*
            Aku punya wajah tapi tak bisa melihat.
            Aku punya tangan tapi tak bisa meraih.
            Siapakah aku?`

              reply(teka)
              break
            }
    }
}, { tags: 'rpg' })

// satu command = nama file
export default oneCommand(cmdPuzzle, 'puzzle')
