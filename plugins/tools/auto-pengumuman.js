// .auto-pengumuman — wizard interaktif, agenda tak terbatas, pengiriman terjadwal + poster,
// dan jembatan ke dashboard web (memakai socket & database yang sama).
'use strict'
const data = require('../../lib/autoAnnouncementData')
const flow = require('../../lib/autoAnnouncementFlow')
const webUrl = require('../../lib/announcementWebUrl')

function help(prefix) {
  const s = data.stats()
  return [
    '📢 *AUTO PENGUMUMAN*',
    '',
    `Agenda: ${s.total} | Aktif: ${s.active} | Draft: ${s.draft} | Terkirim: ${s.sent} | Gagal: ${s.failed}`,
    '',
    `${prefix}auto-pengumuman — daftar + status + panduan ini`,
    `${prefix}auto-pengumuman tambah — wizard membuat agenda`,
    `${prefix}auto-pengumuman list — semua agenda`,
    `${prefix}auto-pengumuman detail AN1 — detail lengkap`,
    `${prefix}auto-pengumuman hapus AN1 — hapus agenda`,
    `${prefix}auto-pengumuman pause AN1 — hentikan sementara`,
    `${prefix}auto-pengumuman resume AN1 — aktifkan kembali`,
    `${prefix}auto-web — tautan dashboard (admin saja, diset dari WA)`,
    `${prefix}auto-pengumuman bot — alias lama dari perintah di atas`,
    '',
    'Wizard: hari → tanggal → judul → isi → jam kegiatan → waktu kirim → jam kirim → pengulangan → format → grup tujuan → konfirmasi.',
    'Jawab dengan pesan biasa (tanpa titik). Saat konfirmasi: ya / edit judul <teks> / batal.',
    '',
    'Waktu kirim: 1 = 7 hari sebelum, 2 = 1 hari sebelum, 3 = hari kegiatan.',
    'Format: 1 = teks, 2 = poster, 3 = teks + poster. Zona waktu Asia/Jakarta.',
    'Dashboard: kelola draft, gambar, jadwal, template, dan riwayat pengiriman.',
  ].join('\n')
}

function detail(row, sock) {
  return [flow.formatRow(row, sock), '', 'ISI LENGKAP:', String(row.body || '')].join('\n')
}

function summary(rows, sock) {
  if (!rows.length) return 'Belum ada agenda. Buat dengan .auto-pengumuman tambah'
  const s = data.stats()
  return [
    `DAFTAR AGENDA (${rows.length}) — aktif ${s.active}, draft ${s.draft}, terkirim ${s.sent}, gagal ${s.failed}`,
    '',
    rows.map((row) => flow.formatRow(row, sock)).join('\n\n'),
  ].join('\n')
}

module.exports = {
  name: 'auto-pengumuman',
  command: ['auto-pengumuman'],
  category: 'tools',
  desc: 'Agenda pengumuman otomatis: wizard, jadwal, poster, dashboard web, dan arsip permanen',
  usage: 'tambah | list | detail AN1 | hapus AN1 | pause AN1 | resume AN1 | bot (alias .auto-web)',
  run: async ({ sock, msg, from, sender, args, prefix, reply, isOwner, isAdmin }) => {
    const sub = String(args[0] || '').trim().toLowerCase()
    const rest = args.slice(1)
    if (!sub || ['help', 'bantuan', '?'].includes(sub)) return reply(help(prefix))

    if (sub === 'tambah') {
      return flow.startAdd({ sock, msg, from, sender, body: '', text: '', prefix })
    }
    if (sub === 'bot') {
      if (!isOwner && !isAdmin) return reply('🔒 Tautan dashboard hanya untuk admin/owner bot.')
      const base = webUrl.get()
      if (!base) return reply(`URL dashboard belum diatur. Ketik ${prefix}auto-web set https://nama-project.vercel.app`)
      return reply([
        '🌐 *DASHBOARD AUTO PENGUMUMAN*',
        '',
        webUrl.dashboardLink(base),
        '',
        'Login memakai password admin yang diset di VPS (DASHBOARD_PASSWORD).',
        'Dashboard memakai sesi WhatsApp dan database yang SAMA dengan bot — tidak ada koneksi kedua.',
        'Jangan bagikan tautan atau password ini ke orang lain.',
        '',
        `Perintah baru: ${prefix}auto-web`,
      ].join('\n'))
    }
    if (sub === 'list') {
      return reply(summary(data.list(), sock))
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
