// stalker/ytstalk — satu file: metadata + kode fitur (gabungan dari engine3/plugins/stalker/ytstalk.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "ytstalk",
  "command": [
    "ytstalk",
    "youtubestalk",
    "stalkyt"
  ],
  "category": "stalker",
  "desc": "Stalk channel YouTube",
  "usage": ".ytstalk <username>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 10,
  "energi": 1,
  "needs": {
    "apikeys": [
      "firefly"
    ],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/stalker").split('\\').join('/')
module.exports = __vx.plugin("stalker/ytstalk", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/ytstalk.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const axios = __vxDef(require("axios"));
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.js"));
  const config = __vxDef(require("../../lib/ext/config.e3.js"));
  
  const pluginConfig = {
      name: 'ytstalk',
      alias: ['youtubestalk', 'stalkyt'],
      category: 'stalker',
      description: 'Stalk channel YouTube',
      usage: '.ytstalk <username>',
      example: '.ytstalk mrbeast',
      isOwner: false,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 10,
      energi: 1,
      isEnabled: true
  }
  
  async function handler(m, { sock }) {
      const username = m.args[0]
      
      if (!username) {
          return m.reply(`📺 *ʏᴏᴜᴛᴜʙᴇ sᴛᴀʟᴋ*\n\n> Masukkan username YouTube\n\n\`Contoh: ${m.prefix}ytstalk mrbeast\``)
      }
      
      m.react('🔍')
      
      try {
          const res = await axios.get(`https://firefly.maiku.my.id/api/stalk-youtube?apikey=${config.APIkey.firefly}&username=${encodeURIComponent(username)}`, {
              timeout: 30000
          })
          
          if (!res.data?.status || !res.data?.data) {
              m.react('❌')
              return m.reply(`❌ Channel *${username}* tidak ditemukan`)
          }
          
          const c = res.data.data
          
          let caption = `📺 *ʏᴏᴜᴛᴜʙᴇ sᴛᴀʟᴋ*\n\n` +
              `👤 *Nama:* ${c.name}\n` +
              `🔗 *Username:* @${username}\n` +
              `✅ *Verified:* ${c.verified ? 'Ya' : 'Tidak'}\n\n` +
              `👥 *Subscribers:* ${c.subscribers}\n` +
              `🎬 *Total Video:* ${c.video_count}\n\n` +
              `📝 *Deskripsi:*\n${c.about || '-'}\n\n` +
              `🔗 ${c.url}`
              
          m.react('✅')
          
          await sock.sendMessage(m.chat, {
              image: { url: c.thumbnail },
              caption
          }, { quoted: m })
          
      } catch (error) { globalThis.__vanxoneCatch?.(error);
          m.react('☢')
          m.reply(te(m.prefix, m.command, m.pushName))
      }
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
