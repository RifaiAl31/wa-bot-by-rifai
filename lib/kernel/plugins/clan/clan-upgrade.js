// ───────── clan-upgrade ─────────
// data memakai store clan yang SAMA dengan clancreate/clanjoin/dst (db.data.clans, user.clanId).

import { rpgCmd, clanGameRun } from '../../lib/rpg/bridge.js'
import { oneCommand } from '../../lib/engine/plugins.js'

const cmd = rpgCmd(["clan-upgrade"], (A) => clanGameRun(A, 'upgrade'), { tags: 'clan', group: true, desc: 'Upgrade level clan (ketua, bayar uang)' })

// satu command = nama file
export default oneCommand(cmd, 'clan-upgrade')
