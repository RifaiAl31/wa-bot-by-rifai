// ai/gita — satu file: metadata + kode fitur (gabungan dari engine3/plugins/ai/gita.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "gita",
  "command": [
    "gita",
    "gitagpt",
    "bhagavadgita"
  ],
  "category": "ai",
  "desc": "Chat dengan Gita GPT (Bhagavad Gita AI)",
  "usage": ".gita <pertanyaan>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/ai").split('\\').join('/')
module.exports = __vx.plugin("ai/gita", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/gita.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const axios = __vxDef(require("axios"));
  const { f } = require("../../lib/ext/src/lib/vanxone-http.js");
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.js"));
  const config = __vxDef(require("../../lib/ext/config.e3.js"));
  const pluginConfig = {
      name: 'gita',
      alias: ['gitagpt', 'bhagavadgita'],
      category: 'ai',
      description: 'Chat dengan Gita GPT (Bhagavad Gita AI)',
      usage: '.gita <pertanyaan>',
      example: '.gita What is dharma?',
      isOwner: false,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 5,
      energi: 1,
      isEnabled: true
  }
  
  async function handler(m, { sock }) {
      const text = m.args.join(' ')
      if (!text) {
          return m.reply(`📿 *ɢɪᴛᴀ ɢᴘᴛ*\n\n> Masukkan pertanyaan\n\n\`Contoh: ${m.prefix}gita What is dharma?\``)
      }
  
      m.react('🕕')
  
      try {
          const url = `https://api.cuki.biz.id/api/ai/gita?apikey=${config.APIkey.cuki}&q=${encodeURIComponent(text)}`
          const data = await f(url)
  
          const content = data.results
  
          m.react('✅')
          await m.reply(`${content?.trim()}`)
  
      } catch (error) { globalThis.__vanxoneCatch?.(error);
          m.react('☢')
          m.reply(te(m.prefix, m.command, m.pushName))
      }
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
