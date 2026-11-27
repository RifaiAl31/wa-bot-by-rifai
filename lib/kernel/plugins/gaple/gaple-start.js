// ───────── gaple-start ─────────
// data tersimpan di database game (database/rpg.json).

import { rpgCmd, gapleRun } from '../../lib/rpg/bridge.js'
import { oneCommand } from '../../lib/engine/plugins.js'

const cmd = rpgCmd(["gaple-start"], (A) => gapleRun(A, 'start'), { tags: 'gaple', group: true, desc: 'Mulai permainan gaple (min. 2 pemain)' })

// satu command = nama file
export default oneCommand(cmd, 'gaple-start')
