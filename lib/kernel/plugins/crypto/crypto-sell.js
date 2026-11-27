// ───────── crypto-sell ─────────
// data tersimpan di database game (database/rpg.json).

import { rpgCmd, cryptoRun } from '../../lib/rpg/bridge.js'
import { oneCommand } from '../../lib/engine/plugins.js'

const cmd = rpgCmd(["crypto-sell"], (A) => cryptoRun(A, 'sell'), { tags: 'crypto' })

// satu command = nama file
export default oneCommand(cmd, 'crypto-sell')
