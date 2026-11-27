// ───────── clan-tournament ─────────
// data memakai store clan yang SAMA dengan clancreate/clanjoin/dst (db.data.clans, user.clanId).

import { rpgCmd, clanGameRun } from '../../lib/rpg/bridge.js'
import { oneCommand } from '../../lib/engine/plugins.js'

const cmd = rpgCmd(["clan-tournament"], (A) => clanGameRun(A, 'tournament'), { tags: 'clan', group: true, desc: 'Turnamen clan: create | join | start | status' })

// satu command = nama file
export default oneCommand(cmd, 'clan-tournament')
