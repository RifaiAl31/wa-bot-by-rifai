// ───────── pkriwayat: riwayat order dari bot (owner) ─────────
import { adapt } from '../../lib/engine/plugins.js'
import { premku as pk } from '../../lib/services/scraper.js'

let handler = async (m, { conn, usedPrefix: p, isOwner }) => {
  if (!isOwner) return m.reply('⛔ Fitur ini khusus owner.')
  const ui = pk.ui(m, conn, p)
  const { rp, cut, when, quick } = pk

  return pk.guard(m, ui, async () => {
    const { history } = pk.loadDb()
    if (!history.length) return ui.sendBtn('Belum ada riwayat order dari bot ini.', [quick('🛍️ Daftar Produk', `${p}pkproduk`), ui.menuBtn])

    const top = history.slice(0, 10)
    const rows = top.map((h) => ({
      id: `${p}pkstatus ${h.invoice}`,
      title: cut(h.invoice, 24),
      description: cut(`${h.product || '-'} x${h.qty || 1} • ${rp(h.total)}`, 72)
    }))
    const body = '*🧾 RIWAYAT ORDER*\n\n' + top.map((h, i) => `${i + 1}. ${h.invoice}\n    ${h.product || '-'} x${h.qty || 1} • ${rp(h.total)} • ${when(h.time)}`).join('\n')
    return ui.sendBtn(body, [
      { type: 'list', text: '🔎 Cek Status Order', sections: [{ title: 'Pilih invoice', rows }] },
      ui.menuBtn
    ])
  })
}

handler.help = ['pkriwayat']
handler.tags = ['reseller-premku']
handler.command = ['pkriwayat']
handler.owner = true
handler.exp = 0

export default adapt(handler, { category: 'reseller-premku' })
