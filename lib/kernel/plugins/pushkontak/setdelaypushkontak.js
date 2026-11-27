import { jpmSetCfg } from '../../lib/group/sosial.js'

let handler = async (m, { text, reply, example }) => {
    const ms = parseInt(text)
    if (isNaN(ms) || ms < 500) return example('<ms>  (minimal 500, contoh: 2000)')
    jpmSetCfg('delayPushKontak', ms)
    return reply(`*▢ DELAY PUSH KONTAK*\n• Delay : ${ms}ms\n• Status : Berhasil diubah`)
}

handler.command = ['setdelaypushkontak']
handler.tags = ['pushkontak']
handler.owner = true

export default handler
