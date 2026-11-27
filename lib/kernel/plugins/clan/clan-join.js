// ───────── clan-join ─────────
// data memakai store clan yang SAMA dengan clancreate/clanjoin/dst (db.data.clans, user.clanId).

import { rpgCmd, clanGameRun } from '../../lib/rpg/bridge.js'
import { oneCommand } from '../../lib/engine/plugins.js'

const cmd = rpgCmd(["clan-join"], (A) => clanGameRun(A, 'join'), { tags: 'clan', group: true, desc: 'Minta bergabung ke clan: .clan-join <nama>' })

// satu command = nama file
export default oneCommand(cmd, 'clan-join')
