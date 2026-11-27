// ───────── curse ─────────
// Dipecah dari plugins/rpg/tempur.js (dulu digabung dengan fitur lain dalam satu file)

import { rpgCmd } from '../../lib/rpg/bridge.js'
import { oneCommand } from '../../lib/engine/plugins.js'

const cmdCurse = rpgCmd(["curse"], async (A) => {
    const { initRpgUser, sender, pushname, m, reply, rpgDb, saveRpg } = A
    switch (0) {
        default:
            {
              initRpgUser(sender, pushname)
              if (!m.quoted) return reply(`reply target untuk dikutuk.`)
              let target = m.quoted.sender
              initRpgUser(target)
              rpgDb[target].curse = true
              saveRpg()
              reply(`👻 Target telah dikutuk. Efek negatif akan aktif!`)
              break
            }
    }
}, { tags: 'rpg' })

// satu command = nama file
export default oneCommand(cmdCurse, 'curse')
