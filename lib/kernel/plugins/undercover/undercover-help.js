// ───────── undercover-help ─────────
// Folder game baru. Mesin: lib/games/undercover.js, data tersimpan di database game (database/rpg.json → arcade.undercover).

import { cmd } from '../../lib/games/common.js'
import { undercoverRun } from '../../lib/games/undercover.js'

// satu command = nama file
export default cmd('undercover', 'undercover-help', (A) => undercoverRun(A, 'help'), "Aturan", { group: true })
