// ───────── cookbook ─────────
// Dipecah dari plugins/rpg/bertahan.js (dulu digabung dengan fitur lain dalam satu file)

import { rpgCmd } from '../../lib/rpg/bridge.js'
import { oneCommand } from '../../lib/engine/plugins.js'

const cmdCookbook = rpgCmd(["cookbook"], async (A) => {
    const { reply } = A
    switch (0) {
        default:
            {
              reply(`📖 *Resep Masakan:*\n- supikan = ikan (hasil .fish) + air (gratis)\n- nasiherba = nasi (gandum hasil .farm) + herba (hasil .forage)\n\nMasak dengan: *.cook <nama resep>*`)
              break
            }
    }
}, { tags: 'rpg' })

// satu command = nama file
export default oneCommand(cmdCookbook, 'cookbook')
