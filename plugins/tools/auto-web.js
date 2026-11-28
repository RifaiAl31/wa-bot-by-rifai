// .auto-web — tautan dashboard web auto pengumuman. Bisa menyetel URL dari WhatsApp
// supaya tidak perlu mengedit .env di VPS. Hanya admin/owner yang boleh memakainya.
'use strict'
const webUrl = require('../../lib/announcementWebUrl')
const data = require('../../lib/autoAnnouncementData')

const help = (prefix) => [
  '🌐 *AUTO WEB* — dashboard pengumuman',
  '',
  `${prefix}auto-web — kirim tautan dashboard`,
  `${prefix}auto-web set https://nama-project.vercel.app — atur URL dashboard`,
  `${prefix}auto-web status — lihat sumber URL saat ini`,
  `${prefix}auto-web reset — hapus URL yang diset dari WhatsApp`,
  '',
  'Login dashboard memakai password admin (DASHBOARD_PASSWORD).',
  'Dashboard memakai sesi WhatsApp dan database yang sama dengan bot.',
].join('\n')

function allowed(ctx) {
  return !!(ctx.isOwner || ctx.isAdmin)
}

module.exports = {
  name: 'auto-web',
  command: ['auto-web'],
  category: 'tools',
  desc: 'Tautan & pengaturan URL dashboard web auto pengumuman (admin saja)',
  usage: '[set https://... | status | reset]',
  run: async ({ args, reply, isOwner, isAdmin, prefix }) => {
    const ctx = { isOwner, isAdmin }
    if (!allowed(ctx)) return reply('🔒 Perintah ini hanya untuk admin/owner bot.')

    const sub = String(args[0] || '').trim().toLowerCase()
    if (['help', 'bantuan', '?'].includes(sub)) return reply(help(prefix))

    if (sub === 'set') {
      const value = args.slice(1).join(' ').trim()
      if (!value) return reply(`Cara pakai: ${prefix}auto-web set https://nama-project.vercel.app`)
      try {
        const saved = webUrl.set(value)
        data.appendAudit({ actor: 'wa', action: 'web-url-set', target: saved, detail: 'via WhatsApp' })
        return reply([
          '✅ URL dashboard disimpan.',
          '',
          webUrl.dashboardLink(saved),
          '',
          `Cek lagi dengan ${prefix}auto-web.`,
          'Pastikan backend/VPS bisa diakses lewat HTTPS dan env BACKEND_URL di Vercel sudah diisi.',
        ].join('\n'))
      } catch (err) {
        return reply(err.message)
      }
    }

    if (sub === 'reset') {
      const removed = webUrl.reset()
      return reply(removed
        ? `URL dari WhatsApp dihapus. Set lagi dengan ${prefix}auto-web set <url> atau isi DASHBOARD_PUBLIC_URL di .env.`
        : 'Tidak ada URL buatan WhatsApp yang bisa dihapus.')
    }

    if (sub === 'status') {
      const base = webUrl.get()
      return reply([
        '⚙️ *STATUS URL DASHBOARD*',
        '',
        `Sumber: ${webUrl.source() || 'belum diatur'}`,
        `URL: ${base || '-'}` ,
        `Tautan: ${webUrl.dashboardLink(base) || '-'}`,
        '',
        `Atur: ${prefix}auto-web set https://nama-project.vercel.app`,
      ].join('\n'))
    }

    if (sub) return reply(`Subperintah tidak dikenali: ${sub}\n\n${help(prefix)}`)

    const base = webUrl.get()
    if (!base) {
      return reply([
        '🌐 *AUTO WEB*',
        '',
        'URL dashboard belum diatur.',
        '',
        `Atur dari WhatsApp: ${prefix}auto-web set https://nama-project.vercel.app`,
        'Atau isi DASHBOARD_PUBLIC_URL di .env lalu restart bot.',
        '',
        'Setelah Vercel deploy, URL biasanya https://<nama-project>.vercel.app',
      ].join('\n'))
    }
    return reply([
      '🌐 *DASHBOARD AUTO PENGUMUMAN*',
      '',
      webUrl.dashboardLink(base),
      '',
      'Login memakai password admin yang diset di VPS (DASHBOARD_PASSWORD).',
      'Kelola draft, gambar, jadwal, template, riwayat, dan retry dari dashboard ini.',
      'Dashboard memakai sesi WhatsApp dan database yang SAMA dengan bot — bukan koneksi kedua.',
      'Jangan bagikan tautan atau password ini ke orang lain.',
      '',
      `Ubah URL: ${prefix}auto-web set <url> | cek: ${prefix}auto-web status`,
    ].join('\n'))
  },
}
