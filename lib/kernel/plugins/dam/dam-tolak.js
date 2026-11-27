// ───────── dam-tolak ─────────
// Folder game baru. Mesin: lib/games/dam.js, data tersimpan di database game (database/rpg.json → arcade.dam).

import { cmd } from '../../lib/games/common.js'
import { damRun } from '../../lib/games/dam.js'

// satu command = nama file
export default cmd('dam', 'dam-tolak', (A) => damRun(A, 'tolak'), "Tolak/batalkan tantangan", { group: true })
