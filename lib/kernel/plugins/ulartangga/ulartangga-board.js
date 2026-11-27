// ───────── ulartangga-board ─────────
// Folder game baru. Mesin: lib/games/ulartangga.js, data tersimpan di database game (database/rpg.json → arcade.ulartangga).

import { cmd } from '../../lib/games/common.js'
import { ulartanggaRun } from '../../lib/games/ulartangga.js'

// satu command = nama file
export default cmd('ulartangga', 'ulartangga-board', (A) => ulartanggaRun(A, 'board'), "Lihat papan", { group: true })
