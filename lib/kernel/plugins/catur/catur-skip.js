// ───────── catur-skip ─────────
// data tersimpan di database game (database/rpg.json).

import { rpgCmd, caturRun } from '../../lib/rpg/bridge.js'
import { oneCommand } from '../../lib/engine/plugins.js'

const cmd = rpgCmd(["catur-skip"], (A) => caturRun(A, 'skip'), { tags: 'catur' })

// satu command = nama file
export default oneCommand(cmd, 'catur-skip')
