// ───────── pkdepstatus: cek status deposit (owner) ─────────
import { adapt } from '../../lib/engine/plugins.js'
import { premku as pk } from '../../lib/services/scraper.js'

let handler = async (m, { conn, text, usedPrefix: p, isOwner }) => {
  if (!isOwner) return m.reply('⛔ Fitur ini khusus owner.')
  const ui = pk.ui(m, conn, p)
  const { rp, icon, quick, copy } = pk
  const invoice = String(text || '').trim().split(/\s+/)[0] || pk.loadDb().deposits[0]?.invoice

  return pk.guard(m, ui, async () => {
    if (!invoice) return ui.sendBtn('Belum ada deposit. Buat dulu lewat tombol.', [quick('💰 Deposit Saldo', `${p}pkdeposit`), ui.menuBtn])
    const d = await pk.api('pay_status', { invoice })
    const x = d.data || {}
    const st = String(x.status || '').toLowerCase()
    const head = `*${icon(st)} STATUS DEPOSIT*\n\n🧾 Invoice : ${x.invoice || invoice}\n📌 Status : *${st || '-'}*${x.total_bayar ? `\n💳 Total bayar : ${rp(x.total_bayar)}` : ''}\n💬 ${d.message || ''}`

    if (st === 'pending') {
      const img = await pk.qr(null, x.qr_raw).catch(() => null)
      return ui.sendBtn(head, [
        quick('🔄 Cek Lagi', `${p}pkdepstatus ${invoice}`),
        quick('🚫 Batalkan Deposit', `${p}pkdepcancel ${invoice}`),
        ...(x.total_bayar ? [copy('📋 Salin Total Bayar', x.total_bayar)] : []),
        ui.menuBtn
      ], img || undefined)
    }
    return ui.sendBtn(head, [quick('👤 Profil & Saldo', `${p}pkprofil`), quick('💰 Deposit Lagi', `${p}pkdeposit`), ui.menuBtn])
  })
}

handler.help = ['pkdepstatus']
handler.tags = ['reseller-premku']
handler.command = ['pkdepstatus']
handler.owner = true
handler.exp = 0

export default adapt(handler, { category: 'reseller-premku' })
