// ───────── clan-delete ─────────
// data memakai store clan yang SAMA dengan clancreate/clanjoin/dst (db.data.clans, user.clanId).

import { rpgCmd, clanGameRun } from '../../lib/rpg/bridge.js'
import { oneCommand } from '../../lib/engine/plugins.js'

const cmd = rpgCmd(["clan-delete"], (A) => clanGameRun(A, 'delete'), { tags: 'clan', group: true, desc: 'Hapus clan milikmu (ketua)' })

// satu command = nama file
export default oneCommand(cmd, 'clan-delete')
