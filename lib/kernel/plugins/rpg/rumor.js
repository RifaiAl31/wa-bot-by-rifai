// ───────── rumor ─────────
// Dipecah dari plugins/rpg/cerita.js (dulu digabung dengan fitur lain dalam satu file)

import { rpgCmd } from '../../lib/rpg/bridge.js'
import { oneCommand } from '../../lib/engine/plugins.js'

const cmdRumor = rpgCmd(["rumor"], async (A) => {
    const { reply } = A
    switch (0) {
        default:
            {
              let r = ['💀 Penjaga Kuil telah bangkit!', '🎁 Event harta akan muncul besok!', '🌪️ Badai di Gunung Utara!']
              reply(`💬 *RUMOR TERSEBAR:*\n${r[Math.floor(Math.random() * r.length)]}`)
              break
            }
    }
}, { tags: 'rpg' })

// satu command = nama file
export default oneCommand(cmdRumor, 'rumor')
