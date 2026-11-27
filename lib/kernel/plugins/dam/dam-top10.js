// ───────── dam-top10 ─────────
// Folder game baru. Mesin: lib/games/dam.js, data tersimpan di database game (database/rpg.json → arcade.dam).

import { cmd } from '../../lib/games/common.js'
import { damRun } from '../../lib/games/dam.js'

// satu command = nama file
export default cmd('dam', 'dam-top10', (A) => damRun(A, 'top10'), "Top 10 pemain", { group: true })
