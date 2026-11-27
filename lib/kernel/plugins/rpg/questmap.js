// ───────── questmap ─────────
// Dipecah dari plugins/rpg/cerita.js (dulu digabung dengan fitur lain dalam satu file)

import { rpgCmd } from '../../lib/rpg/bridge.js'
import { oneCommand } from '../../lib/engine/plugins.js'

const cmdQuestmap = rpgCmd(["questmap"], async (A) => {
    const { reply } = A
    switch (0) {
        default:
            {
              reply(`🗺️ *PETA QUEST DUNIA RPG*

            1. 🌲 Hutan Gelap — Kalahkan 3 serigala
            2. 🏰 Kastil Retak — Temukan Pedang Warisan
            3. 🌋 Gunung Lava — Bertahan dari Boss Api

            Ketik *quest [nama]* untuk memulai (belum aktif sistem interaksinya)`)
              break
            }
    }
}, { tags: 'rpg' })

// satu command = nama file
export default oneCommand(cmdQuestmap, 'questmap')
