// ───────── mafiakota-top ─────────
// Folder game baru (dunia role-play permanen). Mesin: lib/games/world.js, konfigurasi: lib/games/themes/mafiakota.js
// Data tersimpan di database game (database/rpg.json → arcade.mafiakota); koin = koin RPG.

import { cmd } from '../../lib/games/common.js'
import { worldRun } from '../../lib/games/world.js'
import THEME from '../../lib/games/themes/mafiakota.js'

// satu command = nama file
export default cmd('mafiakota', 'mafiakota-top', (A) => worldRun(THEME, A, 'top'), "Ranking pemain")
