import { getMeta } from '../../lib/platform/wa.js'
import { memberJids, sendVcf } from '../../lib/group/sosial.js'

// .savekontak <nama>  → simpan semua member grup ke file VCF, dikirim ke chat pribadi owner.
let handler = async (m, { sock, jid, text, reply, example }) => {
    const nama = String(text || '').trim()
    if (!nama) return example('CustomerList  (nama dasar kontak, hasilnya "CustomerList - 1", "CustomerList - 2", ...)')

    const meta = await getMeta(sock, jid, true)
    const members = await memberJids(sock, meta)
    if (!members.length) return reply('❌ Tidak ada kontak yang bisa disimpan di grup ini.')

    await sendVcf(sock, m.sender, members, {
        fileName: `${nama}_${members.length}kontak`,
        nameOf: (_, i) => `${nama} - ${i + 1}`,
        caption: `*▢ KONTAK DISIMPAN*\n• Nama : ${nama}\n• Total : ${members.length} kontak\n• Grup : ${meta.subject || '-'}`
    })

    return reply(`*▢ SAVE KONTAK*\n• Total : ${members.length} kontak\n• Status : File VCF dikirim ke chat pribadi`)
}

handler.command = ['savekontak', 'svkontak', 'savecontact']
handler.tags = ['pushkontak']
handler.owner = true
handler.group = true

export default handler
