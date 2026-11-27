import { saveDB } from '../../lib/core/system.js'
import { storeReply, quick, sendBtn } from '../../lib/store/merchant.js'
import { sewaData } from '../../lib/core/data.js'
import { toPN } from '../../lib/engine/plugins.js'
import { waError } from '../../lib/platform/wa.js'
import { expireOrders } from '../../lib/store/sewa.js'

// ===== .batalsewa =====
let handler = async (m, { sock, text, command, prefix, jid, isOwner, reply: baseReply }) => {
    const reply = storeReply(sock, m, baseReply)
    const p = prefix || '.'
    const body = String(text || '').trim()
    const d = sewaData()
    expireOrders()


    try {
        const buyer = await toPN(sock, m.sender)
        const order = Object.values(d.orders).find(o => o.buyer === buyer && o.status === 'pending')
        if (!order) {
            const waiting = Object.values(d.orders).find(o => o.buyer === buyer && o.status === 'waiting')
            return reply(waiting ? `Order ${waiting.id} sudah kamu kirimi bukti bayar, hubungi owner kalau mau membatalkan.` : 'Tidak ada order sewa yang bisa dibatalkan.')
        }
        order.status = 'cancelled'
        saveDB(global.kdb)
        return sendBtn(sock, m.chat, { text: `🚫 Order ${order.id} dibatalkan.${order.gw ? '\nJangan bayar QR yang sudah dikirim ya.' : ''}`, buttons: [quick('Sewa Lagi', `${p}sewa`)] }, m)
    } catch (e) {
        return reply(`[ ! ] ${waError(e)}`)
    }
}

handler.command = ['batalsewa']
handler.tags = ['sewa-bot']
handler.help = ['batalsewa']

export default handler
