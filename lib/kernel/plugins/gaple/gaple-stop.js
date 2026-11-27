// ───────── gaple-stop ─────────
// data tersimpan di database game (database/rpg.json).

import { rpgCmd, gapleRun } from '../../lib/rpg/bridge.js'
import { oneCommand } from '../../lib/engine/plugins.js'

const cmd = rpgCmd(["gaple-stop"], (A) => gapleRun(A, 'stop'), { tags: 'gaple', group: true, desc: 'Hentikan permainan gaple' })

// satu command = nama file
export default oneCommand(cmd, 'gaple-stop')
