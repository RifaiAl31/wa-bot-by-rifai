const sv = require('../../lib/survival')
const rp = (n) => 'Rp' + Math.round(n).toLocaleString('id-ID')

const NAME = (k) => sv.ITEMS[k].nama
const effect = (it) => [it.lapar && `lapar ${it.lapar > 0 ? '+' : ''}${it.lapar}`, it.haus && `haus ${it.haus > 0 ? '+' : ''}${it.haus}`, it.energi && `energi +${it.energi}`, it.hp && `HP +${it.hp}`].filter(Boolean).join(', ')

function card(sender, name = '') {
  const { u, v } = sv.status(sender)
  const lines = [
    `*KONDISI BERTAHAN HIDUP*${name ? ' - ' + name : ''}`,
    '',
    `HP     ${sv.bar(v.hp)}`,
    `Energi ${sv.bar(v.energi)}`,
    `Lapar  ${sv.bar(v.lapar)}`,
    `Haus   ${sv.bar(v.haus)}`,
    '',
    `Saldo  : ${rp(u.money || 0)}`,
    `Limit  : ${u.limit || 0}`
  ]
  if (v.down) lines.push('', 'STATUS: PINGSAN - pakai rs untuk ke rumah sakit.')
  else if (v.lapar < 25 || v.haus < 25) lines.push('', 'Peringatan: kamu hampir kelaparan/kehausan, HP akan turun.')
  return lines.join('\n')
}

module.exports = {
  name: 'hidup',
  command: ['hidup', 'vital', 'kondisi', 'warung', 'makan', 'minum', 'obat', 'tasku', 'tidurlelap', 'rs'],
  category: 'rpg',
  desc: 'Mode bertahan hidup: cek kondisi, beli & konsumsi makanan, tidur, rumah sakit. Setiap fitur bot memakai energi, saldo, dan limit.',
  usage: '.hidup | .warung [beli <barang> [jumlah]] | .makan <barang|gratis> | .minum <barang> | .obat | .tasku | .tidurlelap | .rs',
  run: async (ctx) => {
    const { sender, command, args, prefix, msg, reply } = ctx
    const p = prefix
    const name = msg.pushName || ''
    switch (command) {
      case 'hidup': case 'vital': case 'kondisi':
        return reply(card(sender, name) + `\n\nBiaya fitur: setiap perintah memakai energi + saldo (+ limit untuk fitur berat). Premium diskon 50%.\nIsi ulang: ${p}warung, ${p}tidurlelap, ${p}kerja, ${p}daily.`)

      case 'warung': {
        if ((args[0] || '').toLowerCase() === 'beli') {
          const key = (args[1] || '').toLowerCase(); const qty = Math.max(1, Math.min(20, parseInt(args[2], 10) || 1))
          if (!sv.ITEMS[key]) return reply(`Barang tidak ada. Lihat daftar: ${p}warung`)
          const r = sv.buy(sender, key, qty)
          if (!r.ok) return reply(`Saldo tidak cukup. Butuh ${rp(r.total)}.`)
          return reply(`Beli ${qty} ${NAME(key)} seharga ${rp(r.total)}.\nPakai: ${p}${sv.ITEMS[key].hp ? 'obat' : sv.ITEMS[key].haus > 0 && !sv.ITEMS[key].lapar ? 'minum' : 'makan'} ${key}`)
        }
        const list = Object.entries(sv.ITEMS).map(([k, it]) => `- ${k} (${it.nama}) ${rp(it.harga)} : ${effect(it)}`)
        return reply(`*WARUNG*\n\n${list.join('\n')}\n\nBeli: ${p}warung beli <kode> [jumlah]\nGratis tiap 6 jam: ${p}makan gratis`)
      }

      case 'makan': case 'minum': case 'obat': {
        let key = (args[0] || '').toLowerCase()
        if (command === 'obat' && !key) key = 'obat'
        if (!key) return reply(`Contoh: ${p}${command} ${command === 'minum' ? 'air' : command === 'obat' ? 'obat' : 'nasi'}\nBarang dibeli dulu di ${p}warung. Cek isi tas: ${p}tasku`)
        if (key === 'gratis') {
          const r = sv.freeMeal(sender)
          if (!r.ok) return reply(`Jatah gratis habis. Coba lagi ${r.wait} menit lagi.`)
          return reply(`Dapat jatah makan & minum gratis dari warung.\n\n${sv.bar(r.v.lapar).replace(/^/, 'Lapar ')}\n${sv.bar(r.v.haus).replace(/^/, 'Haus  ')}`)
        }
        // makanan RPG (rendang, steak, dst.) ditangani rpg-core: nama perintah .makan dipakai bersama
        if (command === 'makan' && !sv.ITEMS[key]) return require('../rpg/rpg-core').run(ctx)
        if (!sv.ITEMS[key]) return reply(`Barang tidak dikenal. Lihat ${p}warung`)
        const qty = Math.max(1, Math.min(10, parseInt(args[1], 10) || 1))
        const r = sv.eat(sender, key, qty)
        if (!r.ok) return reply(`Kamu tidak punya ${NAME(key)} (x${qty}). Beli: ${p}warung beli ${key}`)
        return reply(`Memakai ${qty} ${NAME(key)}.\n\n${card(sender)}`)
      }

      case 'tasku': {
        const { u } = sv.status(sender)
        const ent = Object.entries(u.inv || {})
        if (!ent.length) return reply(`Tasmu kosong. Belanja di ${p}warung.`)
        return reply(`*TASKU*\n\n${ent.map(([k, n]) => `- ${NAME(k)} x${n} (${effect(sv.ITEMS[k])})`).join('\n')}`)
      }

      case 'tidurlelap': {
        const r = sv.sleep(sender)
        if (!r.ok) return reply(r.hungry ? `Tidak bisa tidur nyenyak saat lapar/haus. Makan & minum dulu (${p}warung).` : `Belum ngantuk. Bisa tidur lagi ${r.wait} menit lagi.`)
        return reply(`Tidur nyenyak. Energi +${Math.round(r.gain)}, HP +10 (lapar & haus berkurang sedikit).\n\n${card(sender)}`)
      }

      case 'rs': {
        const r = sv.hospital(sender)
        if (r.notNeeded) return reply('Kamu tidak perlu ke rumah sakit (HP masih sehat).')
        if (r.poor) return reply('Biaya rumah sakit Rp5.000, saldomu kurang. Tunggu sadar sendiri (maks 20 menit) atau cari uang dulu.')
        return reply(`Dirawat di rumah sakit (Rp5.000).\n\n${card(sender)}`)
      }
    }
  }
}
