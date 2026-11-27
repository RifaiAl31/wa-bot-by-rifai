// tools/tesautopostch — satu file: metadata + kode fitur (gabungan dari engine7/plugins/tools/tesautopostch.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "tesautopostch",
  "command": [
    "tesautopostch",
    "testch",
    "testautopost"
  ],
  "category": "tools",
  "desc": "Test autopost ke channel sekarang",
  "usage": ".tesautopostch [pagi/siang/sore/malam]",
  "owner": true,
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
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/tools").split('\\').join('/')
module.exports = __vx.plugin("tools/tesautopostch", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/tesautopostch.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const config = __vxDef(require("../../lib/ext/config.e7.js"));
  const pluginConfig = {
      name: 'tesautopostch',
      alias: ['testch', 'testautopost'],
      category: 'tools',
      description: 'Test autopost ke channel sekarang',
      usage: '.tesautopostch [pagi/siang/sore/malam]',
      example: '.tesautopostch pagi',
      isOwner: true,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 3,
      energi: 0,
      isEnabled: true
  }
  
  async function handler(m, { sock }) {
      try {
          const input = (m.args[0] || '').toLowerCase()
          const valid = ['pagi', 'siang', 'sore', 'malam']
  
          let type = valid.includes(input)
              ? input
              : valid[Math.floor(Math.random() * valid.length)]
  
          // 🔥 CEK GLOBAL FUNCTION
          if (typeof global.sendPost !== 'function') {
              return m.reply('❌ sendPost belum terdeteksi di global')
          }
  
          await global.sendPost(type)
  
          await sock.sendMessage(m.chat, {
              text: `╭━━━〔 💗 TEST AUTOPOST 〕━━━⬣
  ┃ Status: ✅ Berhasil
  ┃ Tipe: ${type}
  ┃
  ┃ WhatsApp Bot udah kirim duluan 😈
  ╰━━━━━━━━━━━━━━━━⬣`
          }, { quoted: m })
  
      } catch (e) {
          console.log('TEST AUTOPOST ERROR:', e)
  
          m.reply(`❌ Error test autopost\n${e.message}`)
      }
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
