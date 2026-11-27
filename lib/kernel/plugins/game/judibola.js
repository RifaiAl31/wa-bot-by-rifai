// ───────── judibola ─────────
// data room tersimpan di database game (database/rpg.json). Pakai: .judibola create | join | player | mulai | vote 1/2 | delete

import { rpgCmd, judiBolaRun } from '../../lib/rpg/bridge.js'
import { oneCommand } from '../../lib/engine/plugins.js'

const cmd = rpgCmd(["judibola"], (A) => judiBolaRun(A), { tags: 'game', group: true, desc: 'Judi bola: tebak klub pemenang, taruhan 10 limit' })

// satu command = nama file
export default oneCommand(cmd, 'judibola')
