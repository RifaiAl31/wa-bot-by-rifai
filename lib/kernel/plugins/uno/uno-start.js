// ───────── uno-start ─────────
// data tersimpan di database game (database/rpg.json).

import { rpgCmd, unoRun } from '../../lib/rpg/bridge.js'
import { oneCommand } from '../../lib/engine/plugins.js'

const cmd = rpgCmd(["uno-start"], (A) => unoRun(A, 'start'), { tags: 'uno', group: true, desc: 'Mulai permainan UNO (min. 2 pemain)' })

// satu command = nama file
export default oneCommand(cmd, 'uno-start')
