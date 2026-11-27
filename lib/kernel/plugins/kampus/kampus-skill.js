// ───────── kampus-skill ─────────
// Folder game baru (dunia role-play permanen). Mesin: lib/games/world.js, konfigurasi: lib/games/themes/kampus.js
// Data tersimpan di database game (database/rpg.json → arcade.kampus); koin = koin RPG.

import { cmd } from '../../lib/games/common.js'
import { worldRun } from '../../lib/games/world.js'
import THEME from '../../lib/games/themes/kampus.js'

// satu command = nama file
export default cmd('kampus', 'kampus-skill', (A) => worldRun(THEME, A, 'skill'), "Lihat/upgrade skill")
