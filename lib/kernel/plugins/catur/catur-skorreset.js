// ───────── catur-skorreset ─────────
// data tersimpan di database game (database/rpg.json).

import { rpgCmd, caturRun } from '../../lib/rpg/bridge.js'
import { oneCommand } from '../../lib/engine/plugins.js'

const cmd = rpgCmd(["catur-skorreset"], (A) => caturRun(A, 'skorreset'), { tags: 'catur' })

// satu command = nama file
export default oneCommand(cmd, 'catur-skorreset')
