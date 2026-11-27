// ───────── ninja-skill ─────────
// Folder game baru (dunia role-play permanen). Mesin: lib/games/world.js, konfigurasi: lib/games/themes/ninja.js
// Data tersimpan di database game (database/rpg.json → arcade.ninja); koin = koin RPG.

import { cmd } from '../../lib/games/common.js'
import { worldRun } from '../../lib/games/world.js'
import THEME from '../../lib/games/themes/ninja.js'

// satu command = nama file
export default cmd('ninja', 'ninja-skill', (A) => worldRun(THEME, A, 'skill'), "Lihat/upgrade skill")
