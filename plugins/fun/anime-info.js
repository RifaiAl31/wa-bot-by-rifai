// anime/anime-info — satu file: metadata + kode fitur (gabungan dari engine2/plugins/anime/anime-info.js)
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "animeinfo"
  ],
  "category": "fun",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur animeinfo (dari Bot package)"
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/anime").split('\\').join('/')
module.exports = __vx.plugin("anime/anime-info", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/anime-info.js'
  const __vxExports = {};
  
  var handler = async (m, { conn, text }) => {
      if (!text) throw `*Masukan Judul Anime Yang Ingin Kamu Cari !*`;
  
      let res = await fetch('https://api.jikan.moe/v4/anime?q=' + text);
  
      if (!res.ok) throw 'Tidak Ditemukan';
  
      let json = await res.json();
      let animeData = json.data[0];
  
      if (!animeData) throw 'Anime tidak ditemukan.';
  
      let {
          title_japanese,
          url,
          type,
          score,
          members,
          status,
          synopsis,
          favorites,
          images,
          genres,
      } = animeData;
  
      let genreList = genres.map((genre) => genre.name).join(', ');
  
      let animeingfo = `
  Title: ${title_japanese}
  Type: ${type}
  Genres: ${genreList}
  Score: ${score}
  Members: ${members}
  Status: ${status}
  Favorites: ${favorites}
  URL: ${url}
  Synopsis: ${synopsis}
  `;
  
      conn.sendFile(m.chat, images.jpg.image_url, 'anjime.jpg', `*ANIME INFO*\n` + animeingfo, m);
  };
  
  handler.help = ['animeinfo <anime>'];
  handler.tags = ['internet'];
  handler.command = /^(animeinfo)$/i;
  
  handler.register = true
  
  const __vxDefault = handler
  
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})
