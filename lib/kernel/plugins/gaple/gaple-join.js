// ───────── gaple-join ─────────
// data tersimpan di database game (database/rpg.json).

import { rpgCmd, gapleRun } from '../../lib/rpg/bridge.js'
import { oneCommand } from '../../lib/engine/plugins.js'

const cmd = rpgCmd(["gaple-join"], (A) => gapleRun(A, 'join'), { tags: 'gaple', group: true, desc: 'Ikut permainan gaple' })

// satu command = nama file
export default oneCommand(cmd, 'gaple-join')
