// ───────── combo ─────────
// Dipecah dari plugins/rpg/tempur.js (dulu digabung dengan fitur lain dalam satu file)

import { rpgCmd } from '../../lib/rpg/bridge.js'
import { oneCommand } from '../../lib/engine/plugins.js'

const cmdCombo = rpgCmd(["combo"], async (A) => {
    const { initRpgUser, sender, pushname, rpgDb, reply } = A
    switch (0) {
        default:
            {
              initRpgUser(sender, pushname)
              let u = rpgDb[sender]
              let comboDmg = u.class === 'knight' ? 100 : u.class === 'mage' ? 90 : 80
              reply(`🗡️ Kamu gunakan COMBO! DMG: ${comboDmg}`)
              break
            }
    }
}, { tags: 'rpg' })

// satu command = nama file
export default oneCommand(cmdCombo, 'combo')
