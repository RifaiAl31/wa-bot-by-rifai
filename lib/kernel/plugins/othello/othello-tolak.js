// ───────── othello-tolak ─────────
// Folder game baru. Mesin: lib/games/othello.js, data tersimpan di database game (database/rpg.json → arcade.othello).

import { cmd } from '../../lib/games/common.js'
import { othelloRun } from '../../lib/games/othello.js'

// satu command = nama file
export default cmd('othello', 'othello-tolak', (A) => othelloRun(A, 'tolak'), "Tolak/batalkan tantangan", { group: true })
