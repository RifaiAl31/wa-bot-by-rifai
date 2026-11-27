// ───────── gaple ─────────
// data tersimpan di database game (database/rpg.json).
// `.gaple` membuat permainan di grup; `.gaple join` dst. tetap jalan, versi pisahnya `.gaple-join` dst.

import { rpgCmd, gapleRun } from '../../lib/rpg/bridge.js'
import { oneCommand } from '../../lib/engine/plugins.js'

const SUBS = ['join', 'start', 'info', 'hand', 'play', 'draw', 'pass', 'stop']

const cmd = rpgCmd(["gaple"], (A) => {
    const first = String(A.args[0] || '').toLowerCase()
    if (SUBS.includes(first)) { A.args.shift(); A.text = A.args.join(' '); return gapleRun(A, first) }
    return gapleRun(A, 'create')
}, { tags: 'gaple', group: true, desc: 'Buat permainan gaple (domino) di grup' })

// satu command = nama file
export default oneCommand(cmd, 'gaple')
