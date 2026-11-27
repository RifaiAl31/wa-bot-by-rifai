// Menerima jawaban wizard .add (teks biasa DAN file tanpa caption) sebelum parser perintah.
const flow = require('../../lib/announcementFlow')

module.exports = {
  name: 'pengumuman-flow-hook',
  hook: true,
  passive: (ctx) => flow.passive(ctx),
}
