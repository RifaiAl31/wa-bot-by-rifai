// ───────── uno-info ─────────
// data tersimpan di database game (database/rpg.json).

import { rpgCmd, unoRun } from '../../lib/rpg/bridge.js'
import { oneCommand } from '../../lib/engine/plugins.js'

const cmd = rpgCmd(["uno-info"], (A) => unoRun(A, 'info'), { tags: 'uno', group: true, desc: 'Panduan bermain UNO' })

// satu command = nama file
export default oneCommand(cmd, 'uno-info')
