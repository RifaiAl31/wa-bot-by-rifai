// ───────── pkproduk: daftar produk berhalaman ─────────
import { adapt } from '../../lib/engine/plugins.js'
import { premku as pk } from '../../lib/services/scraper.js'

let handler = async (m, { conn, text, usedPrefix: p }) => {
  const ui = pk.ui(m, conn, p)
  const args = String(text || '').trim().split(/\s+/).filter(Boolean)
  const mode = (args[1] || '').toLowerCase() === 'stok' ? 'stok' : 'detail'
  return pk.guard(m, ui, () => pk.sendProductList(m, ui, p, args[0], mode))
}

handler.help = ['pkproduk']
handler.tags = ['reseller-premku']
handler.command = ['pkproduk']
handler.exp = 0

export default adapt(handler, { category: 'reseller-premku' })
