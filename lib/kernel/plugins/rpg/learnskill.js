// ───────── learnskill ─────────
// Dipecah dari plugins/rpg/karakter.js (dulu digabung dengan fitur lain dalam satu file)

import { rpgCmd } from '../../lib/rpg/bridge.js'
import { oneCommand } from '../../lib/engine/plugins.js'

const cmdLearnskill = rpgCmd(["learnskill"], async (A) => {
    const { initRpgUser, sender, pushname, text, reply, rpgDb, saveRpg } = A
    switch (0) {
        default:
            {
              initRpgUser(sender, pushname)
              const skillList = ['fireball', 'heal', 'iceblast']
              if (!text || !skillList.includes(text)) return reply(`Skill tersedia: ${skillList.join(', ')}`)
              rpgDb[sender].skill = text
              saveRpg()
              reply(`🎓 Kamu mempelajari skill *${text}*`)
              break
            }
    }
}, { tags: 'rpg' })

// satu command = nama file
export default oneCommand(cmdLearnskill, 'learnskill')
