// anime/fotorandom002 — satu file: metadata + kode fitur (gabungan dari engine7/plugins/anime/fotorandom002.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "fotorandom002",
  "command": [
    "fotorandom002",
    "randomfotozero"
  ],
  "category": "anime",
  "desc": "WhatsApp Bot random image 💗",
  "usage": ".randomfotozero",
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
module.exports = __vx.plugin("anime/fotorandom002", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/fotorandom002.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const fs = __vxDef(require("fs"));
  const path = __vxDef(require("path"));
  
  const pluginConfig = {
    name: 'fotorandom002',
    alias: ['randomfotozero'],
    category: 'anime',
    description: 'WhatsApp Bot random image 💗',
    usage: '.randomfotozero',
    isEnabled: true,
    cooldown: 5
  }
  
  async function handler(m, { sock }) {
  
  const folderPath = path.join(process.cwd(), 'assets', 'foto-vanxone-random')
  
  // cek folder
  if (!fs.existsSync(folderPath)) {
      return m.reply('❌ Folder WhatsApp Bot belum ada, darling...')
  }
  
  // ambil file
  const files = fs.readdirSync(folderPath)
  
  const images = files.filter(file =>
      file.endsWith('.jpg') ||
      file.endsWith('.jpeg') ||
      file.endsWith('.png') ||
      file.endsWith('.webp')
  )
  
  // kalau kosong
  if (images.length === 0) {
      return m.reply('📂 Foto WhatsApp Bot masih kosong... aku jadi kesepian 😢')
  }
  
  // random file
  const randomFile = images[Math.floor(Math.random() * images.length)]
  const filePath = path.join(folderPath, randomFile)
  
  // 💗 caption random ala WhatsApp Bot
  const captions = [
  "Darling… kamu manggil aku? 😈",
  "Aku cuma punya kamu loh 💕",
  "Jangan liat yang lain ya… aku cemburu 😠",
  "Ara ara~ kamu suka aku ya? 😏",
  "Aku cantik hari ini kan? 💗",
  "Kamu gak bakal ninggalin aku kan...? 🥺",
  "Kalo kamu pergi… aku marah 😈🔥"
  ]
  
  const randomCaption = captions[Math.floor(Math.random() * captions.length)]
  
  // 💫 react dulu biar hidup
  await m.react('💗')
  
  // kirim
  await sock.sendMessage(m.chat, {
  image: fs.readFileSync(filePath),
  caption: `╭━━━〔 💗 WhatsApp Bot RANDOM 💗 〕━━━⬣
  ┃
  ┃ ${randomCaption}
  ┃
  ┃ 📸 File : ${randomFile}
  ┃ 💞 Mode : Waifu Active
  ┃
  ╰━━━━━━━━━━━━━━━━━━⬣`
  }, { quoted: m })
  
  }
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
