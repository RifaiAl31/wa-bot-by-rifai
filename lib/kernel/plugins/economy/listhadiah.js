// ───────── listhadiah ─────────
// Dipecah dari plugins/economy/hadiah.js (dulu digabung dengan fitur lain dalam satu file)
// Code hadiah (redeem) untuk limit:
//   .buathadiah <jumlah>  owner membuat code acak
//   .listhadiah           owner melihat code yang belum dipakai
//   .redeemcode <code>    user menukar code jadi 10-20 limit
// Data tersimpan di pengaturan RPG bot (settings.hadiah & settings.hadiahkadaluwarsa).

import { rpgCmd } from '../../lib/rpg/bridge.js'
import { oneCommand } from '../../lib/engine/plugins.js'

function codes(A) {
    const settings = A.botStore().settings
    if (!Array.isArray(settings.hadiah)) settings.hadiah = []
    if (!Array.isArray(settings.hadiahkadaluwarsa)) settings.hadiahkadaluwarsa = []
    return settings
}

const listhadiah = rpgCmd(['listhadiah'], async (A) => {
    const { reply } = A
    const { hadiah } = codes(A)
    if (hadiah.length < 1) return reply('Tidak ada code hadiah')

    let tek = `*乂 LIST CODE HADIAH*\n\nTotal : *${hadiah.length}*\n\n`
    for (const e of hadiah) tek += ` ◦ ${e}\n`
    return reply(tek)
}, { tags: 'economy', desc: 'Lihat daftar code hadiah (owner)', owner: true })

// satu command = nama file
export default oneCommand(listhadiah, 'listhadiah')
