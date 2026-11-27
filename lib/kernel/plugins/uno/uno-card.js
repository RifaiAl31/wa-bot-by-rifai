// ───────── uno-card ─────────
// data tersimpan di database game (database/rpg.json).

import { rpgCmd, unoRun } from '../../lib/rpg/bridge.js'
import { oneCommand } from '../../lib/engine/plugins.js'

const cmd = rpgCmd(["uno-card"], (A) => unoRun(A, 'card'), { tags: 'uno', group: true, desc: 'Lihat gambar kartu: .uno-card <nomor>' })

// satu command = nama file
export default oneCommand(cmd, 'uno-card')
