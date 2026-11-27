import { getMeta } from '../../lib/platform/wa.js'
import { jpmCfg, jpmJobs, jpmLoop, getMedia, mediaContent, memberJids, pushKode, sendVcf } from '../../lib/group/sosial.js'

// Kirim pesan pribadi ke semua member grup tempat perintah dipakai (akun bot dilewati).
// Tiap pesan diberi kode unik di akhir, dan kontak yang berhasil dikirimi otomatis
// disimpan ke file VCF yang dikirim ke chat owner setelah selesai / dihentikan.
let handler = async (m, { sock, jid, text, reply, example }) => {
    const media = await getMedia(m)
    if (!text && !media) return example('pesan yang ingin di-push ke member  (atau reply foto/video + caption)')

    const jobs = jpmJobs()
    if (jobs.pushRunning) return reply('❌ Push kontak sedang berjalan. Ketik *stoppush* untuk menghentikan.')

    const meta = await getMeta(sock, jid, true)
    const members = await memberJids(sock, meta)
    if (!members.length) return reply('❌ Tidak ada member yang bisa dituju di grup ini.')

    const delay = jpmCfg().delayPushKontak
    jobs.pushRunning = true
    await reply(`*▢ PUSH KONTAK*\n• Target : ${members.length} member\n• Delay : ${delay}ms\n• Auto-save : VCF\n\nHentikan dengan *stoppush*`)

    const saved = []
    let result
    try {
        result = await jpmLoop(members, delay, async to => {
            const caption = `${text || ''}\n\n#${pushKode()}`.trim()
            await sock.sendMessage(to, media ? mediaContent(media, caption) : { text: caption })
            saved.push(to)
        }, () => !jobs.pushRunning)
    } finally {
        jobs.pushRunning = false
    }

    if (saved.length) {
        const nama = String(meta.subject || 'Grup').replace(/\s+/g, '_')
        await sendVcf(sock, m.sender, saved, {
            fileName: `Kontak_${nama}_${saved.length}`,
            caption: `*▢ AUTO-SAVE KONTAK*\n• Total : ${saved.length} kontak\n• Grup : ${meta.subject || '-'}\n\nImport file ini ke HP untuk menyimpan semua kontak.`
        }).catch(e => console.error('[PUSHKONTAK] gagal kirim VCF:', e?.message || e))
    }

    return reply(`*▢ PUSH KONTAK SELESAI*\n• Berhasil : ${result.ok} member\n• Gagal : ${result.fail} member\n• Tersimpan : ${saved.length} kontak (VCF)`)
}

handler.command = ['pushkontak', 'puskontak']
handler.tags = ['pushkontak']
handler.owner = true
handler.group = true

export default handler
