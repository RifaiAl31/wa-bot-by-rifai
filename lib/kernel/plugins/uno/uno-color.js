// ───────── uno-color ─────────
// data tersimpan di database game (database/rpg.json).

import { rpgCmd, unoRun } from '../../lib/rpg/bridge.js'
import { oneCommand } from '../../lib/engine/plugins.js'

const cmd = rpgCmd(["uno-color"], (A) => unoRun(A, 'color'), { tags: 'uno', group: true, desc: 'Pilih warna setelah wild: .uno-color <red|yellow|green|blue>' })

// satu command = nama file
export default oneCommand(cmd, 'uno-color')
