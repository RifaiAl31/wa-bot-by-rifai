// ───────── monopoli-beli ─────────
// Folder game baru. Mesin: lib/games/monopoli.js, data tersimpan di database game (database/rpg.json → arcade.monopoli).

import { cmd } from '../../lib/games/common.js'
import { monopoliRun } from '../../lib/games/monopoli.js'

// satu command = nama file
export default cmd('monopoli', 'monopoli-beli', (A) => monopoliRun(A, 'beli'), "Beli petak", { group: true })
