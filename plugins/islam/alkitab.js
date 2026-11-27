// religi/alkitab — satu file: metadata + kode fitur (gabungan dari engine7/plugins/religi/alkitab.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "alkitab",
  "command": [
    "alkitab"
  ],
  "category": "islam",
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
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/religi").split('\\').join('/')
module.exports = __vx.plugin("religi/alkitab", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/alkitab.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxNs = (m) => (m && m.__esModule ? m : (m !== null && (typeof m === 'object' || typeof m === 'function') ? Object.assign(Object.create(null), m, { default: m }) : { default: m }));
  const __vxExports = {};
  const FEATURE_CREDIT = "Fitur by: Owner Bot";
  
  
  const fetch = __vxDef(require("node-fetch"));
  const axios = __vxDef(require("axios"));
  const cheerio = __vxNs(require("cheerio"));
   const pluginConfig = {
    name: "alkitab",
    alias: [],
    category: "religi",
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
  
  async function handler(m, { text, prefix, command }) {
      const usedPrefix = prefix || m.prefix || "."; 
       if (!text) throw `uhm.. teksnya mana?\n\ncontoh:\n${usedPrefix + command} kejadian` 
       let res = await axios.get(`https://alkitab.me/search?q=${encodeURIComponent(text)}`, { headers: { "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36" } }) 
    
       let $ = cheerio.load(res.data) 
       let result = [] 
       $('div.vw').each(function (a, b) { 
           let teks = $(b).find('p').text().trim() 
           let link = $(b).find('a').attr('href') 
           let title = $(b).find('a').text().trim() 
           result.push({ teks, link, title }) 
       }) 
   
     let foto = 'https://telegra.ph/file/a333442553b1bc336cc55.jpg'
     let judul = '*────────「 Alkitab 」 ────────*'
       let caption = result.map(v => `💌 ${v.title}\n📮 ${v.teks}`).join('\n┄┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┄\n') 
        conn.sendFile(m.chat, foto, 'alkitab.jpg', `${judul}\n\n${caption}`, m)
   }
  
  
  
  Object.defineProperty(__vxExports, "FEATURE_CREDIT", { enumerable: true, get: () => FEATURE_CREDIT });
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
