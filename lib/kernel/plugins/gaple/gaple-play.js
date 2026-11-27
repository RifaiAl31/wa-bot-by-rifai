// ───────── gaple-play ─────────
// data tersimpan di database game (database/rpg.json).

import { rpgCmd, gapleRun } from '../../lib/rpg/bridge.js'
import { oneCommand } from '../../lib/engine/plugins.js'

const cmd = rpgCmd(["gaple-play"], (A) => gapleRun(A, 'play'), { tags: 'gaple', group: true, desc: 'Mainkan kartu: .gaple-play <nomor> <left/right>' })

// satu command = nama file
export default oneCommand(cmd, 'gaple-play')
