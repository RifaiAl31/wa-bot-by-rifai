// rich/ttlive — TikTok LIVE: cari & TONTON video TikTok langsung di kartu WhatsApp (video ditanam di kartu)
const { ttLive } = require('../../lib/livecmd')
module.exports = {
  name: 'ttlive', command: ['ttlive', 'tiktoklive'], category: 'rich', desc: 'Cari & tonton video TikTok langsung di kartu WhatsApp',
  usage: '<kata kunci|link tiktok>', run: (ctx) => ttLive(ctx)
}
