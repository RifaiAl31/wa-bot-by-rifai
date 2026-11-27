// search/apkcombo — satu file: metadata + kode fitur (gabungan dari engine7/plugins/search/apkcombo.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "apkcombo",
  "command": [
    "apkcombo",
    "apk",
    "apksearch"
  ],
  "category": "search",
  "desc": "Cari APK di ApkCombo",
  "usage": ".apkcombo <query>",
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
module.exports = __vx.plugin("search/apkcombo", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/apkcombo.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const axios = __vxDef(require("axios"));
  
  const pluginConfig = {
      name: 'apkcombo',
      alias: ['apk', 'apksearch'],
      category: 'search',
      description: 'Cari APK di ApkCombo',
      usage: '.apkcombo <query>',
      example: '.apkcombo WhatsApp',
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
              `> \`${m.prefix}apkcombo <query>\`\n\n` +
              `> Contoh:\n` +
              `> \`${m.prefix}apkcombo WhatsApp\``
          )
      }
      
      try {
          const res = await axios.get(`https://api.nekolabs.web.id/dsc/apkcombo/search?q=${encodeURIComponent(query)}`)
          
          if (!res.data?.success || !res.data?.result?.length) {
              return m.reply(`❌ Tidak ditemukan hasil untuk: ${query}`)
          }
          
          const apps = res.data.result.slice(0, 5)
          
          let txt = `📦 *ᴀᴘᴋᴄᴏᴍʙᴏ sᴇᴀʀᴄʜ*\n\n`
          txt += `> Query: *${query}*\n\n`
          
          apps.forEach((a, i) => {
              txt += `*${i + 1}.* \`\`\`${a.name}\`\`\`\n`
              txt += `   ├ 👤 \`${a.author}\`\n`
              txt += `   ├ ⭐ \`${a.rating}/5\`\n`
              txt += `   ├ 📥 \`${a.downloaded}\`\n`
              txt += `   ├ 📦 \`${a.size}\`\n`
              txt += `   └ 🔗 \`${a.url}\`\n\n`
          })
          
          return m.reply(txt.trim())
          
      } catch (err) {
          return m.reply(`❌ *ɢᴀɢᴀʟ*\n\n> ${err.message}`)
      }
  }
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
