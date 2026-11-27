// ───────── stashall ─────────
// Dipecah dari plugins/rpg/gudang.js (dulu digabung dengan fitur lain dalam satu file)

import { rpgCmd } from '../../lib/rpg/bridge.js'
import { oneCommand } from '../../lib/engine/plugins.js'

const cmdStashall = rpgCmd(["stashall"], async (A) => {
    const { initRpgUser, sender, pushname, rpgDb, saveRpg, reply } = A
    switch (0) {
        default:
            {
              initRpgUser(sender, pushname)
              rpgDb[sender].storage = rpgDb[sender].storage || []
              rpgDb[sender].storage.push(...rpgDb[sender].inv)
              rpgDb[sender].inv = []
              saveRpg()
              reply(`📦 Semua item dipindah ke storage.`)
              break
            }
    }
}, { tags: 'rpg' })

// satu command = nama file
export default oneCommand(cmdStashall, 'stashall')
