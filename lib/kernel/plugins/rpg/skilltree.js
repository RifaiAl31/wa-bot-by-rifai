// ───────── skilltree ─────────
// Dipecah dari plugins/rpg/karakter.js (dulu digabung dengan fitur lain dalam satu file)

import { rpgCmd } from '../../lib/rpg/bridge.js'
import { oneCommand } from '../../lib/engine/plugins.js'

const cmdSkilltree = rpgCmd(["skilltree"], async (A) => {
    const { initRpgUser, sender, pushname, reply } = A
    switch (0) {
        default:
            {
              initRpgUser(sender, pushname)
              reply(`🌳 *Skill Tree*\n- Fireball → Firestorm\n- Heal → Heal All\n- Slash → Blade Tornado`)
              break
            }
    }
}, { tags: 'rpg' })

// satu command = nama file
export default oneCommand(cmdSkilltree, 'skilltree')
