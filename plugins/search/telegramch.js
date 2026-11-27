// search/telegramch — satu file: metadata + kode fitur (gabungan dari engine7/plugins/search/telegramch.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "tgram",
  "command": [
    "tgram"
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
module.exports = __vx.plugin("search/telegramch", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/telegramch.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxNs = (m) => (m && m.__esModule ? m : (m !== null && (typeof m === 'object' || typeof m === 'function') ? Object.assign(Object.create(null), m, { default: m }) : { default: m }));
  const __vxExports = {};
  const FEATURE_CREDIT = "Fitur by: Owner Bot";
  
  
  // Telegram Chanel Search 
  // Type Plugins ESM 
  
  // Source Scrape : 
  const axios = __vxDef(require("axios"));
  const cheerio = __vxNs(require("cheerio"));
  
  async function getRealTelegramLink(joinUrl) {
    try {
      const { data } = await axios.get(joinUrl, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36"
        }
      })
      const $ = cheerio.load(data)
      const realLink = $('a[href^="tg://resolve"]').attr("href")
      if (realLink) {
        const username = realLink.split("tg://resolve?domain=")[1]
        return `https://t.me/${username}`
      }
    } catch (e) {
      console.error(`Gagal ambil link asli: ${e.message}`)
    }
    return joinUrl
  }
  
  async function searchTelegramChannels(query) {
    try {
      const url = `https://en.tgramsearch.com/search?query=${encodeURIComponent(query)}`
      const { data } = await axios.get(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, seperti Gecko) Chrome/113.0.0.0 Safari/537.36"
        }
      })
      const $ = cheerio.load(data)
      const results = []
  
      for (const el of $(".tg-channel-wrapper").toArray()) {
        const name = $(el).find(".tg-channel-link a").text().trim()
        let link = $(el).find(".tg-channel-link a").attr("href")
        const image = $(el).find(".tg-channel-img img").attr("src")
        const members = $(el).find(".tg-user-count").text().trim()
        const description = $(el).find(".tg-channel-description").text().trim()
        const category = $(el).find(".tg-channel-categories a").text().trim()
  
        if (link?.startsWith("/join/")) {
          link = await getRealTelegramLink(`https://en.tgramsearch.com${link}`)
        } else if (link?.startsWith("tg://resolve?domain=")) {
          const username = link.split("tg://resolve?domain=")[1]
          link = `https://t.me/${username}`
        }
  
        results.push({ name, link, image, members, description, category })
      }
  
      return results
    } catch (err) {
      console.error(`Error scraping: ${err.message}`)
      return []
    }
  }
  
  const pluginConfig = {
    name: "tgram",
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
  
  async function handler(m, { text, prefix, command }) {
      const usedPrefix = prefix || m.prefix || ".";
    if (!text) throw `Contoh:\n${usedPrefix + command} anime`
  
    m.reply(`🔍 Sedang mencari channel Telegram untuk kata kunci: *${text}*...`)
  
    const results = await searchTelegramChannels(text)
    if (!results.length) throw `Tidak ada hasil untuk kata kunci: *${text}*`
  
    let output = `📢 Hasil pencarian untuk *${text}*:\n`
    results.slice(0, 10).forEach((item, i) => {
      output += `\n${i + 1}. *${item.name}*\n`
      output += `   👥 ${item.members}\n`
      output += `   🏷️ ${item.category || '-'}\n`
      output += `   📝 ${item.description || '-'}\n`
      output += `   🔗 ${item.link}\n`
    })
  
    m.reply(output)
  }
  
  
  
  Object.defineProperty(__vxExports, "FEATURE_CREDIT", { enumerable: true, get: () => FEATURE_CREDIT });
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
