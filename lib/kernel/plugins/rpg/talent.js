// ───────── talent ─────────
// Dipecah dari plugins/rpg/karakter.js (dulu digabung dengan fitur lain dalam satu file)

import { rpgCmd } from '../../lib/rpg/bridge.js'
import { oneCommand } from '../../lib/engine/plugins.js'

const cmdTalent = rpgCmd(["talent"], async (A) => {
    const { initRpgUser, sender, pushname, rpgDb, reply } = A
    switch (0) {
        default:
            {
              initRpgUser(sender, pushname)
              let kelas = rpgDb[sender].class || 'belum memilih'
              let teks = {
                knight: '⚔️ Damage +10 saat duel',
                mage: '🔮 Skill cooldown -10%',
                archer: '🏹 Critical +15%'
              }
              reply(`💡 *Talent Class ${kelas}:*\n${teks[kelas] || 'Belum tersedia'}`)
              break
            }
    }
}, { tags: 'rpg' })

// satu command = nama file
export default oneCommand(cmdTalent, 'talent')
