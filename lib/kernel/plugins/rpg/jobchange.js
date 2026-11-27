// ───────── jobchange ─────────
// Dipecah dari plugins/rpg/karakter.js (dulu digabung dengan fitur lain dalam satu file)

import { rpgCmd } from '../../lib/rpg/bridge.js'
import { oneCommand } from '../../lib/engine/plugins.js'

const cmdJobchange = rpgCmd(["jobchange"], async (A) => {
    const { initRpgUser, sender, pushname, rpgDb, reply, saveRpg } = A
    switch (0) {
        default:
            {
              initRpgUser(sender, pushname)
              if (rpgDb[sender].level < 10) return reply(`🔒 Butuh level 10 untuk ganti class.`)
              rpgDb[sender].class = null
              saveRpg()
              reply(`🧠 Kamu dapat memilih class baru dengan perintah *class [nama]*`)
              break
            }
    }
}, { tags: 'rpg' })

// satu command = nama file
export default oneCommand(cmdJobchange, 'jobchange')
