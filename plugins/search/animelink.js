// search/animelink — satu file: metadata + kode fitur (gabungan dari engine1/plugins/search/animelink.js)
const __vx = require("../../lib/adapter/e1.js")
const __meta = {
  "name": "animelink",
  "command": [
    "animelink"
  ],
  "category": "search",
  "desc": "Handler untuk link download anime",
  "usage": "Internal command",
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
module.exports = __vx.plugin("search/animelink", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/animelink.js'
  const module = { exports: {} }; const exports = module.exports;
  const config = require("../../lib/ext/config.js")
  
  const pluginConfig = {
      name: 'animelink',
      alias: [],
      category: 'search',
      description: 'Handler untuk link download anime',
      usage: 'Internal command',
      example: '',
      isOwner: false,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 5,
      energi: 0,
      isEnabled: true,
      isHidden: true
  }
  
  async function handler(m, { sock }) {
      const data = m.text?.trim()
      
      if (!data) {
          return m.reply(`❌ *Ehh~* Data episode tidak valid~ 🥺`)
      }
      
      try {
          const episodeData = JSON.parse(data)
          const links = episodeData.links || []
          
          if (links.length === 0) {
              return m.reply(`❌ *Ehh~* Tidak ada link download tersedia~ 🥺`)
          }
          
          let caption = `🎬 *${episodeData.episode}*\n\n`
          caption += `📥 *ʟɪɴᴋ ᴅᴏᴡɴʟᴏᴀᴅ:*\n\n`
          
          for (const quality of links) {
              caption += `📺 *${quality.quality}*\n`
              for (const server of (quality.url || [])) {
                  caption += `> • ${server.server}: ${server.url}\n`
              }
              caption += `\n`
          }
          
          caption += `> _Pilih quality dan server yang diinginkan_`
          
          await m.reply(caption)
          
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
