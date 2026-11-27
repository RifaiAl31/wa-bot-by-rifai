// .auto-pengumuman — wizard interaktif, agenda tak terbatas, pengiriman terjadwal + poster.
'use strict'
const data = require('../../lib/autoAnnouncementData')
const flow = require('../../lib/autoAnnouncementFlow')

function help(prefix) {
  return [
    '📢 *AUTO PENGUMUMAN*',
    '',
    `${prefix}auto-pengumuman — bantuan ini`,
    `${prefix}auto-pengumuman tambah — wizard membuat agenda`,
    `${prefix}auto-pengumuman list — semua agenda`,
    `${prefix}auto-pengumuman detail AN1 — detail lengkap`,
    `${prefix}auto-pengumuman hapus AN1 — hapus agenda`,
    `${prefix}auto-pengumuman pause AN1 — hentikan sementara`,
    `${prefix}auto-pengumuman resume AN1 — aktifkan kembali`,
    '',
    'Wizard: hari → tanggal → judul → isi → jam kegiatan → waktu kirim → jam kirim → pengulangan → format → grup tujuan → konfirmasi.',
    'Jawab dengan pesan biasa (tanpa titik). Saat konfirmasi: ya / edit judul <teks> / batal.',
    '',
    'Waktu kirim: 1 = 7 hari sebelum, 2 = 1 hari sebelum, 3 = hari kegiatan.',
    'Format: 1 = teks, 2 = poster, 3 = teks + poster. Zona waktu Asia/Jakarta.',
  ].join('\n')
}

function detail(row, sock) {
  return [flow.formatRow(row, sock), '', 'ISI LENGKAP:', String(row.body || '')].join('\n')
}

module.exports = {
  name: 'auto-pengumuman',
  command: ['auto-pengumuman'],
  category: 'tools',
  desc: 'Agenda pengumuman otomatis: wizard, jadwal, poster, dan arsip permanen',
  usage: 'tambah | list | detail AN1 | hapus AN1 | pause AN1 | resume AN1',
  run: async ({ sock, msg, from, sender, args, prefix, reply }) => {
    const sub = String(args[0] || '').trim().toLowerCase()
    const rest = args.slice(1)
    if (!sub || ['help', 'bantuan', '?'].includes(sub)) return reply(help(prefix))

    if (sub === 'tambah') {
      return flow.startAdd({ sock, msg, from, sender, body: '', text: '', prefix })
    }
    if (sub === 'list') {
      const rows = data.list()
      if (!rows.length) return reply('Belum ada agenda. Buat dengan .auto-pengumuman tambah')
      return reply([
        `DAFTAR AGENDA (${rows.length})`,
        '',
        rows.map((row) => flow.formatRow(row, sock)).join('\n\n'),
      ].join('\n'))
    }
    if (['detail', 'hapus', 'pause', 'resume'].includes(sub)) {
      const row = data.get(String(rest[0] || '').trim())
      if (!row) return reply(`ID tidak ditemukan. Cek dengan ${prefix}auto-pengumuman list`)
      if (sub === 'detail') return reply(detail(row, sock))
      if (sub === 'hapus') {
        data.remove(row.id)
        flow.clearSession({ from, sender })
        return reply(`Agenda ${row.id} dihapus.`)
      }
      data.setActive(row.id, sub === 'resume')
      return reply(`Agenda ${row.id} ${sub === 'pause' ? 'dijeda (pause)' : 'diaktifkan kembali'}.`)
    }
    return reply(`Subperintah tidak dikenali: ${sub}\n\n${help(prefix)}`)
  },
}
