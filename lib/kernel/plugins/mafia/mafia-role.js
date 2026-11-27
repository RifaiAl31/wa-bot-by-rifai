// ───────── mafia-role ─────────
// Folder game baru. Mesin: lib/games/mafia.js, data tersimpan di database game (database/rpg.json → arcade.mafia).

import { cmd } from '../../lib/games/common.js'
import { mafiaRun } from '../../lib/games/mafia.js'

// satu command = nama file
export default cmd('mafia', 'mafia-role', (A) => mafiaRun(A, 'role'), "Ingat perananmu (chat pribadi)", { group: false })
