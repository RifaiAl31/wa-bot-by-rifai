// ───────── bajaklaut-daily ─────────
// Folder game baru (dunia role-play permanen). Mesin: lib/games/world.js, konfigurasi: lib/games/themes/bajaklaut.js
// Data tersimpan di database game (database/rpg.json → arcade.bajaklaut); koin = koin RPG.

import { cmd } from '../../lib/games/common.js'
import { worldRun } from '../../lib/games/world.js'
import THEME from '../../lib/games/themes/bajaklaut.js'

// satu command = nama file
export default cmd('bajaklaut', 'bajaklaut-daily', (A) => worldRun(THEME, A, 'daily'), "Bonus harian")
