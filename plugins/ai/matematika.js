// ai/matematika — satu file: metadata + kode fitur (gabungan dari engine3/plugins/ai/matematika.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "mathgpt",
  "command": [
    "mathgpt",
    "mathsolver"
  ],
  "category": "ai",
  "desc": "AI untuk menyelesaikan soal matematika",
  "usage": ".matematika <soal>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 10,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/ai").split('\\').join('/')
module.exports = __vx.plugin("ai/matematika", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/matematika.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.js"));
  const axios = __vxDef(require("axios"));
  const config = __vxDef(require("../../lib/ext/config.e3.js"));
  
  const pluginConfig = {
      name: 'matematika',
      alias: ['mathgpt', 'math', 'mathsolver'],
      category: 'ai',
      description: 'AI untuk menyelesaikan soal matematika',
      usage: '.matematika <soal>',
      example: '.matematika 2+2 berapa?',
      isOwner: false,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 10,
      energi: 1,
      isEnabled: true
  }
  
  async function handler(m, { sock }) {
      const text = m.args.join(' ')
  
      if (!text) {
          return m.reply(`📐 *ᴍᴀᴛʜ ɢᴘᴛ*\n\n> Masukkan soal matematika\n\n\`Contoh: ${m.prefix}matematika 2+2 berapa?\``)
      }
  
      m.react('🕕')
  
      try {
          const url = `https://api.nexray.eu.cc/ai/mathgpt?text=${encodeURIComponent(text)}`
          
          const { data } = await axios.get(url, {
              timeout: 30000,
              headers: {
                  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
              }
          })
  
          if (!data.status || !data.result) {
              await m.react('❌')
              return m.reply("⚠️ Gagal memproses soal matematika.")
          }
  
          const answer = data.result
  
          m.react('✅')
          await m.reply(`${answer}`)
  
      } catch (error) { globalThis.__vanxoneCatch?.(error);
          m.react('☢')
          m.reply(te(m.prefix, m.command, m.pushName))
      }
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
