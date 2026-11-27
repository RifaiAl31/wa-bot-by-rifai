// ───────── pkstatus: status order + detail akun (owner) ─────────
import { adapt } from '../../lib/engine/plugins.js'
import { premku as pk } from '../../lib/services/scraper.js'

let handler = async (m, { conn, text, usedPrefix: p, isOwner }) => {
  if (!isOwner) return m.reply('⛔ Fitur ini khusus owner.')
  const ui = pk.ui(m, conn, p)
  const invoice = String(text || '').trim().split(/\s+/)[0]

  return pk.guard(m, ui, async () => {
    if (!invoice) return ui.sendBtn('Pilih invoice dari riwayat dulu.', [pk.quick('🧾 Riwayat Order', `${p}pkriwayat`), ui.menuBtn])
    const d = await pk.api('status', { invoice })
    return pk.sendOrder(m, conn, ui, p, d.data || { invoice }, d.message || 'Status order')
  })
}

handler.help = ['pkstatus <invoice>']
handler.tags = ['reseller-premku']
handler.command = ['pkstatus']
handler.owner = true
handler.exp = 0

export default adapt(handler, { category: 'reseller-premku' })
