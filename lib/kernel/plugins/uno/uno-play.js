// ───────── uno-play ─────────
// data tersimpan di database game (database/rpg.json).

import { rpgCmd, unoRun } from '../../lib/rpg/bridge.js'
import { oneCommand } from '../../lib/engine/plugins.js'

const cmd = rpgCmd(["uno-play"], (A) => unoRun(A, 'play'), { tags: 'uno', group: true, desc: 'Mainkan kartu: .uno-play <nomor>' })

// satu command = nama file
export default oneCommand(cmd, 'uno-play')
