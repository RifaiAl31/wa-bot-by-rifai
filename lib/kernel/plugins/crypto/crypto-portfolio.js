// ───────── crypto-portfolio ─────────
// data tersimpan di database game (database/rpg.json).

import { rpgCmd, cryptoRun } from '../../lib/rpg/bridge.js'
import { oneCommand } from '../../lib/engine/plugins.js'

const cmd = rpgCmd(["crypto-portfolio"], (A) => cryptoRun(A, 'portfolio'), { tags: 'crypto' })

// satu command = nama file
export default oneCommand(cmd, 'crypto-portfolio')
