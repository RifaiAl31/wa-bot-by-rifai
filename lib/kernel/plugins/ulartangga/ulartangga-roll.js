// ───────── ulartangga-roll ─────────
// Folder game baru. Mesin: lib/games/ulartangga.js, data tersimpan di database game (database/rpg.json → arcade.ulartangga).

import { cmd } from '../../lib/games/common.js'
import { ulartanggaRun } from '../../lib/games/ulartangga.js'

// satu command = nama file
export default cmd('ulartangga', 'ulartangga-roll', (A) => ulartanggaRun(A, 'roll'), "Kocok dadu", { group: true })
