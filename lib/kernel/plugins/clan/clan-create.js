// ───────── clan-create ─────────
// data memakai store clan yang SAMA dengan clancreate/clanjoin/dst (db.data.clans, user.clanId).

import { rpgCmd, clanGameRun } from '../../lib/rpg/bridge.js'
import { oneCommand } from '../../lib/engine/plugins.js'

const cmd = rpgCmd(["clan-create"], (A) => clanGameRun(A, 'create'), { tags: 'clan', group: true, desc: 'Buat clan: .clan-create <nama>' })

// satu command = nama file
export default oneCommand(cmd, 'clan-create')
