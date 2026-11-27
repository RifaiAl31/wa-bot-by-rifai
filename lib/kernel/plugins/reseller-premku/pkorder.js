// ───────── pkorder: eksekusi order setelah konfirmasi (owner) ─────────
import { adapt } from '../../lib/engine/plugins.js'
import { premku as pk } from '../../lib/services/scraper.js'

let handler = async (m, { conn, text, usedPrefix: p, isOwner }) => {
  if (!isOwner) return m.reply('⛔ Fitur ini khusus owner.')
  const ui = pk.ui(m, conn, p)
  const args = String(text || '').trim().split(/\s+/).filter(Boolean)
  const id = parseInt(args[0])
  const qty = parseInt(args[1])
  const ref = args[2] || ''

  return pk.guard(m, ui, async () => {
    if (!id || !Number.isInteger(qty) || qty < 1 || qty > 1000 || !/^[\w-]{6,64}$/.test(ref)) {
      return ui.sendBtn('Order harus lewat tombol konfirmasi.', [pk.quick('🛍️ Daftar Produk', `${p}pkproduk`), ui.menuBtn])
    }
    await m.react?.('🕒')
    const d = await pk.api('order', { product_id: id, qty, ref_id: ref })
    const o = d.data || {}

    if (o.invoice) {
      const db = pk.loadDb()
      if (!db.history.some((h) => h.invoice === o.invoice)) {
        db.history.unshift({ invoice: o.invoice, product: o.product, qty: o.qty, total: o.total, time: Date.now() })
        db.history = db.history.slice(0, 30)
        pk.saveDb(db)
      }
    }
    await m.react?.('✅')
    return pk.sendOrder(m, conn, ui, p, o, d.message || 'Order sukses.')
  })
}

handler.help = ['pkorder <id> <qty> <ref>']
handler.tags = ['reseller-premku']
handler.command = ['pkorder']
handler.owner = true
handler.exp = 0

export default adapt(handler, { category: 'reseller-premku' })
