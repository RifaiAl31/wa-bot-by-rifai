// sticker/megami — satu file: metadata + kode fitur (gabungan dari engine7/plugins/sticker/megami.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "ryo",
  "command": [
    "ryo"
  ],
  "category": "sticker",
  "desc": "Imported from WhatsApp Bot V4.6",
  "usage": "",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 3,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/sticker").split('\\').join('/')
module.exports = __vx.plugin("sticker/megami", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/megami.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const FEATURE_CREDIT = "Fitur by: Owner Bot";
  
  
  const fetch = __vxDef(require("node-fetch"));
  
  const pluginConfig = {
    name: "ryo",
    alias: [],
    category: "sticker",
    description: "Imported from WhatsApp Bot V4.6",
    usage: "",
    example: "",
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 3,
    energi: 0,
    isEnabled: true,
  };
  
  async function handler(m, { sock }) {
      const conn = sock;
    let stickerList = [
      'https://files.catbox.moe/3udphi.webp',
      'https://files.catbox.moe/2ul4l6.webp',
      'https://files.catbox.moe/qvevks.webp',
      'https://files.catbox.moe/4oauqp.webp',
      'https://files.catbox.moe/86s1m1.webp',
      'https://files.catbox.moe/0qargw.webp',
      'https://files.catbox.moe/qw2dac.webp',
      'https://files.catbox.moe/v0yv1f.webp',
      'https://files.catbox.moe/b2dx8u.webp',
      'https://files.catbox.moe/omnw8w.webp'
    ]
  
    // Pilih 1 random dari list
    let url = stickerList[Math.floor(Math.random() * stickerList.length)]
  
    try {
      let buffer = await fetch(url).then(res => res.buffer())
      await conn.sendFile(m.chat, buffer, 'sticker.webp', '', m, { asSticker: true })
    } catch (e) {
      console.error('Gagal kirim stiker:', e)
    }
  }
  
  
  
  Object.defineProperty(__vxExports, "FEATURE_CREDIT", { enumerable: true, get: () => FEATURE_CREDIT });
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
