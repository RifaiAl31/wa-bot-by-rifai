// ───────── clan-task ─────────
// data memakai store clan yang SAMA dengan clancreate/clanjoin/dst (db.data.clans, user.clanId).

import { rpgCmd, clanGameRun } from '../../lib/rpg/bridge.js'
import { oneCommand } from '../../lib/engine/plugins.js'

const cmd = rpgCmd(["clan-task"], (A) => clanGameRun(A, 'task'), { tags: 'clan', group: true, desc: 'Task clan' })

// satu command = nama file
export default oneCommand(cmd, 'clan-task')
