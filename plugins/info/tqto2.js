// main/tqto2 — satu file: metadata + kode fitur (gabungan dari engine7/plugins/main/tqto2.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "tqto2",
  "command": [
    "tqto2",
    "thanksto2",
    "credits2",
    "kredit2"
  ],
  "category": "info",
  "desc": "Menampilkan daftar kontributor bot",
  "usage": ".tqto2",
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
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/main").split('\\').join('/')
module.exports = __vx.plugin("main/tqto2", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/tqto2.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const config = __vxDef(require("../../lib/ext/config.e7.js"));
  
  const pluginConfig = {
      name: 'tqto2',
      alias: ['thanksto2', 'credits2', 'kredit2'],
      category: 'main',
      description: 'Menampilkan daftar kontributor bot',
      usage: '.tqto2',
      example: '.tqto2',
      isOwner: false,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 5,
      energi: 0,
      isEnabled: true
  }
  
  async function handler(m, { sock }) {
      const credits = [
          { name: 'Owner Bot', role: 'Pemilik', icon: '👨‍💻' }
      ]
  
      await m.reply(`🍟 *Berikut ini adalah orang-orang yang berkontribusi di bot ${config.bot?.name || 'WhatsApp Bot'}*
  
  ${credits.map((c, i) => `*${i + 1}*. *${c.name}* [ ${c.icon} ${c.role} ]`).join('\n')}`)
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
