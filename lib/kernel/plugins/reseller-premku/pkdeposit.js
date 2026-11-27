// ───────── pkdeposit: buat deposit saldo via QRIS (owner) ─────────
import { adapt } from '../../lib/engine/plugins.js'
import { premku as pk } from '../../lib/services/scraper.js'

const NOMINAL = [10000, 20000, 50000, 100000, 200000]

let handler = async (m, { conn, text, usedPrefix: p, isOwner }) => {
  if (!isOwner) return m.reply('⛔ Fitur ini khusus owner.')
  const ui = pk.ui(m, conn, p)
  const { rp, quick, copy } = pk
  const amount = parseInt(String(text || '').replace(/\D/g, ''))

  return pk.guard(m, ui, async () => {
    if (!amount) {
      return ui.sendBtn(
        `*💰 DEPOSIT SALDO*\n\nPilih nominal lewat tombol, atau ketik sendiri:\n*${p}pkdeposit 75000*`,
        [
          { type: 'list', text: '💵 Pilih Nominal', sections: [{ title: 'Nominal deposit', rows: NOMINAL.map((n) => ({ id: `${p}pkdeposit ${n}`, title: rp(n), description: 'Bayar via QRIS' })) }] },
          quick('👤 Profil & Saldo', `${p}pkprofil`),
          ui.menuBtn
        ]
      )
    }

    const x = (await pk.api('pay', { amount })).data || {}
    if (x.invoice) {
      const db = pk.loadDb()
      db.deposits.unshift({ invoice: x.invoice, total: x.total_bayar, time: Date.now() })
      db.deposits = db.deposits.slice(0, 20)
      pk.saveDb(db)
    }
    const body = `*💰 DEPOSIT SALDO*\n\n🧾 Invoice : ${x.invoice}\n💵 Nominal : ${rp(x.amount_req)}\n🔢 Kode unik : ${x.kode_unik}\n💳 *Total bayar : ${rp(x.total_bayar)}*\n⏰ ${x.expired_in || ''}\n\nScan QRIS dan bayar *tepat sesuai total* (sudah termasuk kode unik).`
    const img = await pk.qr(x.qr_image, x.qr_raw).catch(() => null)
    return ui.sendBtn(body, [
      quick('✅ Cek Pembayaran', `${p}pkdepstatus ${x.invoice}`),
      quick('🚫 Batalkan Deposit', `${p}pkdepcancel ${x.invoice}`),
      copy('📋 Salin Total Bayar', x.total_bayar),
      ui.menuBtn
    ], img || undefined)
  })
}

handler.help = ['pkdeposit <nominal>']
handler.tags = ['reseller-premku']
handler.command = ['pkdeposit']
handler.owner = true
handler.exp = 0

export default adapt(handler, { category: 'reseller-premku' })
