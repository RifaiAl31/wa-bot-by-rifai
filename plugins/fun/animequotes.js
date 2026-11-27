// anime/animequotes — satu file: metadata + kode fitur (gabungan dari engine2/plugins/anime/animequotes.js)
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "animequotes"
  ],
  "category": "fun",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur animequotes (dari Bot package)"
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/anime").split('\\').join('/')
module.exports = __vx.plugin("anime/animequotes", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/animequotes.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxNs = (m) => (m && m.__esModule ? m : (m !== null && (typeof m === 'object' || typeof m === 'function') ? Object.assign(Object.create(null), m, { default: m }) : { default: m }));
  const __vxExports = {};
  const axios = __vxDef(require("axios"));
  const cheerio = __vxNs(require("cheerio"));
  
  async function animequote() {
    try {
      const page = Math.floor(Math.random() * 184)
      const { data } = await axios.get('https://otakotaku.com/quote/feed/' + page)
      const $ = cheerio.load(data)
  
      const kotodamaLinks = $('div.kotodama-list').map((i, el) => {
        return $(el).find('a.kuroi').attr('href')
      }).get()
  
      const results = await Promise.all(kotodamaLinks.map(async (url) => {
        const { data: quote } = await axios.get(url)
        const $q = cheerio.load(quote)
  
        return {
          char: $q('.char-info .tebal a[href*="/character/"]').text().trim(),
          from_anime: $q('.char-info a[href*="/anime/"]').text().trim(),
          episode: $q('.char-info span.meta').text().trim().replace('- ', ''),
          quote: $q('.post-content blockquote p').text().trim()
        }
      }))
  
      return results
    } catch (error) {
      throw new Error(error.message)
    }
  }
  
  let handler = async (m, { conn }) => {
    try {
      let data = await animequote()
      let res = data[Math.floor(Math.random() * data.length)]
  
      let txt = `╔═══ ❖ • ✦ • ❖ ═══╗
        🌸 *ANIME QUOTES* 🌸
  ╚═══ ❖ • ✦ • ❖ ═══╝
  
  👤 *Karakter* : ${res.char || '-'}
  🎬 *Anime* : ${res.from_anime || '-'}
  📺 *Episode* : ${res.episode || '-'}
  
  💭 ❝ ${res.quote || '-'} ❞`
  
      await conn.reply(m.chat, txt, m)
    } catch (e) {
      await conn.reply(m.chat, '⚠️ Gagal mengambil quote anime, coba lagi ya~', m)
    }
  }
  
  handler.help = ['animequotes']
  handler.tags = ['anime']
  handler.command = /^animequotes$/i
  handler.limit = false
  
  const __vxDefault = handler
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})
