const META_AI = '867051314767696@bot'

let handler = async (m, { sock, jid, command, isBotAdmin }) => {
    const add = command === 'addai'

    if (!add && !isBotAdmin) return m.reply(global.mess.botAdmin)

    try {
        await sock.groupParticipantsUpdate(jid, [META_AI], add ? 'add' : 'remove')
        await m.reply(add ? 'Sukses add Meta AI ke grup.' : 'Sukses mengeluarkan Meta AI dari grup.')
    } catch (e) {
        console.error(e)
        const msg = String(e?.message || e)
        if (/not-authorized|forbidden|403/i.test(msg)) {
            return m.reply(add
                ? 'Gagal: bot tidak punya izin menambah anggota. Jadikan bot admin dulu, atau aktifkan izin "semua anggota boleh tambah anggota" di pengaturan grup.'
                : global.mess.botAdmin)
        }
        await m.reply(`Gagal ${add ? 'add' : 'mengeluarkan'} Meta AI: ${msg}`)
    }
}

handler.command = ['addai', 'delai']
handler.tags = ['ai']
handler.group = true
handler.admin = true

export default handler
