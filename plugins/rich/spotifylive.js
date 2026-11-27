// rich/spotifylive — Spotify LIVE: cari & PUTAR lagu langsung di kartu WhatsApp + lirik sinkron (audio ditanam di kartu)
const { spotifyLive } = require('../../lib/livecmd')
module.exports = {
  name: 'spotifylive', command: ['spotifylive', 'spotlive'], category: 'rich', desc: 'Cari & putar lagu Spotify langsung di kartu WhatsApp',
  usage: '<judul lagu|link track>', run: (ctx) => spotifyLive(ctx)
}
