// info/callingcode — satu file: metadata + kode fitur (gabungan dari engine7/plugins/info/callingcode.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "callingcode",
  "command": [
    "callingcode"
  ],
  "category": "info",
  "desc": "Imported from WhatsApp Bot V4.6",
  "usage": "",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 3,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/info").split('\\').join('/')
module.exports = __vx.plugin("info/callingcode", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/callingcode.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const FEATURE_CREDIT = "Fitur by: Owner Bot";
  
  
  const fetch = __vxDef(require("node-fetch"));
  
  const pluginConfig = {
    name: "callingcode",
    alias: [],
    category: "info",
    description: "Imported from WhatsApp Bot V4.6",
    usage: "",
    example: "",
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 3,
    energi: 1,
    isEnabled: true,
  };
  
  async function handler(m, { text, prefix, command }) {
      const usedPrefix = prefix || m.prefix || ".";
    if (!text) return m.reply(`Example: ${usedPrefix}${command} 62`)
  
    try {
      let url = API('lol', '/api/callingcode/' + text)
      let res = await fetch(url)
      let json = await res.json()
  
      if (json.status !== 200) throw 'API Error'
  
      let d = json.result
  
      let msg = `
  📞 *Calling Code Information*
  
  🌍 Negara      : ${d.name}
  📱 Kode Telp   : +${d.callingCodes.join(', ')}
  🏙️ Ibu Kota    : ${d.capital}
  🗺️ Region      : ${d.region}
  🔖 ISO2        : ${d.alpha2Code}
  🔖 ISO3        : ${d.alpha3Code}
  🌐 Domain      : ${d.topLevelDomain.join(', ')}
  `.trim()
  
      m.reply(msg)
  
    } catch (e) {
      m.reply('Kode tidak ditemukan atau API sedang error')
    }
  }
  
  
  
  Object.defineProperty(__vxExports, "FEATURE_CREDIT", { enumerable: true, get: () => FEATURE_CREDIT });
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
