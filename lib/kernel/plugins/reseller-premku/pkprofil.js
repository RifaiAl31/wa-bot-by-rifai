// ───────── pkprofil: profil & saldo Premku (owner) ─────────
import { adapt } from '../../lib/engine/plugins.js'
import { premku as pk } from '../../lib/services/scraper.js'

let handler = async (m, { conn, usedPrefix: p, isOwner }) => {
  if (!isOwner) return m.reply('⛔ Fitur ini khusus owner.')
  const ui = pk.ui(m, conn, p)
  const { rp, quick } = pk

  return pk.guard(m, ui, async () => {
    const u = (await pk.api('profile')).data || {}
    return ui.sendBtn(
      `*👤 PROFIL PREMKU*\n\n🙍 Username : ${u.username}\n📱 WhatsApp : ${u.whatsapp}\n💳 Saldo : *${rp(u.saldo)}*\n🗓️ Terdaftar : ${u.registered_at}`,
      [quick('💰 Deposit Saldo', `${p}pkdeposit`), quick('🛍️ Daftar Produk', `${p}pkproduk`), quick('🧾 Riwayat Order', `${p}pkriwayat`), ui.menuBtn]
    )
  })
}

handler.help = ['pkprofil']
handler.tags = ['reseller-premku']
handler.command = ['pkprofil']
handler.owner = true
handler.exp = 0

export default adapt(handler, { category: 'reseller-premku' })
