// ───────── savepoint ─────────
// Dipecah dari plugins/rpg/petualangan.js (dulu digabung dengan fitur lain dalam satu file)

import { rpgCmd } from '../../lib/rpg/bridge.js'
import { oneCommand } from '../../lib/engine/plugins.js'

const cmdSavepoint = rpgCmd(["savepoint"], async (A) => {
    const { initRpgUser, sender, pushname, rpgDb, saveRpg, reply } = A
    switch (0) {
        default:
            {
              initRpgUser(sender, pushname)
              rpgDb[sender].savePoint = Date.now()
              saveRpg()
              reply(`💾 Kamu menyentuh *Save Point*. Progresmu disimpan.`)
              break
            }
    }
}, { tags: 'rpg' })

// satu command = nama file
export default oneCommand(cmdSavepoint, 'savepoint')
