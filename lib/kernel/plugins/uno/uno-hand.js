// ───────── uno-hand ─────────
// data tersimpan di database game (database/rpg.json).

import { rpgCmd, unoRun } from '../../lib/rpg/bridge.js'
import { oneCommand } from '../../lib/engine/plugins.js'

const cmd = rpgCmd(["uno-hand"], (A) => unoRun(A, 'hand'), { tags: 'uno', group: true, desc: 'Kirim kartu milikmu ke chat pribadi' })

// satu command = nama file
export default oneCommand(cmd, 'uno-hand')
