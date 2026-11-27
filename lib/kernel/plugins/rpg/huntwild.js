// ───────── huntwild ─────────
// Dipecah dari plugins/rpg/bertahan.js (dulu digabung dengan fitur lain dalam satu file)

import { rpgCmd } from '../../lib/rpg/bridge.js'
import { oneCommand } from '../../lib/engine/plugins.js'

const cmdHuntwild = rpgCmd(["huntwild"], async (A) => {
    const { initRpgUser, sender, pushname, rpgDb, saveRpg, reply } = A
    switch (0) {
        default:
            {
              initRpgUser(sender, pushname)
              let hewan = ['rusa', 'kelinci', 'beruang']
              let target = hewan[Math.floor(Math.random() * hewan.length)]
              rpgDb[sender].inv.push(`daging ${target}`)
              saveRpg()
              reply(`🏹 Kamu berburu dan mendapatkan *daging ${target}*`)
              break
            }
    }
}, { tags: 'rpg' })

// satu command = nama file
export default oneCommand(cmdHuntwild, 'huntwild')
