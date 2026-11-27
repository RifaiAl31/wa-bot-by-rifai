// ───────── debuff ─────────
// Dipecah dari plugins/rpg/tempur.js (dulu digabung dengan fitur lain dalam satu file)

import { rpgCmd } from '../../lib/rpg/bridge.js'
import { oneCommand } from '../../lib/engine/plugins.js'

const cmdDebuff = rpgCmd(["debuff"], async (A) => {
    const { m, reply, initRpgUser, rpgDb, saveRpg } = A
    switch (0) {
        default:
            {
              if (!m.quoted) return reply('reply target untuk diberi debuff.')
              let target = m.quoted.sender
              initRpgUser(target)
              rpgDb[target].debuff = 'burn'
              saveRpg()
              reply(`🔥 Musuh terkena efek *burn*!`)
              break
            }
    }
}, { tags: 'rpg' })

// satu command = nama file
export default oneCommand(cmdDebuff, 'debuff')
