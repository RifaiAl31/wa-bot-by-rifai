// search/infoloker — satu file: metadata + kode fitur (gabungan dari engine7/plugins/search/infoloker.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "infoloker",
  "command": [
    "infoloker"
  ],
  "category": "search",
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
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/search").split('\\').join('/')
module.exports = __vx.plugin("search/infoloker", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/infoloker.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxNs = (m) => (m && m.__esModule ? m : (m !== null && (typeof m === 'object' || typeof m === 'function') ? Object.assign(Object.create(null), m, { default: m }) : { default: m }));
  const __vxExports = {};
  const FEATURE_CREDIT = "Fitur by: Owner Bot";
  
  
  const cheerio = __vxNs(require("cheerio"));
  const fetch = __vxDef(require("node-fetch"));
  
  const pluginConfig = {
    name: "infoloker",
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
    energi: 1,
    isEnabled: true,
  };
  
  async function handler(m, { sock, args, prefix, text, command }) {
      const conn = sock;
      const usedPrefix = prefix || m.prefix || ".";
      if (!text) return m.reply("Input query\nExample: .infoloker programmer")
      await m.reply(wait)
      try {
          let res = await infoloker(text);
          res = res.slice(0, 11);
          let teks = res.map((item, index) => {
              return `
  🔍 *[ RESULT ${index + 1} ]*
  📰 *Title:* ${item.job || 'Tidak diketahui'}
  🏢 *Perusahaan:* ${item.perusahaan || 'Tidak diketahui'}
  📍 *Daerah:* ${item.daerah || 'Tidak diketahui'}
  🔗 *Link Detail:* ${item.link_Detail || 'Tidak diketahui'}
  ⬆️ *Upload:* ${item.upload || 'Tidak diketahui'}
  `;
          }).filter(v => v).join("\n\n________________________\n\n");
          await m.reply(teks)
      } catch (e) {
          await m.reply(eror)
      }
  };
  handler.register = true
  
  /* New Line */
  async function infoloker(query) {
      const url = `https://www.jobstreet.co.id/id/job-search/${query}-jobs/`;
      const response = await fetch(url);
      const html = await response.text();
  
      const $ = cheerio.load(html);
      const format = [];
  
      $('article').each((a, article) => {
          const job = $(article).find('h1 a div').text();
          const perusahaan = $(article).find('span').eq(0).text();
          const daerah = $(article).find('span span').text();
          const link_Detail = 'https://www.jobstreet.co.id' + $(article).find('h1 a').attr('href');
          const upload = $(article).find('div > time > span').text();
  
          format.push({ job, perusahaan, daerah, upload, link_Detail });
      });
  
      return format;
  }
  
  
  
  Object.defineProperty(__vxExports, "FEATURE_CREDIT", { enumerable: true, get: () => FEATURE_CREDIT });
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
