// ───────── esport-duel ─────────
// Folder game baru (dunia role-play permanen). Mesin: lib/games/world.js, konfigurasi: lib/games/themes/esport.js
// Data tersimpan di database game (database/rpg.json → arcade.esport); koin = koin RPG.

import { cmd } from '../../lib/games/common.js'
import { worldRun } from '../../lib/games/world.js'
import THEME from '../../lib/games/themes/esport.js'

// satu command = nama file
export default cmd('esport', 'esport-duel', (A) => worldRun(THEME, A, 'duel'), "Duel 1v1")
