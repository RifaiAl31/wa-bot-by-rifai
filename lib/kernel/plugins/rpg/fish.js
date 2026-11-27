// ───────── fish ─────────
// Dipecah dari plugins/rpg/bertahan.js (dulu digabung dengan fitur lain dalam satu file)

import { rpgCmd } from '../../lib/rpg/bridge.js'
import { oneCommand } from '../../lib/engine/plugins.js'

const cmdFish = rpgCmd(["fish"], async (A) => {
    const { initRpgUser, sender, pushname, rpgDb, saveRpg, reply } = A
    switch (0) {
        default:
            {
              initRpgUser(sender, pushname)
              let hasil = ['ikan biasa', 'ikan langka', 'ikan emas']
              let tangkapan = hasil[Math.floor(Math.random() * hasil.length)]
              rpgDb[sender].inv.push(tangkapan)
              saveRpg()
              reply(`🎣 Kamu memancing dan mendapatkan *${tangkapan}*!`)
              break
            }
    }
}, { tags: 'rpg' })

// satu command = nama file
export default oneCommand(cmdFish, 'fish')
