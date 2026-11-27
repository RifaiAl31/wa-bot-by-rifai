// ───────── gaple-pass ─────────
// data tersimpan di database game (database/rpg.json).

import { rpgCmd, gapleRun } from '../../lib/rpg/bridge.js'
import { oneCommand } from '../../lib/engine/plugins.js'

const cmd = rpgCmd(["gaple-pass"], (A) => gapleRun(A, 'pass'), { tags: 'gaple', group: true, desc: 'Lewati giliran jika tidak bisa jalan' })

// satu command = nama file
export default oneCommand(cmd, 'gaple-pass')
