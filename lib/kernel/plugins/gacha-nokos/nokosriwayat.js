import { getUserHistory } from '../../lib/services/nokostraffic.js'

// .nokosriwayat -> riwayat nomor nokos & OTP milik kamu (14 hari terakhir, maksimal 30 nomor)

const pct = (v) => v === null || v === undefined ? '-' : `${Math.round(v * 100)}%`

const ago = (t) => {
  const s = Math.max(1, Math.round((Date.now() - t) / 1000))
  if (s < 60) return `${s} dtk lalu`
  if (s < 3600) return `${Math.round(s / 60)} mnt lalu`
  if (s < 86400) return `${Math.round(s / 3600)} jam lalu`
  return `${Math.round(s / 86400)} hari lalu`
}

let handler = async (m, { reply, usedPrefix, prefix }) => {
  const p = usedPrefix ?? prefix ?? '.'
  const h = getUserHistory(m.sender)

  if (!h.total) {
    return reply(`📜 Belum ada riwayat nokos.\nCoba dulu: ${p}gachanokos`)
  }

  let out = `📜 *RIWAYAT NOKOS KAMU*\n_14 hari terakhir_\n\n`
  out += `📞 Nomor didapat: *${h.total}*\n`
  out += `📩 OTP masuk: *${h.otp}* (${pct(h.rate)})\n\n`

  const top = Object.entries(h.byCountry).sort((a, b) => b[1].n - a[1].n).slice(0, 5)
  out += `*Per negara*\n`
  for (const [name, c] of top) {
    out += `• ${name} — ${c.n} nomor, ${c.otp} OTP (${pct(c.n ? c.otp / c.n : null)})\n`
  }

  out += `\n*Terakhir*\n`
  h.list.slice(0, 8).forEach((x, i) => {
    out += `${i + 1}. +${x.num} • ${x.country} • ${x.otp ? '✅ OTP masuk' : '⏳ tanpa OTP'} • ${ago(x.at)}\n`
  })

  out += `\n_Negara dengan OTP% tinggi di sini layak digacha lagi: ${p}traffic_`
  return reply(out.trim())
}

handler.command = ['nokosriwayat', 'riwayatnokos']
handler.help = ['nokosriwayat']
handler.tags = ['gacha-nokos']

export default handler
