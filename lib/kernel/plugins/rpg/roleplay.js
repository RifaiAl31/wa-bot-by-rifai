// ───────── roleplay ─────────
// Dipecah dari plugins/rpg/cerita.js (dulu digabung dengan fitur lain dalam satu file)

import { rpgCmd } from '../../lib/rpg/bridge.js'
import { oneCommand } from '../../lib/engine/plugins.js'

const cmdRoleplay = rpgCmd(["roleplay"], async (A) => {
    const { initRpgUser, sender, pushname, text, reply } = A
    switch (0) {
        default:
            {
              initRpgUser(sender, pushname)
              if (!text) {
                reply(`Ketik teks RP-mu. Contoh: *roleplay aku memeluk naga yang terluka...*`)
                break
              }

              reply(`🎭 *${pushname} beraksi:*\n_${text}_`)
              break
            }
    }
}, { tags: 'rpg' })

// satu command = nama file
export default oneCommand(cmdRoleplay, 'roleplay')
