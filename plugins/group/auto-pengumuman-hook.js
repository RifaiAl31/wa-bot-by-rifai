// Menerima jawaban wizard .auto-pengumuman (pesan biasa tanpa titik).
'use strict'
const flow = require('../../lib/autoAnnouncementFlow')

module.exports = {
  name: 'auto-pengumuman-hook',
  hook: true,
  passive: (ctx) => flow.passive(ctx),
}
