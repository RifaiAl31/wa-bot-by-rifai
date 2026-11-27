// berita/mlbbnews — satu file: metadata + kode fitur (gabungan dari engine8/plugins/berita/mlbbnews.js)
const __vx = require("../../lib/adapter/e8.js")
const __meta = {
  "name": "mlbbnews",
  "command": [
    "mlbbnews",
    "beritaml",
    "mobilelegendsnews"
  ],
  "category": "berita",
  "desc": "Berita terbaru Mobile Legends: Bang Bang",
  "usage": ".mlbbnews",
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
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/berita").split('\\').join('/')
module.exports = __vx.plugin("berita/mlbbnews", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/mlbbnews.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const { f } = require("../../lib/ext/src/lib/vanxone-http.e8.js");
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.e8.js"));
  
  const pluginConfig = {
      name: 'mlbbnews',
      alias: ['beritaml', 'mobilelegendsnews'],
      category: 'berita',
      description: 'Berita terbaru Mobile Legends: Bang Bang',
      usage: '.mlbbnews',
      example: '.mlbbnews',
      isOwner: false,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 10,
      energi: 1,
      isEnabled: true
  }
  
  async function handler(m) {
      m.react('🕕')
  
      try {
          const data = await f('https://api.nexray.eu.cc/berita/mlbb')
  
          if (!data?.status || !data?.result) throw new Error('API error')
  
          const { total, data: berita } = data.result
  
          const preview = berita.slice(0, 8)
  
          const list = preview.map((item, i) => {
              const date = new Date(item.date).toLocaleDateString('id-ID', {
                  day: '2-digit', month: 'short', year: 'numeric'
              })
              return `${i + 1}. *${item.title}*\n    📅 ${date}\n    🔗 ${item.link}`
          }).join('\n\n')
  
          const teks =
              `🗡️ *ᴍʟʙʙ ɴᴇᴡꜱ*\n` +
              `◈━━━━━━━━━━━━━◈\n\n` +
              `${list}\n\n` +
              `◈━━━━━━━━━━━━━◈\n` +
              `📰 Total: *${total} berita* | ⏱️ ${data.response_time}`
  
          m.react('✅')
          await m.reply(teks)
      } catch (error) {
          console.error('[mlbbnews]', error.message)
          m.react('☢')
          m.reply(te(m.prefix, m.command, m.pushName))
      }
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
