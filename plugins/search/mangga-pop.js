// search/mangga-pop — satu file: metadata + kode fitur (gabungan dari engine7/plugins/search/mangga-pop.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "mangalist",
  "command": [
    "mangalist"
  ],
  "category": "search",
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
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/search").split('\\').join('/')
module.exports = __vx.plugin("search/mangga-pop", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/mangga-pop.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxNs = (m) => (m && m.__esModule ? m : (m !== null && (typeof m === 'object' || typeof m === 'function') ? Object.assign(Object.create(null), m, { default: m }) : { default: m }));
  const __vxExports = {};
  const FEATURE_CREDIT = "Fitur by: Owner Bot";
  
  
  const fetch = __vxDef(require("node-fetch"));
  const cheerio = __vxNs(require("cheerio"));
  
  // Ini Scrape Nya
  async function fetchMangaList() {
      try {
          const url = "https://natsu.id";
          const response = await fetch(url);
  
          if (!response.ok) {
              throw new Error(`Gagal mengambil data dari ${url}, status: ${response.status}`);
          }
  
          const html = await response.text();
          const $ = cheerio.load(html);
  
          const mangaList = [];
  
          $(".listupd.popularslider .bs").each((_, element) => {
              const title = $(element).find(".bigor .tt").text().trim();
              const chapter = $(element).find(".bigor .epxs").text().trim();
              const rating = $(element).find(".bigor .numscore").text().trim();
              const link = $(element).find("a").attr("href");
              const image = $(element).find("img").attr("src");
  
              if (title && link) { 
                  mangaList.push({
                      title,
                      chapter,
                      rating,
                      link,
                      image,
                  });
              }
          });
  
          return mangaList;
      } catch (error) {
          console.error(`Error: ${error.message}`);
          return [];
      }
  }
  //Batas Scrape 
  
  const pluginConfig = {
    name: "mangalist",
    alias: [],
    category: "search",
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
  
  const handler = async (m, { conn }) => {
      m.reply('Please Wait....');
      const mangaList = await fetchMangaList();
  
      if (mangaList.length === 0) {
          return m.reply('❌ Gagal mengambil daftar manga. Silakan coba lagi nanti.');
      }
  
      for (const manga of mangaList.slice(0, 5)) { //Max Mengirim 5 (Ubah Sendiri Juga Bisa)
          const caption = `
  📖 *${manga.title}*
  📄 Chapter: ${manga.chapter}
  ⭐ Rating: ${manga.rating || 'N/A'}
  🔗 Link: ${manga.link}
          `.trim();
  
          
          await conn.sendMessage(
              m.chat,
              {
                  image: { url: manga.image }, 
                  caption: caption, 
              },
              { quoted: m }
          );
      }
  
      m.reply('');
  };
  
  
  
  Object.defineProperty(__vxExports, "FEATURE_CREDIT", { enumerable: true, get: () => FEATURE_CREDIT });
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
