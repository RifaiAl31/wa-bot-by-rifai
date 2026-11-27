// ───────── zombieevent ─────────
// Dipecah dari plugins/rpg/tempur.js (dulu digabung dengan fitur lain dalam satu file)

import { rpgCmd } from '../../lib/rpg/bridge.js'
import { oneCommand } from '../../lib/engine/plugins.js'

const cmdZombieevent = rpgCmd(["zombieevent"], async (A) => {
    const { rpgDb, saveRpg, reply } = A
    switch (0) {
        default:
            {
              for (let id in rpgDb) {
                rpgDb[id].hp = Math.max(1, rpgDb[id].hp - 20)
              }
              saveRpg()
              reply(`🧟 Wabah zombie! Semua pemain kehilangan 20 HP!`)
              break
            }
    }
}, { tags: 'rpg' })

// satu command = nama file
export default oneCommand(cmdZombieevent, 'zombieevent')
