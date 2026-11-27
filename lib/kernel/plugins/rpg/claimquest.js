// ───────── claimquest ─────────
// Dipasang dari menu RPG WhatsApp Bot (.claimquest). Memakai rpgDb yang tersambung ke akun user WhatsApp Bot
// (coin = money, bank = bank, exp = exp), jadi datanya sama dengan seluruh fitur RPG lain.

import { rpgCmd } from '../../lib/rpg/bridge.js'
import { oneCommand } from '../../lib/engine/plugins.js'
import { questRun } from '../../lib/db/database.js'

const cmd = rpgCmd(["claimquest"], async (A) => {
    return questRun(A)
}, { tags: 'rpg', desc: 'Klaim hadiah quest harian' })

// satu command = nama file
export default oneCommand(cmd, 'claimquest')
