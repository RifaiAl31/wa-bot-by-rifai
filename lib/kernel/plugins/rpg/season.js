// ───────── season ─────────
// Dipecah dari plugins/rpg/petualangan.js (dulu digabung dengan fitur lain dalam satu file)

import { rpgCmd } from '../../lib/rpg/bridge.js'
import { oneCommand } from '../../lib/engine/plugins.js'

const cmdSeason = rpgCmd(["season"], async (A) => {
    const { reply } = A
    switch (0) {
        default:
            {
              const musim = ['semi', 'panas', 'gugur', 'salju']
              const active = musim[Math.floor(Math.random() * musim.length)]
              global.rpgSeason = active
              reply(`📆 Musim saat ini adalah *${active.toUpperCase()}*.`)
              break
            }
    }
}, { tags: 'rpg' })

// satu command = nama file
export default oneCommand(cmdSeason, 'season')
