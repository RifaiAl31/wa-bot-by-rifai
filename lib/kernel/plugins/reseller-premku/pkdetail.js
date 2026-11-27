// ───────── pkdetail: detail satu produk ─────────
import { adapt } from '../../lib/engine/plugins.js'
import { premku as pk } from '../../lib/services/scraper.js'

let handler = async (m, { conn, text, usedPrefix: p, isOwner }) => {
  const ui = pk.ui(m, conn, p)
  const { rp, quick, isAvailable } = pk
  const id = parseInt(String(text || '').trim().split(/\s+/)[0])

  return pk.guard(m, ui, async () => {
    if (!id) return ui.sendBtn(`Pilih produk dulu lewat tombol.\nContoh: *${p}pkdetail 1*`, [quick('🛍️ Daftar Produk', `${p}pkproduk`), ui.menuBtn])
    const x = (await pk.products()).find((v) => Number(v.id) === id)
    if (!x) return ui.sendBtn(`Produk dengan ID *${id}* tidak ditemukan.`, [quick('🛍️ Daftar Produk', `${p}pkproduk`), ui.menuBtn])

    const ok = isAvailable(x)
    const body = `*${x.name}*\n\n${x.description ? x.description + '\n\n' : ''}💵 Harga : ${rp(x.price)}\n📦 Stok  : ${x.stock ?? 0}\n📌 Status : ${ok ? '🟢 Tersedia' : '🔴 Tidak tersedia'}\n🆔 ID : ${x.id}`
    const buttons = []
    if (isOwner && ok) {
      buttons.push(quick('🛒 Beli x1', `${p}pkbeli ${x.id} 1`))
      if (Number(x.stock) >= 5) buttons.push(quick('🛒 Beli x5', `${p}pkbeli ${x.id} 5`))
      if (Number(x.stock) >= 10) buttons.push(quick('🛒 Beli x10', `${p}pkbeli ${x.id} 10`))
    }
    buttons.push(quick('📊 Cek Stok Realtime', `${p}pkstok ${x.id}`), quick('⬅️ Daftar Produk', `${p}pkproduk`), ui.menuBtn)
    return ui.sendBtn(body, buttons, x.image || undefined)
  })
}

handler.help = ['pkdetail <id>']
handler.tags = ['reseller-premku']
handler.command = ['pkdetail']
handler.exp = 0

export default adapt(handler, { category: 'reseller-premku' })
