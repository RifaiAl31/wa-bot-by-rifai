// ───────── clan-leave ─────────
// data memakai store clan yang SAMA dengan clancreate/clanjoin/dst (db.data.clans, user.clanId).

import { rpgCmd, clanGameRun } from '../../lib/rpg/bridge.js'
import { oneCommand } from '../../lib/engine/plugins.js'

const cmd = rpgCmd(["clan-leave"], (A) => clanGameRun(A, 'leave'), { tags: 'clan', group: true, desc: 'Keluar dari clan' })

// satu command = nama file
export default oneCommand(cmd, 'clan-leave')
