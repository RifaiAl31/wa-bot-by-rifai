// ───────── clan-missions ─────────
// data memakai store clan yang SAMA dengan clancreate/clanjoin/dst (db.data.clans, user.clanId).

import { rpgCmd, clanGameRun } from '../../lib/rpg/bridge.js'
import { oneCommand } from '../../lib/engine/plugins.js'

const cmd = rpgCmd(["clan-missions"], (A) => clanGameRun(A, 'missions'), { tags: 'clan', group: true, desc: 'Misi harian & mingguan clan' })

// satu command = nama file
export default oneCommand(cmd, 'clan-missions')
