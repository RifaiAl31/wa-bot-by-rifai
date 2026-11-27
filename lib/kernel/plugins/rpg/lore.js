// ───────── lore ─────────
// Dipecah dari plugins/rpg/cerita.js (dulu digabung dengan fitur lain dalam satu file)

import { rpgCmd } from '../../lib/rpg/bridge.js'
import { oneCommand } from '../../lib/engine/plugins.js'

const cmdLore = rpgCmd(["lore"], async (A) => {
    const { reply } = A
    switch (0) {
        default:
            {
              reply(`📖 *LORE DUNIA RPG*\nDi zaman kuno, 4 elemen bertarung merebut dunia...`)
              break
            }
    }
}, { tags: 'rpg' })

// satu command = nama file
export default oneCommand(cmdLore, 'lore')
