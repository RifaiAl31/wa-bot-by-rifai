// rich/ytlive — YouTube LIVE: cari & PUTAR video/lagu langsung di kartu WhatsApp (media ditanam di kartu, tanpa tunnel/server relay)
const { ytLive } = require('../../lib/livecmd')
module.exports = {
  name: 'ytlive', command: ['ytlive'], category: 'rich', desc: 'Cari & putar video/lagu YouTube langsung di kartu WhatsApp',
  usage: '<judul|link>  |  audio <judul>', run: (ctx) => ytLive(ctx)
}
