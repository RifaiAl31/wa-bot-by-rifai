// ───────── finaltrial ─────────
// Dipecah dari plugins/rpg/tempur.js (dulu digabung dengan fitur lain dalam satu file)

import { rpgCmd } from '../../lib/rpg/bridge.js'
import { oneCommand } from '../../lib/engine/plugins.js'

const cmdFinaltrial = rpgCmd(["finaltrial"], async (A) => {
    const { initRpgUser, sender, pushname, rpgDb, reply } = A
    switch (0) {
        default:
            {
              initRpgUser(sender, pushname)
              if (rpgDb[sender].level < 99) return reply('🚫 Butuh level 99 untuk ikut ujian akhir.')
              reply(`🔥 Ujian Dimulai!\nLawan 3 boss secara beruntun...`)
              break
            }
    }
}, { tags: 'rpg' })

// satu command = nama file
export default oneCommand(cmdFinaltrial, 'finaltrial')
