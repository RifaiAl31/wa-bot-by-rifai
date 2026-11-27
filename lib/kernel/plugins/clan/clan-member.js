// ───────── clan-member ─────────
// data memakai store clan yang SAMA dengan clancreate/clanjoin/dst (db.data.clans, user.clanId).

import { rpgCmd, clanGameRun } from '../../lib/rpg/bridge.js'
import { oneCommand } from '../../lib/engine/plugins.js'

const cmd = rpgCmd(["clan-member"], (A) => clanGameRun(A, 'member'), { tags: 'clan', group: true, desc: 'Daftar anggota clan: .clan-member <nama>' })

// satu command = nama file
export default oneCommand(cmd, 'clan-member')
