import { getMeta } from '../../lib/platform/wa.js'
import { jpmCfg, jpmJobs, jpmLoop, memberJids } from '../../lib/group/sosial.js'

const randomKode = (n = 6) => Array.from({ length: n }, () => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'[Math.floor(Math.random() * 36)]).join('')

// .pushkontak2 pesan|namakontak  → kirim pesan (+ kode unik) dan kartu kontak ke semua member grup
let handler = async (m, { sock, jid, text, reply, example }) => {
    const [pesan, nama] = String(text || '').split('|').map(s => s.trim())
    if (!pesan || !nama) return example('Halo semuanya!|TokoBaru   (format: pesan|namakontak)')

    const jobs = jpmJobs()
    if (jobs.pushRunning) return reply('❌ Push kontak sedang berjalan. Ketik *stoppush* untuk menghentikan.')

    const members = (await memberJids(sock, await getMeta(sock, jid, true))).filter(id => id !== m.sender)
    if (!members.length) return reply('❌ Tidak ada member yang bisa dituju di grup ini.')

    const delay = jpmCfg().delayPushKontak
    jobs.pushRunning = true
    await reply(`*▢ PUSH KONTAK 2*\n• Target : ${members.length} member\n• Nama kontak : ${nama}\n• Delay : ${delay}ms\n\nHentikan dengan *stoppush*`)

    let res
    try {
        res = await jpmLoop(members, delay, async to => {
            const nomor = to.split('@')[0]
            await sock.sendMessage(to, { text: `${pesan}\n\n#${randomKode()}` })
            await sock.sendMessage(to, {
                contacts: {
                    displayName: nama,
                    contacts: [{ displayName: nama, vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:${nama} - ${nomor}\nTEL;type=CELL;type=VOICE;waid=${nomor}:+${nomor}\nEND:VCARD` }]
                }
            })
        }, () => !jobs.pushRunning)
    } finally {
        jobs.pushRunning = false
    }
    return reply(`*▢ PUSH KONTAK 2 SELESAI*\n• Berhasil : ${res.ok} member\n• Gagal : ${res.fail} member`)
}

handler.command = ['pushkontak2', 'puskontak2', 'push2']
handler.tags = ['pushkontak']
handler.owner = true
handler.group = true

export default handler
