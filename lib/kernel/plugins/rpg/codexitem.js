// ───────── codexitem ─────────
// Dipecah dari plugins/rpg/cerita.js (dulu digabung dengan fitur lain dalam satu file)

import { rpgCmd } from '../../lib/rpg/bridge.js'
import { oneCommand } from '../../lib/engine/plugins.js'

const cmdCodexitem = rpgCmd(["codexitem"], async (A) => {
    const { reply } = A
    switch (0) {
        default:
            {
              reply(`📚 *KODEX ITEM:*\n- Ramuan: +50 HP\n- Kunci: Buka peti\n- Tulang: Bahan alchemy`)
              break
            }
    }
}, { tags: 'rpg' })

// satu command = nama file
export default oneCommand(cmdCodexitem, 'codexitem')
