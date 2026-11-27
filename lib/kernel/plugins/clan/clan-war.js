// ───────── clan-war ─────────
// data memakai store clan yang SAMA dengan clancreate/clanjoin/dst (db.data.clans, user.clanId).

import { rpgCmd, clanGameRun } from '../../lib/rpg/bridge.js'
import { oneCommand } from '../../lib/engine/plugins.js'

const cmd = rpgCmd(["clan-war"], (A) => clanGameRun(A, 'war'), { tags: 'clan', group: true, desc: 'Mulai war melawan clan acak' })

// satu command = nama file
export default oneCommand(cmd, 'clan-war')
