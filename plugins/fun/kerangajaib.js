// fun/kerangajaib — satu file: metadata + kode fitur (gabungan dari engine7/plugins/fun/kerangajaib.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "kulitkerang",
  "command": [
    "kulitkerang",
    "ajaib"
  ],
  "category": "fun",
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
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/fun").split('\\').join('/')
module.exports = __vx.plugin("fun/kerangajaib", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/kerangajaib.js'
  const __vxExports = {};
  const FEATURE_CREDIT = "Fitur by: Owner Bot";
  
  
  const pluginConfig = {
    name: "kulitkerang",
    alias: ["ajaib"],
    category: "fun",
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
  
  async function handler(m, { text, command, prefix }) {
      const usedPrefix = prefix || m.prefix || ".";
      if (!text) throw `Use example ${usedPrefix}${command} i'm alien?`
      m.reply(`"${[
          'Mungkin suatu hari',
          'Tidak juga',
          'Tidak keduanya',
          'Kurasa tidak',
          'Ya',
          'Coba tanya lagi',
          'Tidak ada'
      ].getRandom()}."`)
  }
  
  
  
  Object.defineProperty(__vxExports, "FEATURE_CREDIT", { enumerable: true, get: () => FEATURE_CREDIT });
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
