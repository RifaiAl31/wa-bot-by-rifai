// anime/anime-random — satu file: metadata + kode fitur (gabungan dari engine2/plugins/anime/anime-random.js)
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "animerandom"
  ],
  "category": "fun",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur animerandom (dari Bot package)"
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/anime").split('\\').join('/')
module.exports = __vx.plugin("anime/anime-random", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/anime-random.js'
  const __vxExports = {};
  
  let handler = async (m, { conn }) => {
    try {
      let res = await fetch('https://lance-frank-asta.onrender.com/api/anime-random')
      let data = await res.json()
  
      if (!data.status) throw `❌ Gagal ambil data anime.`
  
      let info = data.random
      let caption = `🎌 *Anime Random*
  
  🆔 ID: ${info.ID}
  👤 Nama: ${info.name}
  🎬 Movie: ${info.movie}`
  
      await conn.sendFile(m.chat, info.imgAnime, 'anime.jpg', caption, m)
    } catch (e) {
      console.error(e)
      throw `❌ Error mengambil data Anime!`
    }
  }
  
  handler.help = ['animerandom']
  handler.tags = ['anime']
  handler.command = /^animerandom$/i
  handler.limit = true
  
  const __vxDefault = handler
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})
