// ───────── storyquest ─────────
// Dipecah dari plugins/rpg/cerita.js (dulu digabung dengan fitur lain dalam satu file)

import { rpgCmd } from '../../lib/rpg/bridge.js'
import { oneCommand } from '../../lib/engine/plugins.js'

const cmdStoryquest = rpgCmd(["storyquest"], async (A) => {
    const { initRpgUser, sender, rpgDb, reply } = A
    switch (0) {
        default:
            {
              initRpgUser(sender)
              let user = rpgDb[sender]

              let story = user.story || 0
              let list = [
                '🌄 Kamu terbangun di desa terpencil...',
                '🧙 Seorang penyihir tua memanggilmu untuk misi suci...',
                '🐉 Kamu mendengar rumor tentang naga di gunung utara...',
                '🏰 Sebuah kerajaan membutuhkan pertolonganmu...',
                '☠️ Sebuah makhluk gelap mengintai dunia ini...'
              ]
              let teks = `📜 *STORY QUEST*\n\n${list[story % list.length]}\n\nKetik *nextquest* untuk lanjut cerita.`
              return reply(teks)
            }
    }
}, { tags: 'rpg' })

// satu command = nama file
export default oneCommand(cmdStoryquest, 'storyquest')
