// ───────── clan-approve ─────────
// data memakai store clan yang SAMA dengan clancreate/clanjoin/dst (db.data.clans, user.clanId).

import { rpgCmd, clanGameRun } from '../../lib/rpg/bridge.js'
import { oneCommand } from '../../lib/engine/plugins.js'

const cmd = rpgCmd(["clan-approve"], (A) => clanGameRun(A, 'approve'), { tags: 'clan', group: true, desc: 'Setujui permintaan join (ketua): .clan-approve [all|nomor]' })

// satu command = nama file
export default oneCommand(cmd, 'clan-approve')
