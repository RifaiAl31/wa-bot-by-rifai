// ───────── catur-analisa ─────────
// data tersimpan di database game (database/rpg.json).

import { rpgCmd, caturRun } from '../../lib/rpg/bridge.js'
import { oneCommand } from '../../lib/engine/plugins.js'

const cmd = rpgCmd(["catur-analisa"], (A) => caturRun(A, 'analisa'), { tags: 'catur' })

// satu command = nama file
export default oneCommand(cmd, 'catur-analisa')
