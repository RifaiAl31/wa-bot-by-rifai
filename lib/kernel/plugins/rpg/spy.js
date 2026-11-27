// ───────── spy ─────────
// Dipecah dari plugins/rpg/tempur.js (dulu digabung dengan fitur lain dalam satu file)

import { rpgCmd } from '../../lib/rpg/bridge.js'
import { oneCommand } from '../../lib/engine/plugins.js'

const cmdSpy = rpgCmd(["spy"], async (A) => {
    const { m, reply, initRpgUser, rpgDb } = A
    switch (0) {
        default:
            {
              if (!m.quoted) return reply('reply target yang ingin diintai.')
              let target = m.quoted.sender
              initRpgUser(target)
              let lokasi = rpgDb[target].location || 'tidak diketahui'
              reply(`🕵️ Target berada di: *${lokasi}*`)
              break
            }
    }
}, { tags: 'rpg' })

// satu command = nama file
export default oneCommand(cmdSpy, 'spy')
