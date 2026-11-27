// ───────── othello-hint ─────────
// Folder game baru. Mesin: lib/games/othello.js, data tersimpan di database game (database/rpg.json → arcade.othello).

import { cmd } from '../../lib/games/common.js'
import { othelloRun } from '../../lib/games/othello.js'

// satu command = nama file
export default cmd('othello', 'othello-hint', (A) => othelloRun(A, 'hint'), "Petunjuk langkah legal", { group: true })
