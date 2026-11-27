// ───────── ludo ─────────
// Folder game baru. Mesin: lib/games/ludo.js, data tersimpan di database game (database/rpg.json → arcade.ludo).

import { cmd } from '../../lib/games/common.js'
import { ludoRun } from '../../lib/games/ludo.js'

// satu command = nama file
export default cmd('ludo', 'ludo', (A) => ludoRun(A, 'create'), "Buat permainan Ludo", { group: true })
