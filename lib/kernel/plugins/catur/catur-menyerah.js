// ───────── catur-menyerah ─────────
// data tersimpan di database game (database/rpg.json).

import { rpgCmd, caturRun } from '../../lib/rpg/bridge.js'
import { oneCommand } from '../../lib/engine/plugins.js'

const cmd = rpgCmd(["catur-menyerah"], (A) => caturRun(A, 'menyerah'), { tags: 'catur' })

// satu command = nama file
export default oneCommand(cmd, 'catur-menyerah')
