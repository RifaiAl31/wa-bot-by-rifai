// ───────── blessnpc ─────────
// Dipecah dari plugins/rpg/tempur.js (dulu digabung dengan fitur lain dalam satu file)

import { rpgCmd } from '../../lib/rpg/bridge.js'
import { oneCommand } from '../../lib/engine/plugins.js'

const cmdBlessnpc = rpgCmd(["blessnpc"], async (A) => {
    const { initRpgUser, sender, pushname, reply } = A
    switch (0) {
        default:
            {
              initRpgUser(sender, pushname)
              let bonus = ['+10 HP', '+5 DEF', '+100 EXP']
              let buff = bonus[Math.floor(Math.random() * bonus.length)]
              reply(`✨ NPC memberkati kamu!\nEfek: ${buff}`)
              break
            }
    }
}, { tags: 'rpg' })

// satu command = nama file
export default oneCommand(cmdBlessnpc, 'blessnpc')
