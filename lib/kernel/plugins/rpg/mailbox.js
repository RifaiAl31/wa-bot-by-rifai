// ───────── mailbox ─────────
// Dipecah dari plugins/rpg/gudang.js (dulu digabung dengan fitur lain dalam satu file)

import { rpgCmd } from '../../lib/rpg/bridge.js'
import { oneCommand } from '../../lib/engine/plugins.js'

const cmdMailbox = rpgCmd(["mailbox"], async (A) => {
    const { initRpgUser, sender, pushname, reply } = A
    switch (0) {
        default:
            {
              initRpgUser(sender, pushname)
              global.mailbox ||= {}
              global.mailbox[sender] ||= []

              let mails = global.mailbox[sender]
              if (!mails.length) return reply(`📭 Kotak suratmu kosong.`)

              let teks = `💌 *MAILBOX:*\n` + mails.map((m, i) => `${i + 1}. Dari: ${m.from}\n📦: ${m.item}`).join('\n\n')
              reply(teks)
              break
            }
    }
}, { tags: 'rpg' })

// satu command = nama file
export default oneCommand(cmdMailbox, 'mailbox')
