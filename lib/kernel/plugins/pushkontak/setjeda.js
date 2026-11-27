import { jpmCfg, jpmSetCfg } from '../../lib/group/sosial.js'

// .setjeda push <ms> / .setjeda jpm <ms>  → atur delay pushkontak atau jpm (1000 - 60000 ms)
let handler = async (m, { text, prefix, reply }) => {
    const [target, raw] = String(text || '').trim().split(/\s+/)
    const cfg = jpmCfg()

    if (!target || !raw) {
        return reply(
            `*▢ SET JEDA*\n` +
            `• Jeda push : ${cfg.delayPushKontak}ms\n` +
            `• Jeda jpm : ${cfg.delayJpm}ms\n\n` +
            `Contoh:\n${prefix}setjeda push 5000\n${prefix}setjeda jpm 6000\n\n1 detik = 1000ms`
        )
    }

    const key = { push: 'delayPushKontak', jpm: 'delayJpm' }[target.toLowerCase()]
    if (!key) return reply('❌ Pilihan: *push* atau *jpm*')

    const ms = parseInt(raw)
    if (isNaN(ms) || ms < 1000) return reply('❌ Masukkan angka minimal 1000 (1 detik).')
    if (ms > 60000) return reply('❌ Maksimal 60000 (1 menit).')

    jpmSetCfg(key, ms)
    return reply(`*▢ JEDA ${target.toUpperCase()} DIUBAH*\n• Jeda : ${ms}ms (${ms / 1000} detik)`)
}

handler.command = ['setjeda', 'setdelay', 'jeda']
handler.tags = ['pushkontak']
handler.owner = true

export default handler
