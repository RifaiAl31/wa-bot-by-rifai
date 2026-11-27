// ───────── uno-join ─────────
// data tersimpan di database game (database/rpg.json).

import { rpgCmd, unoRun } from '../../lib/rpg/bridge.js'
import { oneCommand } from '../../lib/engine/plugins.js'

const cmd = rpgCmd(["uno-join"], (A) => unoRun(A, 'join'), { tags: 'uno', group: true, desc: 'Ikut permainan UNO' })

// satu command = nama file
export default oneCommand(cmd, 'uno-join')
