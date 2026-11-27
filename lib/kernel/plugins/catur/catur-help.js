// ───────── catur-help ─────────
// data tersimpan di database game (database/rpg.json).

import { rpgCmd, caturRun } from '../../lib/rpg/bridge.js'
import { oneCommand } from '../../lib/engine/plugins.js'

const cmd = rpgCmd(["catur-help"], (A) => caturRun(A, 'help'), { tags: 'catur' })

// satu command = nama file
export default oneCommand(cmd, 'catur-help')
