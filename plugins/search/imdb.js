// search/imdb — satu file: metadata + kode fitur (gabungan dari engine7/plugins/search/imdb.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "imdb",
  "command": [
    "imdb",
    "imdbinfo"
  ],
  "category": "search",
  "desc": "Cari detail film atau serial dari IMDb/OMDb",
  "usage": ".imdb <judul>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 10,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/search").split('\\').join('/')
module.exports = __vx.plugin("search/imdb", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/imdb.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  /*
    Fitur tambahan hasil audit FURINA V17 → WhatsApp Bot.
  */
  
  const axios = __vxDef(require("axios"));
  
  const pluginConfig = {
      name: 'imdb',
      alias: ['imdbinfo'],
      category: 'search',
      description: 'Cari detail film atau serial dari IMDb/OMDb',
      usage: '.imdb <judul>',
      example: '.imdb Interstellar',
      cooldown: 10,
      energi: 1,
      isEnabled: true
  }
  
  const OMDB_ENDPOINT = 'https://www.omdbapi.com/'
  const OMDB_KEY = process.env.OMDB_API_KEY || globalThis.OMDB_API_KEY || ''
  
  async function handler(m) {
      const title = m.text?.trim()
      if (!title) return m.reply(`Contoh: ${m.prefix}imdb Interstellar`)
      if (!OMDB_KEY) return m.reply('❌ OMDb API key belum dikonfigurasi. Set `OMDB_API_KEY` terlebih dahulu.')
  
      try {
          m.react('🎬')
          const { data } = await axios.get(OMDB_ENDPOINT, {
              params: { apikey: OMDB_KEY, t: title, plot: 'full' },
              timeout: 15000
          })
          if (!data || data.Response === 'False') return m.reply(`❌ Film/serial *${title}* tidak ditemukan.`)
  
          const caption = [
              '🎬 *IMDb SEARCH*',
              '',
              `🎬 Title      : ${data.Title || '-'}`,
              `📅 Year       : ${data.Year || '-'}`,
              `⭐ Rated      : ${data.Rated || '-'}`,
              `📆 Released   : ${data.Released || '-'}`,
              `⏳ Runtime     : ${data.Runtime || '-'}`,
              `🌀 Genre      : ${data.Genre || '-'}`,
              `🎥 Director   : ${data.Director || '-'}`,
              `✍️ Writer     : ${data.Writer || '-'}`,
              `👥 Actors     : ${data.Actors || '-'}`,
              `🌐 Language   : ${data.Language || '-'}`,
              `🌍 Country    : ${data.Country || '-'}`,
              `🎖️ Awards      : ${data.Awards || '-'}`,
              `💵 BoxOffice  : ${data.BoxOffice || '-'}`,
              `⭐ IMDb       : ${data.imdbRating || '-'} (${data.imdbVotes || '0'} votes)`,
              '',
              `📃 *Plot:* ${data.Plot || '-'}`
          ].join('\n')
  
          if (data.Poster && data.Poster !== 'N/A') {
              await m.reply({ image: { url: data.Poster }, caption })
          } else {
              await m.reply(caption)
          }
          m.react('✅')
      } catch (error) {
          console.error('[imdb]', error)
          m.react('❌')
          return m.reply('❌ Gagal mengambil data OMDb.')
      }
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
