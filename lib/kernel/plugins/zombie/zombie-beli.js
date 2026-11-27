// ───────── zombie-beli ─────────
// Folder game baru (dunia role-play permanen). Mesin: lib/games/world.js, konfigurasi: lib/games/themes/zombie.js
// Data tersimpan di database game (database/rpg.json → arcade.zombie); koin = koin RPG.

import { cmd } from '../../lib/games/common.js'
import { worldRun } from '../../lib/games/world.js'
import THEME from '../../lib/games/themes/zombie.js'

// satu command = nama file
export default cmd('zombie', 'zombie-beli', (A) => worldRun(THEME, A, 'beli'), "Toko perlengkapan")
