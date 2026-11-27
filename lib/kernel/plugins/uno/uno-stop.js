// ───────── uno-stop ─────────
// data tersimpan di database game (database/rpg.json).

import { rpgCmd, unoRun } from '../../lib/rpg/bridge.js'
import { oneCommand } from '../../lib/engine/plugins.js'

const cmd = rpgCmd(["uno-stop"], (A) => unoRun(A, 'stop'), { tags: 'uno', group: true, desc: 'Hentikan permainan UNO' })

// satu command = nama file
export default oneCommand(cmd, 'uno-stop')
