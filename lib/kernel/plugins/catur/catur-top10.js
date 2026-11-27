// ───────── catur-top10 ─────────
// data tersimpan di database game (database/rpg.json).

import { rpgCmd, caturRun } from '../../lib/rpg/bridge.js'
import { oneCommand } from '../../lib/engine/plugins.js'

const cmd = rpgCmd(["catur-top10"], (A) => caturRun(A, 'top10'), { tags: 'catur' })

// satu command = nama file
export default oneCommand(cmd, 'catur-top10')
