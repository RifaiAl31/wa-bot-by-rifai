// .kalender, .kalender minggu N, .kalender hari ini — satu kalender untuk teks dan media.
const flow = require('../../lib/announcementFlow')

module.exports = {
  name: 'pengumuman-kalender',
  command: ['kalender'],
  category: 'group',
  desc: 'Tampilkan kalender pengumuman teks dan media (admin)',
  usage: '.kalender [minggu 1-5 | hari ini]',
  needsInfo: true,
  run: async (ctx) => flow.calendarCommand(ctx),
}
