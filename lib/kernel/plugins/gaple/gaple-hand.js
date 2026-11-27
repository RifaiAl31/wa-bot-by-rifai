// ───────── gaple-hand ─────────
// data tersimpan di database game (database/rpg.json).

import { rpgCmd, gapleRun } from '../../lib/rpg/bridge.js'
import { oneCommand } from '../../lib/engine/plugins.js'

const cmd = rpgCmd(["gaple-hand"], (A) => gapleRun(A, 'hand'), { tags: 'gaple', group: true, desc: 'Kirim kartu milikmu ke chat pribadi' })

// satu command = nama file
export default oneCommand(cmd, 'gaple-hand')
