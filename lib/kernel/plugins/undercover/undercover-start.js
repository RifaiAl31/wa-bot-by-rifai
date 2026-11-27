// ───────── undercover-start ─────────
// Folder game baru. Mesin: lib/games/undercover.js, data tersimpan di database game (database/rpg.json → arcade.undercover).

import { cmd } from '../../lib/games/common.js'
import { undercoverRun } from '../../lib/games/undercover.js'

// satu command = nama file
export default cmd('undercover', 'undercover-start', (A) => undercoverRun(A, 'start'), "Mulai", { group: true })
