// .uimode — pilih tampilan bot: rich (kartu RICH HTML asli, tampil otomatis) atau text (balasan teks biasa)
const uimode = require('../../lib/uimode')
const theme = require('../../lib/theme')
const { panel } = require('../../lib/uitext')

module.exports = {
  name: 'uimode',
  command: ['uimode', 'modetampilan', 'tampilanbot'],
  category: 'info',
  emoji: '🎛️',
  desc: 'Lihat / ganti tampilan bot: rich (kartu HTML) atau text',
  usage: 'rich | text',
  run: async ({ args, prefix, reply, isOwner }) => {
    const now = uimode.get()
    const sub = (args[0] || '').toLowerCase()

    if (!sub) {
      return reply(
        panel('MODE TAMPILAN', [
          {
            head: '🎛️ *SAAT INI*',
            lines: [
              `Mode: ${now.toUpperCase()}${uimode.isNative() ? ' (rich HTML asli, tanpa gambar)' : ''}`,
              `Tema kartu: ${theme.rich().emoji} ${theme.rich().name}`
            ]
          },
          {
            head: '📖 *PILIHAN*',
            lines: [
              `${prefix}uimode rich  — semua balasan & menu jadi kartu RICH HTML (tampil otomatis, tanpa tombol Unduh)`,
              `${prefix}uimode text  — balasan teks biasa`,
              `${prefix}tema  — ganti tema warna kartu (bawaan: Koboy Noir)`
            ],
            plain: true
          }
        ])
      )
    }

    if (!isOwner) return reply('Hanya owner yang boleh mengganti mode tampilan.')
    const m = uimode.set(sub)
    if (!m) return reply(`Pilihan tidak dikenal "${sub}". Pakai: ${prefix}uimode rich  atau  ${prefix}uimode text`)
    return reply(
      panel('MODE TAMPILAN DIUBAH', [
        { head: '✅ *AKTIF*', lines: [m === 'rich' ? 'RICH — kartu HTML asli, tampil otomatis' : 'TEXT — balasan teks biasa'] },
        { head: '💡 *LANGKAH*', lines: [`Ketik ${prefix}menu untuk melihat hasilnya`, 'Berlaku langsung, tanpa restart'] }
      ])
    )
  }
}
