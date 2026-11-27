// ───────── uno-pass ─────────
// data tersimpan di database game (database/rpg.json).

import { rpgCmd, unoRun } from '../../lib/rpg/bridge.js'
import { oneCommand } from '../../lib/engine/plugins.js'

const cmd = rpgCmd(["uno-pass"], (A) => unoRun(A, 'pass'), { tags: 'uno', group: true, desc: 'Lewati giliran' })

// satu command = nama file
export default oneCommand(cmd, 'uno-pass')
