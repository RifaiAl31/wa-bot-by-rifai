// image/uhdpaper — satu file: metadata + kode fitur (gabungan dari engine7/plugins/image/uhdpaper.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "uhdpaper",
  "command": [
    "uhdpaper"
  ],
  "category": "image",
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
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/image").split('\\').join('/')
module.exports = __vx.plugin("image/uhdpaper", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/uhdpaper.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxNs = (m) => (m && m.__esModule ? m : (m !== null && (typeof m === 'object' || typeof m === 'function') ? Object.assign(Object.create(null), m, { default: m }) : { default: m }));
  const __vxExports = {};
  const FEATURE_CREDIT = "Fitur by: Owner Bot";
  
  
  const axios = __vxDef(require("axios"));
  const cheerio = __vxNs(require("cheerio"));
  
  async function UhdpaperSearch(query) {
    try {
      const response = await axios.get(`https://www.uhdpaper.com/search?q=${encodeURIComponent(query)}&by-date=true&i=0`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
        }
      })
      const html = response.data
      const $ = cheerio.load(html)
      const results = []
  
      $('article.post-outer-container').each((_, element) => {
        const title = $(element).find('.snippet-title h2').text().trim()
        const imageUrl = $(element).find('.snippet-title img').attr('src')
        const resolution = $(element).find('.wp_box b').text().trim()
        const link = $(element).find('a').attr('href')
  
        if (title && imageUrl && resolution && link) {
          results.push({ title, imageUrl, resolution, link })
        }
      })
  
      return results
    } catch (error) {
      console.error('Error scraping UHDPaper:', error.message)
      return []
    }
  }
  
  const pluginConfig = {
    name: "uhdpaper",
    alias: [],
    category: "image",
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
  
  async function handler(m, { sock, text, prefix, command }) {
      const conn = sock;
      const usedPrefix = prefix || m.prefix || ".";
    if (!text) throw `Contoh:\n${usedPrefix + command} naruto`
  
    let results = await UhdpaperSearch(text)
    if (results.length === 0) throw 'Wallpaper tidak ditemukan!'
  
    let list = results.map((v, i) => `*${i + 1}. ${v.title}*\n📏 *Resolusi:* ${v.resolution}\n🔗 ${v.link}`).join`\n\n`
  
    await conn.sendMessage(m.chat, { text: `*Hasil Pencarian UHDPaper: ${text}*\n\n${list}` }, { quoted: m })
  }
  
  
  
  Object.defineProperty(__vxExports, "FEATURE_CREDIT", { enumerable: true, get: () => FEATURE_CREDIT });
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
