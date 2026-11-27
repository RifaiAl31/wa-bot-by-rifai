// ───────── ceme-stand ─────────
// Folder game baru. Mesin: lib/games/ceme.js, data tersimpan di database game (database/rpg.json → arcade.ceme).

import { cmd } from '../../lib/games/common.js'
import { cemeRun } from '../../lib/games/ceme.js'

// satu command = nama file
export default cmd('ceme', 'ceme-stand', (A) => cemeRun(A, 'stand'), "Cukup", { group: true })
