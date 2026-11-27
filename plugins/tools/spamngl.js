// tools/spamngl — satu file: metadata + kode fitur (gabungan dari engine3/plugins/tools/spamngl.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "spamngl",
  "command": [
    "spamngl"
  ],
  "category": "tools",
  "desc": "Send NGL Spam",
  "usage": ".spamngl <url> | <text> | <jumlah>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/tools").split('\\').join('/')
module.exports = __vx.plugin("tools/spamngl", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/spamngl.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const axios = __vxDef(require("axios"));
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.js"));
  const pluginConfig = {
      name: 'spamngl',
      alias: [],
      category: 'tools',
      description: 'Send NGL Spam',
      usage: '.spamngl <url> | <text> | <jumlah>',
      example: '.spamngl https://ngl.link/xxxx | hai | 10',
      isOwner: false,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 5,
      energi: 0,
      isEnabled: true
  }
  
  async function handler(m, { sock }) {
      const text = m.text?.split('|')
      const [ link, kata, jumlah ] = text
      if(!link) return m.reply(`*LINK NGL NYA MANA ??*\nContoh: \`${m?.prefix}spamngl https://ngl.link/xxxx | hai | 10`)
      if(!kata) return m.reply(`*KATA KATA NYA MANA ??*\n\nContoh: \`${m?.prefix}spamngl https://ngl.link/xxxx | hai | 10`)
      if(!jumlah) return m.reply(`*JUMLAH NYA MANA ??*\n\nContoh: \`${m?.prefix}spamngl https://ngl.link/xxxx | hai | 10`)
      if(isNaN(jumlah)) return m.reply(`*JUMLAH NYA HARUS ANGKA*\n\nContoh: \`${m?.prefix}spamngl https://ngl.link/xxxx | hai | 10`)
      m.react('🎴')
      
      try {
          for(let i = 0; i < jumlah; i++) {
              axios.get(`https://api.cuki.biz.id/api/tools/sendngl?apikey=${(global.apiKeys && global.apiKeys.cuki) || ''}&link=${encodeURIComponent(link)}&text=${encodeURIComponent(kata)}`, {
                  timeout: 30000
              })
              await new Promise(resolve => setTimeout(resolve, 4000))
          }
          await m.react('✅')
          await sock.sendMessage(m.chat, {
              text: `✅ *DONE*\n\nBerhasil mengirim spam NGL Message!\nTarget: ${link}\nPesan: ${kata} (${jumlah}x)`
          }, { quoted: m })
          
      } catch (error) {
          m.react('☢')
          m.reply(te(m.prefix, m.command, m.pushName))
      }
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
