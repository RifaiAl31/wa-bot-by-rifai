// tools/ekspedisilist — satu file: metadata + kode fitur (gabungan dari engine7/plugins/tools/ekspedisilist.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "ekspedisilist",
  "command": [
    "ekspedisilist"
  ],
  "category": "tools",
  "desc": "Imported from WhatsApp Bot V4.6",
  "usage": "",
  "owner": false,
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
module.exports = __vx.plugin("tools/ekspedisilist", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/ekspedisilist.js'
  const __vxExports = {};
  const FEATURE_CREDIT = "Fitur by: Owner Bot";
  
  
  const pluginConfig = {
    name: "ekspedisilist",
    alias: [],
    category: "tools",
    description: "Imported from WhatsApp Bot V4.6",
    usage: "",
    example: "",
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 3,
    energi: 0,
    isEnabled: true,
  };
  
  async function handler(m, { sock }) {
      const conn = sock;
    const ekspedisi = [
      'shopee-express', 'ninja', 'lion-parcel', 'pos-indonesia', 'tiki',
      'acommerce', 'gtl-goto-logistics', 'paxel', 'sap-express', 'indah-logistik-cargo',
      'lazada-express-lex', 'lazada-logistics', 'janio-asia', 'jet-express', 'pcp-express',
      'pt-ncs', 'nss-express', 'grab-express', 'rcl-red-carpet-logistics', 'qrim-express',
      'ark-xpress', 'standard-express-lwe', 'luar-negeri-bea-cukai'
    ]
  
    let teks = `📦 *Daftar Ekspedisi yang Tersedia:*\n\n${ekspedisi.map(v => `• ${v}`).join('\n')}`
  
    await conn.reply(m.chat, teks, m)
  }
  
  
  
  Object.defineProperty(__vxExports, "FEATURE_CREDIT", { enumerable: true, get: () => FEATURE_CREDIT });
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
