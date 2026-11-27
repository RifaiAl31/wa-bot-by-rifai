// ───────── pkdepcancel: batalkan deposit pending (owner) ─────────
import { adapt } from '../../lib/engine/plugins.js'
import { premku as pk } from '../../lib/services/scraper.js'

let handler = async (m, { conn, text, usedPrefix: p, isOwner }) => {
  if (!isOwner) return m.reply('⛔ Fitur ini khusus owner.')
  const ui = pk.ui(m, conn, p)
  const { quick } = pk
  const invoice = String(text || '').trim().split(/\s+/)[0] || pk.loadDb().deposits[0]?.invoice

  return pk.guard(m, ui, async () => {
    if (!invoice) return ui.sendBtn('Belum ada deposit yang bisa dibatalkan.', [quick('💰 Deposit Saldo', `${p}pkdeposit`), ui.menuBtn])
    const d = await pk.api('cancel_pay', { invoice })
    const x = d.data || {}
    return ui.sendBtn(
      `*🚫 DEPOSIT DIBATALKAN*\n\n🧾 Invoice : ${x.invoice || invoice}\n📌 ${x.status_old || '-'} ➜ *${x.status_new || 'canceled'}*\n💬 ${d.message || ''}`,
      [quick('💰 Deposit Baru', `${p}pkdeposit`), ui.menuBtn]
    )
  })
}

handler.help = ['pkdepcancel']
handler.tags = ['reseller-premku']
handler.command = ['pkdepcancel']
handler.owner = true
handler.exp = 0

export default adapt(handler, { category: 'reseller-premku' })
