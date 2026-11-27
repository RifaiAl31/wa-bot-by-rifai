// ai/glm4 — satu file: metadata + kode fitur (gabungan dari engine7/plugins/ai/glm4.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "glm4",
  "command": [
    "glm4",
    "glm",
    "glm46v"
  ],
  "category": "ai",
  "desc": "Chat dengan GLM 4.6V",
  "usage": ".glm4 <pertanyaan>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/ai").split('\\').join('/')
module.exports = __vx.plugin("ai/glm4", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/glm4.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const axios = __vxDef(require("axios"));
  const { f } = require("../../lib/ext/src/lib/vanxone-http.js");
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.e7.js"));
  
  const pluginConfig = {
      name: 'glm4',
      alias: ['glm', 'glm46v'],
      category: 'ai',
      description: 'Chat dengan GLM 4.6V',
      usage: '.glm4 <pertanyaan>',
      example: '.glm4 Hai apa kabar?',
      isOwner: false,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 5,
      energi: 1,
      isEnabled: true
  }
  
  async function handler(m, { sock }) {
      const text = m.text
      if (!text) {
          return m.reply(`🌐 *ɢʟᴍ 4.6ᴠ*\n\n> Masukkan pertanyaan\n\n\`Contoh: ${m.prefix}glm4 Hai apa kabar?\``)
      }
      
      m.react('🕕')
      
      try {
          const url = `https://api.nexray.web.id/ai/glm?text=${encodeURIComponent(text)}&model=glm-4.6`
          const data = await f(url)
              
          const content = data.result
          
          m.react('✅')
          await m.reply(`${content}`)
          
      } catch (error) {
          m.react('☢')
          m.reply(te(m.prefix, m.command, m.pushName))
      }
  }
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
