// ───────── gaple-info ─────────
// data tersimpan di database game (database/rpg.json).

import { rpgCmd, gapleRun } from '../../lib/rpg/bridge.js'
import { oneCommand } from '../../lib/engine/plugins.js'

const cmd = rpgCmd(["gaple-info"], (A) => gapleRun(A, 'info'), { tags: 'gaple', group: true, desc: 'Panduan bermain gaple' })

// satu command = nama file
export default oneCommand(cmd, 'gaple-info')
