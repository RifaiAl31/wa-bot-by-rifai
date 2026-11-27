// ───────── pkstok: cek stok realtime ─────────
import { adapt } from '../../lib/engine/plugins.js'
import { premku as pk } from '../../lib/services/scraper.js'

let handler = async (m, { conn, text, usedPrefix: p, isOwner }) => {
  const ui = pk.ui(m, conn, p)
  const { quick } = pk
  const id = parseInt(String(text || '').trim().split(/\s+/)[0])

  return pk.guard(m, ui, async () => {
    if (!id) return pk.sendProductList(m, ui, p, 1, 'stok')
    const d = await pk.api('stock', { product_id: id })
    const buttons = []
    if (isOwner && Number(d.stock) > 0) buttons.push(quick('🛒 Beli x1', `${p}pkbeli ${id} 1`))
    buttons.push(quick('📄 Detail Produk', `${p}pkdetail ${id}`), quick('⬅️ Daftar Produk', `${p}pkproduk`), ui.menuBtn)
    return ui.sendBtn(`*📊 STOK REALTIME*\n\n📦 ${d.product || 'Produk ' + id}\n🔢 Stok : *${d.stock}*`, buttons)
  })
}

handler.help = ['pkstok <id>']
handler.tags = ['reseller-premku']
handler.command = ['pkstok']
handler.exp = 0

export default adapt(handler, { category: 'reseller-premku' })
