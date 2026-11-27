// search/dramabox — satu file: metadata + kode fitur (gabungan dari engine1/plugins/search/dramabox.js)
const __vx = require("../../lib/adapter/e1.js")
const __meta = {
  "name": "dramabox",
  "command": [
    "dramabox",
    "drama",
    "dramasearch"
  ],
  "category": "search",
  "desc": "Cari drama di DramaBox",
  "usage": ".dramabox <query>",
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
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/search").split('\\').join('/')
module.exports = __vx.plugin("search/dramabox", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/dramabox.js'
  const module = { exports: {} }; const exports = module.exports;
  const dramaboxsearch = require("../../lib/ext/src/scraper/dramabox.js")
  
  const pluginConfig = {
      name: 'dramabox',
      alias: ['drama', 'dramasearch'],
      category: 'search',
      description: 'Cari drama di DramaBox',
      usage: '.dramabox <query>',
      example: '.dramabox billionaire',
      isOwner: false,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 5,
      energi: 0,
      isEnabled: true
  }
  
  async function handler(m, { sock }) {
      const query = m.text?.trim()
      
      if (!query) {
          return m.reply(
              `⚠️ *ᴄᴀʀᴀ ᴘᴀᴋᴀɪ*\n\n` +
              `> \`${m.prefix}dramabox <query>\`\n\n` +
              `> Contoh:\n` +
              `> \`${m.prefix}dramabox billionaire\``
          )
      }
      
      try {
          const data = await dramaboxsearch(query)
          
          if (data.status === 'eror' || !data.results?.length) {
              return m.reply(`❌ *Ehh~* Tidak ditemukan drama untuk: ${query} 🥺`)
          }
          
          const dramas = data.results.slice(0, 5)
          
          let txt = `🎬 *ᴅʀᴀᴍᴀʙᴏx sᴇᴀʀᴄʜ*\n\n`
          txt += `╭┈┈⬡「 🔍 *ɪɴꜰᴏ* 」\n`
          txt += `┃ 🔎 ǫᴜᴇʀʏ: *${query}*\n`
          txt += `┃ 📊 ᴛᴏᴛᴀʟ: *${data.total} hasil*\n`
          txt += `╰┈┈⬡\n\n`
          
          dramas.forEach((d, i) => {
              const desc = d.description?.substring(0, 80) || '-'
              txt += `╭┈┈⬡「 🎭 *${i + 1}* 」\n`
              txt += `┃ 📛 \`\`\`${d.title}\`\`\`\n`
              txt += `┃ 📺 ᴇᴘɪsᴏᴅᴇs: *${d.episodes || 0}*\n`
              txt += `┃ 📝 ${desc}${d.description?.length > 80 ? '...' : ''}\n`
              txt += `┃ 🔗 \`${d.play_url}\`\n`
              txt += `╰┈┈⬡\n\n`
          })
          
          return m.reply(txt.trim())
          
      } catch (err) {
          return m.reply(`❌ *Gomen ne~* ✦\n\n> ${err.message}\n\n_Ai udah coba yang terbaik tapi gagal juga... coba lagi nanti ya~ 🌸_`)
      }
  }
  
  module.exports = {
      config: pluginConfig,
      handler
  }
  
  return module.exports
})
