// canvas/pakustad — satu file: metadata + kode fitur (gabungan dari engine3/plugins/canvas/pakustad.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "pakustad",
  "command": [
    "pakustad",
    "pak-ustad",
    "tanyaustad"
  ],
  "category": "image",
  "desc": "Tanya pak ustad (gambar)",
  "usage": ".pakustad <pertanyaan>",
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
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/canvas").split('\\').join('/')
module.exports = __vx.plugin("canvas/pakustad", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/pakustad.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const { f } = require("../../lib/ext/src/lib/vanxone-http.js");
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.js"));
  const pluginConfig = {
      name: ['pakustad', 'pak-ustad', 'tanyaustad'],
      alias: [],
      category: 'fun',
      description: 'Tanya pak ustad (gambar)',
      usage: '.pakustad <pertanyaan>',
      example: '.pakustad kenapa aku ganteng',
      isOwner: false,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 10,
      energi: 1,
      isEnabled: true
  }
  
  async function handler(m, { sock }) {
      const text = m.text || m.quoted?.text
      
      if (!text) {
          return m.reply(
              `⚠️ *ᴄᴀʀᴀ ᴘᴀᴋᴀɪ*\n\n` +
              `> \`${m.prefix}pakustad <pertanyaan>\`\n\n` +
              `> Contoh: \`${m.prefix}pakustad kenapa aku ganteng\``
          )
      }
      
      await m.react('🕕')
      
      try {
          const apiUrl = `https://api.cuki.biz.id/api/canvas/ustadz?apikey=${(global.apiKeys && global.apiKeys.cuki) || ''}&text=${encodeURIComponent(text)}`
          const { results } = await f(apiUrl)
          await sock.sendMedia(m.chat, results.url, text, m, {
              type: 'image'
          })
          
          m.react('✅')
          
      } catch (err) { globalThis.__vanxoneCatch?.(err);
          m.react('☢')
          return m.reply(te(m.prefix, m.command, m.pushName))
      }
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
