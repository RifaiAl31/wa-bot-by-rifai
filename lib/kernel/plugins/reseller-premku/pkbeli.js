// ───────── pkbeli: kartu konfirmasi order (owner) ─────────
import { adapt } from '../../lib/engine/plugins.js'
import { premku as pk } from '../../lib/services/scraper.js'

let handler = async (m, { conn, text, usedPrefix: p, isOwner }) => {
  if (!isOwner) return m.reply('⛔ Fitur ini khusus owner.')
  const ui = pk.ui(m, conn, p)
  const { rp, quick, isAvailable } = pk
  const args = String(text || '').trim().split(/\s+/).filter(Boolean)
  const id = parseInt(args[0])
  const qty = parseInt(args[1] || '1')

  return pk.guard(m, ui, async () => {
    if (!id) return ui.sendBtn(`Pilih produk lewat tombol dulu.\nFormat: *${p}pkbeli <id> <qty>*`, [quick('🛍️ Daftar Produk', `${p}pkproduk`), ui.menuBtn])
    if (!Number.isInteger(qty) || qty < 1 || qty > 1000) return m.reply('Qty harus 1 - 1000.')

    const x = (await pk.products(true)).find((v) => Number(v.id) === id)
    if (!x) return m.reply(`Produk ID ${id} tidak ditemukan.`)
    if (!isAvailable(x) || Number(x.stock) < qty) {
      return ui.sendBtn(`❌ *${x.name}* tidak bisa dibeli ${qty}x.\nStok: ${x.stock ?? 0}`, [quick('⬅️ Daftar Produk', `${p}pkproduk`), ui.menuBtn])
    }

    let saldo = ''
    try { saldo = `\n💳 Saldo : ${rp((await pk.api('profile')).data?.saldo)}` } catch {}
    // ref_id dibuat SEKARANG dan ikut di tombol: tap berulang = idempotent, saldo tidak terpotong dua kali
    const ref = `PK${Date.now().toString(36).toUpperCase()}${Math.floor(Math.random() * 900 + 100)}`
    const body = `*🧾 KONFIRMASI ORDER*\n\n📦 ${x.name}\n🔢 Qty : ${qty}\n💵 Harga : ${rp(x.price)}\n🧮 Estimasi : ${rp(Number(x.price) * qty)} _(sebelum diskon level)_${saldo}\n🔖 Ref : ${ref}\n\nSaldo akan langsung dipotong setelah konfirmasi.`
    return ui.sendBtn(body, [
      quick('✅ Konfirmasi Order', `${p}pkorder ${id} ${qty} ${ref}`),
      quick('❌ Batal', `${p}pkproduk`)
    ])
  })
}

handler.help = ['pkbeli <id> <qty>']
handler.tags = ['reseller-premku']
handler.command = ['pkbeli']
handler.owner = true
handler.exp = 0

export default adapt(handler, { category: 'reseller-premku' })
