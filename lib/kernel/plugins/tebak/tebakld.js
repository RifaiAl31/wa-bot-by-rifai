// ───────── tebakld ─────────
// dicatat mesin game (lib/engine/plugins.js) di user.gameWins. Mesin leaderboard: lib/rpg/bridge.js (tebakLeaderboardRun).

import { rpgCmd, tebakLeaderboardRun } from '../../lib/rpg/bridge.js'
import { oneCommand } from '../../lib/engine/plugins.js'

const cmd = rpgCmd(["tebakld"], (A) => tebakLeaderboardRun(A), { tags: 'tebak', desc: 'Leaderboard game tebak-tebakan' })

// satu command = nama file
export default oneCommand(cmd, 'tebakld')
