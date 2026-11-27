// ───────── travel ─────────
// Dipecah dari plugins/rpg/petualangan.js (dulu digabung dengan fitur lain dalam satu file)

import { rpgCmd } from '../../lib/rpg/bridge.js'
import { oneCommand } from '../../lib/engine/plugins.js'

const cmdTravel = rpgCmd(["travel"], async (A) => {
    const { initRpgUser, sender, pushname, text, reply, rpgDb, saveRpg } = A
    switch (0) {
        default:
            {
              initRpgUser(sender, pushname)
              const lokasi = ['hutan', 'desa', 'gunung', 'kuil']
              if (!text || !lokasi.includes(text.toLowerCase())) {
                return reply(`🌍 Lokasi tersedia: ${lokasi.join(', ')}`)
              }
              rpgDb[sender].location = text.toLowerCase()
              saveRpg()
              reply(`🧭 Kamu berpindah ke *${text}*.`)
              break
            }
    }
}, { tags: 'rpg' })

// satu command = nama file
export default oneCommand(cmdTravel, 'travel')
