import { getStats, resetStats } from '../../lib/core/data.js'
import { formatWib } from '../../lib/core/system.js'

const MEDAL = ['🥇', '🥈', '🥉']

let handler = async (m, { text, isOwner, reply }) => {
    if (/^reset$/i.test(String(text).trim())) {
        if (!isOwner) return reply(global.mess.owner)
        resetStats()
        return reply('✅ Statistik command di-reset.')
    }

    const s = getStats()
    if (!s.total) return reply('Belum ada command yang tercatat.')

    const cmds = s.commands.slice(0, 10).map(([k, n], i) => `${MEDAL[i] || `${i + 1}.`} ${k} — ${n}x`).join('\n')
    const users = s.users.slice(0, 5).map(([k, n], i) => `${MEDAL[i] || `${i + 1}.`} ${k} — ${n} command`).join('\n')
    return reply(
        `*▢ STATISTIK BOT*\n\n` +
        `Total command : ${s.total.toLocaleString('id-ID')}\n` +
        `Hari ini      : ${s.today.toLocaleString('id-ID')}\n` +
        `Dihitung sejak ${formatWib(s.since)}\n\n` +
        `*Command terpopuler*\n${cmds}\n\n*User paling aktif*\n${users}`
    )
}

handler.command = ['topcmd']
handler.help = ['topcmd']
handler.tags = ['main']

export default handler
