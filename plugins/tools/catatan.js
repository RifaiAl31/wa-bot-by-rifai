// .catatan — arsip transkrip rapat hasil .analisis-catatan.
// Perhatian: command "catatan" juga dipakai plugin image/katabgwindah.js.
// Perintah CRUD di sini di-intercept lebih dulu oleh hook analisis-catatan-hook.js.
'use strict'
const data = require('../../lib/noteData')
const flow = require('../../lib/noteFlow')
const vision = require('../../lib/noteVision')

function linesFor(row) {
  const out = []
  for (const [key, label] of vision.CATEGORIES) {
    const block = row.transcript?.[key]
    if (block?.tertulis?.length) out.push(`${label}:\n  • ${block.tertulis.join('\n  • ')}`)
  }
  return out
}

function detail(row) {
  return [
    `📒 ${row.id} — ${row.title}`,
    `Tanggal: ${row.tanggal || '-'}`,
    `Halaman: ${row.pages?.length || 0} | Model: ${row.provider || '-'}`,
    `Disimpan: ${String(row.createdAt || '').slice(0, 19).replace('T', ' ')}`,
    '',
    ...linesFor(row),
    '',
    'Teks mentah:',
    String(row.raw || '').slice(0, 12000) || '(kosong)',
  ].join('\n')
}

function handle({ sock, msg, from, sender, args, text, prefix, reply }) {
  const sub = String(args[0] || '').trim().toLowerCase()
  if (!sub || ['help', '?'].includes(sub)) {
    return reply([
      '📒 *ARSIP CATATAN RAPAT*',
      '',
      `${prefix}catatan list`,
      `${prefix}catatan detail CAT001`,
      `${prefix}catatan hapus CAT001`,
      `${prefix}catatan cari kata`,
      `${prefix}catatan pengumuman CAT001`,
    ].join('\n'))
  }
  if (sub === 'list') {
    const rows = data.list()
    if (!rows.length) return reply('Arsip masih kosong. Analisis foto dengan .analisis-catatan')
    return reply(['DAFTAR CATATAN', '', rows.map((r) =>
      `${r.id} | ${r.title}${r.tanggal ? ` | ${r.tanggal}` : ''} | ${r.pages?.length || 0} halaman`).join('\n')].join('\n'))
  }
  if (sub === 'detail') {
    const row = data.get(args[1])
    return reply(row ? detail(row) : 'ID tidak ditemukan.')
  }
  if (sub === 'hapus') {
    const row = data.get(args[1])
    if (!row) return reply('ID tidak ditemukan.')
    data.remove(row.id)
    return reply(`Catatan ${row.id} dihapus dari arsip.`)
  }
  if (sub === 'cari' || sub === 'search') {
    const term = String(text || '').replace(/^\S+\s*/, '').trim()
    if (!term) return reply(`Contoh: ${prefix}catatan cari iuran`)
    const rows = data.search(term)
    if (!rows.length) return reply(`Tidak ada catatan yang mengandung "${term}".`)
    return reply(['HASIL PENCARIAN', '', rows.map((r) => `${r.id} | ${r.title}`).join('\n')].join('\n'))
  }
  if (sub === 'pengumuman') {
    return flow.startPengumuman({ sock, msg, from, sender, prefix })
  }
  return reply('Subperintah tidak dikenali.')
}

module.exports = {
  name: 'catatan-rapat',
  command: ['catatan-rapat'],
  category: 'tools',
  desc: 'Arsip catatan rapat: list, detail, hapus, cari, dan buat pengumuman',
  usage: 'list | detail CAT001 | hapus CAT001 | cari kata | pengumuman CAT001',
  run: (ctx) => handle(ctx),
  handle,
}
