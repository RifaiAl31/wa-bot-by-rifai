// ───────── ludo-roll ─────────
// Folder game baru. Mesin: lib/games/ludo.js, data tersimpan di database game (database/rpg.json → arcade.ludo).

import { cmd } from '../../lib/games/common.js'
import { ludoRun } from '../../lib/games/ludo.js'

// satu command = nama file
export default cmd('ludo', 'ludo-roll', (A) => ludoRun(A, 'roll'), "Kocok dadu", { group: true })
