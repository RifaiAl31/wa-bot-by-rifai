// main/credit — satu file: metadata + kode fitur (gabungan dari engine7/plugins/main/credit.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "credit",
  "command": [
    "credit"
  ],
  "category": "info",
  "desc": "Menampilkan informasi owner bot.",
  "usage": ".credit",
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
module.exports = __vx.plugin("main/credit", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/credit.js'
  const __vxExports = {};
  const pluginConfig = {
      name: 'credit',
      alias: [],
      category: 'main',
      description: 'Menampilkan informasi owner bot.',
      usage: '.credit',
      example: '.credit',
      isOwner: false,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 5,
      energi: 0,
      isEnabled: true,
  }
  
  async function handler(m, { sock }) {
      const text = "Owner Bot"
  
      await m.reply(text)
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
