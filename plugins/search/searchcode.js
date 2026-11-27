// search/searchcode — satu file: metadata + kode fitur (gabungan dari engine7/plugins/search/searchcode.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "searchcode",
  "command": [
    "searchcode"
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
module.exports = __vx.plugin("search/searchcode", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/searchcode.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxNs = (m) => (m && m.__esModule ? m : (m !== null && (typeof m === 'object' || typeof m === 'function') ? Object.assign(Object.create(null), m, { default: m }) : { default: m }));
  const __vxExports = {};
  const FEATURE_CREDIT = "Fitur by: Owner Bot";
  
  
  /*
  Search Code 
  Desk : Search code dari https://codeshare.cloudku.click
  Type : Plugin ESM 
  Source Scrape : 
  */
  const axios = __vxDef(require("axios"));
  const cheerio = __vxNs(require("cheerio"));
  
  async function scrapeCodeSearch(query) {
    const url = `https://codeshare.cloudku.click/?q=${encodeURIComponent(query)}`
    const res = await axios.get(url)
    const $ = cheerio.load(res.data)
    const results = []
  
    const cards = $('.snippet-card').toArray()
  
    for (const el of cards) {
      const card = $(el)
      const title = card.find('.card-title a').text().trim()
      const path = card.find('.card-title a').attr('href')
      const link = 'https://codeshare.cloudku.click' + path
      const author = card.find('.card-user .user-info').text().trim()
      const views = parseInt(card.find('.meta-item').first().text().replace(/\D/g, '')) || 0
      const languageIcon = card.find('.meta-item i').attr('class') || ''
      const language = languageIcon.split('-').pop().replace('plain', '') || 'unknown'
  
      results.push({ title, author, views, language, link })
    }
  
    return {
      status: 200,
      total: results.length,
      data: results
    }
  }
  
  const pluginConfig = {
    name: "searchcode",
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
  
  async function handler(m, { text, prefix, command }) {
      const usedPrefix = prefix || m.prefix || ".";
    if (!text) throw `Contoh:\n${usedPrefix + command} downloader tiktok `
  
    let res = await scrapeCodeSearch(text)
    if (!res.data.length) throw 'Tidak ada hasil ditemukan.'
  
    let teks = res.data.slice(0, 5).map((v, i) => {
      return `*${i + 1}. ${v.title}*\n👤 ${v.author}\n💻 ${v.language}\n👁 ${v.views} views\n🔗 ${v.link}`
    }).join`\n\n`
  
    await m.reply(`🔍 Hasil pencarian untuk: *${text}*\n\n${teks}`)
  }
  
  
  
  Object.defineProperty(__vxExports, "FEATURE_CREDIT", { enumerable: true, get: () => FEATURE_CREDIT });
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
