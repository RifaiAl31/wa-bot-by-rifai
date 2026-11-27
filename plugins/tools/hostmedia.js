// tools/hostmedia — satu file: metadata + kode fitur (gabungan dari engine7/plugins/tools/hostmedia.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "hostmedia",
  "command": [
    "hostmedia",
    "serverhostmedia",
    "hostmed"
  ],
  "category": "tools",
  "desc": "Nampilin daftar server host media beserta batas maksimalnya",
  "usage": "hostmedia",
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
module.exports = __vx.plugin("tools/hostmedia", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/hostmedia.js'
  const __vxExports = {};
  const pluginConfig = {
      name: 'hostmedia',
      alias: ['serverhostmedia', 'hostmedia', 'hostmed'],
      category: 'tools',
      description: 'Nampilin daftar server host media beserta batas maksimalnya',
      usage: 'hostmedia',
      example: 'hostmedia',
      isOwner: false,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 3,
      energi: 0,
      isEnabled: true
  }
  
  async function handler(m) {
      const text = `Server host media
  
  - uguu.se [max 128mb]
  - unggah.web.id/ [max 350mb]
  - cdn.nekohime.site
  - qu.ax [max 256mb]
  - leopard.hosting.pecon.us [max 100mb]
  - e.top4top.io
  - www.upload.ee [max 100mb]
  - tmpfiles.org [max 100mb]
  - kappa.lol [max 100mb]
  - pone.rs [max 1GB]`
  
      return m.reply(text)
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
