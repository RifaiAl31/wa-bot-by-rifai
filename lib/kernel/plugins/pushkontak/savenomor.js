// .savenomor <nama>           → (chat pribadi) simpan nomor lawan chat ke kontak bot
// .savenomor <nama>           → (grup, reply pesan target)
// .savenomor @tag|<nama>      → (grup)
// .savenomor 628xxx|<nama>    → (grup)
let handler = async (m, { sock, text, reply, example }) => {
    const input = String(text || '').trim()
    let target = ''
    let nama = ''

    if (m.isGroup) {
        if (m.quoted?.sender) {
            target = m.quoted.sender
            nama = input
        } else if (m.mentionedJid?.length) {
            target = m.mentionedJid[0]
            nama = input.includes('|') ? input.split('|').slice(1).join('|').trim() : input.replace(/@\d+/g, '').trim()
        } else if (input.includes('|')) {
            const [num, ...rest] = input.split('|')
            const digits = num.replace(/\D/g, '')
            if (digits) target = `${digits}@s.whatsapp.net`
            nama = rest.join('|').trim()
        } else {
            return example('nama  (reply pesan target)\n   atau  @tag|nama\n   atau  628xxx|nama')
        }
    } else {
        target = m.chat
        nama = input
    }

    if (!nama) return reply('❌ Masukkan nama kontak.')
    if (!target) return reply('❌ Tidak dapat menentukan nomor target.')

    const nomor = String(target).split('@')[0].split(':')[0]

    // Baileys yang mendukung addOrEditContact menyimpan langsung ke buku kontak akun bot.
    if (typeof sock.addOrEditContact === 'function') {
        await sock.addOrEditContact(target, { fullName: nama, lidJid: target, saveOnPrimaryAddressbook: true })
        return reply(`*▢ KONTAK DISIMPAN*\n• Nomor : ${nomor}\n• Nama : ${nama}`)
    }

    // Fallback: kirim kartu kontak supaya bisa disimpan manual.
    await sock.sendMessage(m.chat, {
        contacts: {
            displayName: nama,
            contacts: [{ displayName: nama, vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:${nama}\nTEL;type=CELL;type=VOICE;waid=${nomor}:+${nomor}\nEND:VCARD` }]
        }
    }, { quoted: m })
    return reply('ℹ️ Versi Baileys ini belum mendukung simpan kontak langsung, jadi kartu kontak dikirim sebagai gantinya.')
}

handler.command = ['savenomor', 'sv', 'save', 'simpannomor']
handler.tags = ['pushkontak']
handler.owner = true

export default handler
