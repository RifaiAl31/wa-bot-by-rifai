// ───────── exchange ─────────
// Dipecah dari plugins/rpg/ekonomi.js (dulu digabung dengan fitur lain dalam satu file)

import { rpgCmd } from '../../lib/rpg/bridge.js'
import { oneCommand } from '../../lib/engine/plugins.js'

const cmdExchange = rpgCmd(["exchange"], async (A) => {
    const { initRpgUser, sender, pushname, text, rpgDb, reply, saveRpg } = A
    switch (0) {
        default:
            {
              initRpgUser(sender, pushname)
              if (!text || !rpgDb[sender].inv.includes(text)) return reply(`Kamu tidak punya item *${text}*`)
              rpgDb[sender].inv = rpgDb[sender].inv.filter(i => i !== text)
              rpgDb[sender].coin += 200
              saveRpg()
              reply(`🪙 Kamu tukar *${text}* jadi 200 koin.`)
              break
            }
    }
}, { tags: 'rpg' })

// satu command = nama file
export default oneCommand(cmdExchange, 'exchange')
