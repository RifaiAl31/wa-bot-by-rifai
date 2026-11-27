// .setvercel <token> [teamId]  -> simpan token Vercel milikmu sendiri (chat pribadi)
// .setvercel                   -> lihat status      .setvercel hapus -> hapus token milikmu
// .setvercel global <token> [teamId] -> (owner) ubah token bawaan di config.js
import { updateConfigBlock } from '../../lib/core/file.js'
import { getOwn, setOwn, delOwn, resolve, mask, secretGuard, wipeMessage } from '../../lib/core/usercreds.js'

let handler = async (m, { sock, text, prefix, command, reply, sender, isOwner }) => {
    const args = String(text || '').trim().split(/\s+/).filter(Boolean)
    const cmd = `${prefix}${command}`

    if (!args.length) {
        const own = getOwn(sender, 'vercel')
        const now = resolve('vercel')
        const sumber = now.source === 'user' ? 'token milikmu' : now.source === 'config' ? 'bawaan bot (config.js)' : 'belum ada'
        return reply(
            `▲ *VERCEL TOKEN*\n\n` +
            `• Token kamu : \`${own ? mask(own.token) : 'belum diset'}\`\n` +
            `• Team ID    : ${own?.teamId || '-'}\n` +
            `• Yang dipakai : ${sumber}\n\n` +
            `Simpan: *${cmd} <token> [teamId]*\nHapus : *${cmd} hapus*\n` +
            `_Lakukan di chat pribadi. Teamid hanya diisi kalau deploy ke Team._`
        )
    }

    if (/^(hapus|delete|del|reset)$/i.test(args[0])) {
        return reply(delOwn(sender, 'vercel') ? '🗑️ Token Vercel milikmu dihapus.' : 'Kamu belum menyimpan token Vercel.')
    }

    if (/^(global|config)$/i.test(args[0])) {
        if (!isOwner) return reply(global.mess?.owner || 'Khusus owner.')
        if (!args[1]) return reply(`Contoh: *${cmd} global <token> [teamId]*`)
        if (!(await secretGuard(sock, m, reply, prefix))) return
        global.vercel = { ...(global.vercel || {}), token: args[1], teamId: args[2] || '' }
        const saved = updateConfigBlock('vercel', { token: args[1], teamId: args[2] || '' })
        await wipeMessage(sock, m)
        return reply(saved ? '✅ Token Vercel bawaan (config.js) diperbarui.' : '✅ Token bawaan aktif di memory, tetapi gagal menyimpan ke config.js.')
    }

    if (!(await secretGuard(sock, m, reply, prefix))) return
    const [token, teamId] = args
    if (token.length < 20 || !/^[\w-]+$/.test(token)) return reply('Token tidak terlihat valid. Buat token di vercel.com/account/tokens')
    const st = setOwn(sender, 'vercel', { token, teamId: teamId || '' })
    await wipeMessage(sock, m)
    return reply(`✅ *Token Vercel ${st === 'diganti' ? 'diganti dengan yang baru' : 'tersimpan'}* dan dipakai untuk akunmu saja. Tidak perlu set ulang lagi.

Coba: ${prefix}vercel listvercel
_Pesan berisi token sudah coba dihapus; kalau masih ada, hapus manual._`)
}

handler.command = ['setvercel']
handler.help = ['setvercel <token> [teamId]']
handler.tags = ['vercel']

export default handler
