import { need, pickTarget, assertCanPost, setCurrent, getCurrent, explain } from './setch.js'

let handler = async (m, { sock, text, prefix, reply }) => {
    const p = prefix || '.'
    try {
        const t = await pickTarget(sock, String(text || ''), p)
        assertCanPost(t)
        need(sock, 'newsletterUpdateName')
        if (!t.rest) return reply(`Isi nama baru.\nContoh: ${p}chname Info WhatsApp Bot`)
        if (t.rest.length > 100) return reply('Nama saluran maksimal 100 karakter.')
        await sock.newsletterUpdateName(t.id, t.rest)
        if (getCurrent()?.id === t.id) setCurrent({ ...getCurrent(), name: t.rest })
        return reply(`✅ Nama saluran diubah menjadi *${t.rest}*.`)
    } catch (err) {
        console.log('[CH] chname:', err.message)
        return reply(`❌ ${explain(err)}`)
    }
}

handler.command = ['chname']
handler.help = ['chname <nama>']
handler.tags = ['channel']
handler.owner = true

export default handler
