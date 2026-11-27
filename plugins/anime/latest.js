// anime/latest — satu file: metadata + kode fitur (gabungan dari engine7/plugins/anime/latest.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "animelatest",
  "command": [
    "animelatest",
    "latestanime"
  ],
  "category": "anime",
  "desc": "Imported from WhatsApp Bot V4.6",
  "usage": "",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 3,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/anime").split('\\').join('/')
module.exports = __vx.plugin("anime/latest", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/latest.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const FEATURE_CREDIT = "Fitur by: Owner Bot";
  
  
  const fetch = __vxDef(require("node-fetch"));
  
  const pluginConfig = {
    name: "animelatest",
    alias: ["latestanime"],
    category: "anime",
    description: "Imported from WhatsApp Bot V4.6",
    usage: "",
    example: "",
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 3,
    energi: 1,
    isEnabled: true,
  };
  
  async function handler(m, { sock }) {
      const conn = sock;
    try {
      const res = await fetch('https://api.sansekai.my.id/api/anime/latest')
      const data = await res.json()
  
      if (!data.length) throw 'Anime tidak ditemukan.'
  
      let teks = `🎌 *ANIME TERBARU*\n\n`
  
      data.forEach((anime, i) => {
        teks += `*${i + 1}. ${anime.judul}*\n`
        teks += `📺 Episode : ${anime.lastch}\n`
        teks += `🕒 Update  : ${anime.lastup}\n`
        teks += `🔗 Link    : https://sansekai.my.id/anime/${anime.url}\n\n`
      })
  
      await conn.sendFile(
        m.chat,
        data[0].cover,
        'anime.jpg',
        teks,
        m
      )
  
    } catch (e) {
      m.reply('❌ Gagal mengambil data anime terbaru')
    }
  }
  
  
  
  Object.defineProperty(__vxExports, "FEATURE_CREDIT", { enumerable: true, get: () => FEATURE_CREDIT });
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
