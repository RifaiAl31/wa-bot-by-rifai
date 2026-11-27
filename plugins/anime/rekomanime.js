// anime/rekomanime — satu file: metadata + kode fitur (gabungan dari engine7/plugins/anime/rekomanime.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "rekom-anime",
  "command": [
    "rekom-anime",
    "anime-rekom",
    "rekanime"
  ],
  "category": "anime",
  "desc": "Rekomendasi anime random",
  "usage": ".rekom-anime",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/anime").split('\\').join('/')
module.exports = __vx.plugin("anime/rekomanime", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/rekomanime.js'
  const __vxExports = {};
  const pluginConfig = {
      name: 'rekom-anime',
      alias: ['anime-rekom','rekanime'],
      category: 'anime',
      description: 'Rekomendasi anime random',
      usage: '.rekom-anime',
      example: '.rekom-anime',
      cooldown: 5,
      energi: 0,
      isEnabled: true
  }
  
  async function handler(m) {
  
  const list = [
  
  "Attack on Titan",
  "Death Note",
  "Fullmetal Alchemist Brotherhood",
  "Steins Gate",
  "Code Geass",
  "Hunter x Hunter",
  "Demon Slayer",
  "Jujutsu Kaisen",
  "Tokyo Ghoul",
  "One Punch Man",
  "Mob Psycho 100",
  "Vinland Saga",
  "Chainsaw Man",
  "Your Lie in April",
  "Clannad After Story",
  "Toradora",
  "Horimiya",
  "WhatsApp Bot-sama Love is War",
  "My Dress Up Darling",
  "Angel Beats",
  
  "No Game No Life",
  "Re Zero",
  "Sword Art Online",
  "Overlord",
  "Konosuba",
  "Tensei Slime",
  "Mushoku Tensei",
  "Log Horizon",
  "Shield Hero",
  "Dr Stone",
  
  "Made in Abyss",
  "Erased",
  "Parasyte",
  "Akame ga Kill",
  "Black Clover",
  "Blue Exorcist",
  "Noragami",
  "Fire Force",
  "Soul Eater",
  "Haikyuu",
  
  "Kuroko no Basket",
  "Blue Lock",
  "Yuri on Ice",
  "Sk8 the Infinity",
  "Free",
  "Initial D",
  "Megalo Box",
  "Ping Pong the Animation",
  "Run With The Wind",
  
  "Neon Genesis Evangelion",
  "Gurren Lagann",
  "86 Eighty Six",
  "Darling in the Franxx",
  "Aldnoah Zero",
  "Eureka Seven",
  "Gundam Iron Blooded Orphans",
  "SSSS Gridman",
  "Macross Frontier",
  
  "Bocchi the Rock",
  "Carole and Tuesday",
  "Vivy Fluorite Eye Song",
  "Zombieland Saga",
  "K-On",
  "Sound Euphonium",
  "Beck",
  "Nana",
  "Given",
  
  "Monster",
  "Berserk",
  "Fate Zero",
  "Fate Stay Night",
  "Fate Apocrypha",
  "Akudama Drive",
  "Cyberpunk Edgerunners",
  "Odd Taxi",
  "Great Pretender",
  "Bungo Stray Dogs",
  
  "Dorohedoro",
  "Heavenly Delusion",
  "Summertime Rendering",
  "Golden Kamuy",
  "Dororo",
  "Kabaneri of the Iron Fortress",
  "Seraph of the End",
  "The Promised Neverland",
  "Classroom of the Elite",
  "Tomodachi Game"
  
  ]
  
  const anime = list[Math.floor(Math.random()*list.length)]
  
  let text
  
  if (anime === "Darling in the Franxx") {
  
  m.react("😍")
  
  text =
  `╭━━━〔 💗 WhatsApp Bot FAVORITE 💗 〕━━⬣
  ┃
  ┃ EH?! DARLING!! 😳
  ┃
  ┃ WhatsApp Bot sangat merekomendasikan
  ┃ anime ini!!
  ┃
  ┃ 📺 Judul :
  ┃ ${anime}
  ┃
  ┃ Ini anime tentang
  ┃ *WhatsApp Bot* loh!! 💕
  ┃
  ┃ Darling wajib nonton!!
  ┃ SERIUS!! 😆✨
  ┃
  ┃ Nanti bilang ya
  ┃ WhatsApp Bot paling lucu 😏
  ┃
  ╰━━━━━━━━━━━━━━━━⬣`
  
  } else {
  
  m.react("✨")
  
  text =
  `╭━━━〔 🎌 REKOMENDASI ANIME 🎌 〕━━⬣
  ┃
  ┃ WhatsApp Bot punya
  ┃ rekomendasi anime nih~
  ┃
  ┃ 📺 Judul :
  ┃ ${anime}
  ┃
  ┃ Coba tonton ini ya
  ┃ darling 😋
  ┃
  ╰━━━━━━━━━━━━━━━━⬣`
  
  }
  
  m.reply(text)
  
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
