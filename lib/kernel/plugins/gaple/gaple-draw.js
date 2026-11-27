// ───────── gaple-draw ─────────
// data tersimpan di database game (database/rpg.json).

import { rpgCmd, gapleRun } from '../../lib/rpg/bridge.js'
import { oneCommand } from '../../lib/engine/plugins.js'

const cmd = rpgCmd(["gaple-draw"], (A) => gapleRun(A, 'draw'), { tags: 'gaple', group: true, desc: 'Ambil kartu dari deck jika buntu' })

// satu command = nama file
export default oneCommand(cmd, 'gaple-draw')
