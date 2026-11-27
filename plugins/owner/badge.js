// Fitur owner/badge — kelola stiker badge. Tiap stiker punya jumlah kirim sendiri (tanpa batas).
//   reply stiker + .badge add 50   -> stiker itu dikirim 50x tiap pesan masuk
//   reply stiker lain + .badge add 20 -> stiker itu 20x
const st = require('../../lib/badge')
const { getMedia, getContextInfo } = require('../../lib/utils')
const { normalizeMessageContent } = require('@whiskeysockets/baileys')

const react = (sock, from, msg, text) => sock.sendMessage(from, { react: { text, key: msg.key } }).catch(() => {})
const fmt = (n) => Number(n).toLocaleString('id-ID')

module.exports = {
  name: 'badge',
  command: ['badge', 'badgerealtime', 'badgecount'],
  category: 'owner',
  emoji: '🏷️',
  desc: 'Badge realtime: stiker badge otomatis di tiap pesan masuk, jumlah per stiker bebas (tanpa batas)',
  usage: 'badge add <jumlah> (reply stiker) | badge set <no> <jumlah> | badge list | badge del <no> | badge reset | badgecount <jumlah> | badgerealtime on/off',
  owner: true,
  run: async ({ sock, msg, from, args, command, prefix, reply }) => {
    const d = st.data
    const help = () => reply(
`*BADGE REALTIME*
Status : ${d.enabled ? 'ON' : 'OFF'}
Stiker : ${fmt(d.list.length)} | Total kirim/pesan : ${fmt(st.total())}

*Tambah stiker (reply stiker)*
• ${prefix}badge add 50 → stiker ini keluar 50x
• ${prefix}badge add → pakai jumlah bawaan (${fmt(d.count)}x)
• ${prefix}badge 30 → ganti semua dengan stiker ini (30x)

*Atur*
• ${prefix}badge set <no> <jumlah> → ubah jumlah stiker
• ${prefix}badge all <jumlah> → samakan semua stiker
• ${prefix}badgecount <jumlah> → jumlah bawaan
• ${prefix}badge list | del <no> | reset
• ${prefix}badgerealtime on/off`)

    if (command === 'badgerealtime') {
      const a = String(args[0] || '').toLowerCase()
      if (!['on', 'off'].includes(a)) return reply(`Badge Realtime: *${d.enabled ? 'ON' : 'OFF'}*\nStiker: ${fmt(d.list.length)} | Total kirim/pesan: ${fmt(st.total())}\n\n${prefix}badgerealtime on / off`)
      const next = a === 'on'
      if (d.enabled === next) return reply(`Badge Realtime sudah ${next ? 'aktif' : 'nonaktif'}.`)
      if (next && !d.list.length) return reply(`Belum ada stiker badge. Reply stiker dengan *${prefix}badge add <jumlah>* dulu.`)
      d.enabled = next
      st.save()
      return reply(`Badge Realtime ${next ? 'diaktifkan' : 'dinonaktifkan'}.`)
    }

    if (command === 'badgecount') {
      if (String(args[0] || '').toLowerCase() === 'all') {
        const n = st.parseN(args[1])
        if (!n) return reply(`Contoh: ${prefix}badgecount all 25`)
        for (const it of d.list) it.n = n
        st.save()
        return reply(`Semua ${fmt(d.list.length)} stiker sekarang dikirim ${fmt(n)}x per pesan.`)
      }
      const n = st.parseN(args[0])
      if (!n) return reply(`Jumlah bawaan sekarang: *${fmt(d.count)}*\nDipakai oleh stiker yang belum punya jumlah sendiri.\n\nUbah: ${prefix}badgecount <jumlah>\nSamakan semua: ${prefix}badgecount all <jumlah>`)
      d.count = n
      st.save()
      return reply(`Jumlah bawaan jadi *${fmt(n)}x*. Stiker yang punya jumlah sendiri tidak berubah.`)
    }

    const sub = String(args[0] || '').toLowerCase()
    if (sub === 'help' || sub === 'bantuan') return help()

    if (sub === 'list') {
      if (!d.list.length) return reply('Belum ada stiker badge.')
      return reply(`*Stiker badge (${fmt(d.list.length)})*\nTotal kirim/pesan: ${fmt(st.total())}\n\n${d.list.map((x, i) => `${i + 1}. ${x.isAnimated ? 'Animasi' : 'Statis'} | ${fmt(st.countOf(x))}x | ${(Buffer.from(x.b64, 'base64').length / 1024).toFixed(1)} KB${x.n ? '' : ' (bawaan)'}`).join('\n')}\n\nUbah jumlah: ${prefix}badge set <no> <jumlah>\nHapus: ${prefix}badge del <no>`)
    }
    if (sub === 'reset') {
      d.list = []; d.enabled = false; d.buffer = ''; st.save()
      return reply('Semua stiker badge dihapus dan Badge Realtime dimatikan.')
    }
    if (sub === 'del' || sub === 'hapus') {
      const i = parseInt(args[1]) - 1
      if (!(i >= 0 && i < d.list.length)) return reply(`Nomor tidak valid. Lihat daftar: ${prefix}badge list`)
      d.list.splice(i, 1)
      if (!d.list.length) d.enabled = false
      st.save()
      return reply(`Stiker no ${i + 1} dihapus. Sisa: ${fmt(d.list.length)}.`)
    }
    if (sub === 'set' || sub === 'jumlah') {
      const i = parseInt(args[1]) - 1
      const n = st.parseN(args[2])
      if (!(i >= 0 && i < d.list.length) || !n) return reply(`Contoh: ${prefix}badge set 2 50\n(stiker no 2 dikirim 50x). Lihat nomor: ${prefix}badge list`)
      d.list[i].n = n
      st.save()
      return reply(`Stiker no ${i + 1} sekarang dikirim ${fmt(n)}x per pesan. Total: ${fmt(st.total())}.`)
    }
    if (sub === 'all' || sub === 'semua') {
      const n = st.parseN(args[1])
      if (!n) return reply(`Contoh: ${prefix}badge all 25`)
      for (const it of d.list) it.n = n
      st.save()
      return reply(`Semua ${fmt(d.list.length)} stiker sekarang dikirim ${fmt(n)}x per pesan.`)
    }

    // add [jumlah]  |  [jumlah] (ganti semua)
    const add = sub === 'add' || sub === 'tambah'
    const nArg = add ? args[1] : args[0]
    const n = nArg === undefined ? null : st.parseN(nArg)
    if (nArg !== undefined && !n) return reply(`Jumlah harus angka bulat 1 ke atas. Contoh: ${prefix}badge add 50`)
    const quoted = normalizeMessageContent(getContextInfo(msg)?.quotedMessage)
    if (!quoted?.stickerMessage) return help()
    await react(sock, from, msg, '⏱️')
    try {
      const media = await getMedia(sock, msg, ['stickerMessage'])
      if (!media?.buffer?.length) throw new Error('Gagal mengunduh file stiker.')
      const b64 = media.buffer.toString('base64')
      const isAnimated = !!media.info?.isAnimated
      let status
      const same = add ? d.list.find((x) => x.b64 === b64) : null
      if (same) { if (n) same.n = n; status = 'diperbarui' }
      else {
        const item = { b64, isAnimated }
        if (n) item.n = n
        if (add) d.list.push(item); else d.list = [item]
        status = add ? 'ditambah' : 'diganti'
      }
      d.buffer = ''; d.updatedAt = Date.now()
      st.save()
      await react(sock, from, msg, '✅')
      const cur = same || d.list[d.list.length - 1]
      return reply(`*Badge ${status}*\n\nTipe : ${isAnimated ? 'Animasi' : 'Statis'}\nJumlah stiker ini : ${fmt(st.countOf(cur))}x per pesan${n ? '' : ' (bawaan)'}\nTotal stiker : ${fmt(d.list.length)}\nTotal kirim/pesan : ${fmt(st.total())}\n\n${prefix}badgerealtime on → aktifkan\n${prefix}badge add 20 (reply stiker lain) → tambah dengan jumlah lain`)
    } catch (err) {
      await react(sock, from, msg, '❌')
      return reply(`Gagal menyimpan badge: ${err.message}`)
    }
  }
}
