// ───────── forage ─────────
// Dipecah dari plugins/rpg/bertahan.js (dulu digabung dengan fitur lain dalam satu file)

import { rpgCmd } from '../../lib/rpg/bridge.js'
import { oneCommand } from '../../lib/engine/plugins.js'

const cmdForage = rpgCmd(["forage"], async (A) => {
    const { initRpgUser, sender, pushname, rpgDb, saveRpg, reply } = A
    switch (0) {
        default:
            {
              initRpgUser(sender, pushname)
              let tanaman = ['herba', 'akar ajaib', 'jamur emas']
              let item = tanaman[Math.floor(Math.random() * tanaman.length)]
              rpgDb[sender].inv.push(item)
              saveRpg()
              reply(`🌿 Kamu menemukan *${item}*!`)
              break
            }
    }
}, { tags: 'rpg' })

// satu command = nama file
export default oneCommand(cmdForage, 'forage')
