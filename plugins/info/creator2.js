// main/creator2 — satu file: metadata + kode fitur (gabungan dari engine7/plugins/main/creator2.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "creator2",
  "command": [
    "creator2",
    "owner2"
  ],
  "category": "info",
  "desc": "Informasi owner bot.",
  "usage": ".creator2",
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
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/main").split('\\').join('/')
module.exports = __vx.plugin("main/creator2", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/creator2.js'
  const __vxExports = {};
  async function handler(m) {
    return m.reply("Owner: Owner Bot\nInformasi kontak belum dikonfigurasi.")
  }
    const pluginConfig = {
    name: 'creator2',
    alias: ['owner2'],
    category: 'main',
    description: 'Informasi owner bot.',
    usage: '.creator2',
    example: '.creator2',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 1,
    isEnabled: true,
  };
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
