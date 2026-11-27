// random/lahelu — satu file: metadata + kode fitur (gabungan dari engine3/plugins/random/lahelu.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "lahelu",
  "command": [
    "lahelu",
    "randommeme"
  ],
  "category": "fun",
  "desc": "Random gambar lahelu",
  "usage": ".lahelu",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/random").split('\\').join('/')
module.exports = __vx.plugin("random/lahelu", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/lahelu.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const axios = __vxDef(require("axios"));
  const config = __vxDef(require("../../lib/ext/config.e3.js"));
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.js"));
  const pluginConfig = {
      name: 'lahelu',
      alias: ['randommeme'],
      category: 'random',
      description: 'Random gambar lahelu',
      usage: '.lahelu',
      example: '.lahelu',
      isOwner: false,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 5,
      energi: 1,
      isEnabled: true
  }
  
  async function handler(m, { sock }) {
      const api = 'https://api.cuki.biz.id/api/random/lahelu?apikey=' + ((global.apiKeys && global.apiKeys.cuki) || '') + ''
      await m.react('🕕')
      
      try {
          const res = (await axios.get(api)).data
          const random = res.data[Math.floor(Math.random() * res.data.length)]
          if(random.media.includes('.mp4')) {
              await sock.sendMedia(m.chat, random.media, random.title, m, {
                  type: 'video'
              })
          } else {
              await sock.sendMedia(m.chat, random.media, random.title, m, {
                  type: 'image'
              })
          }
          await m.react('✅')
      } catch (e) {
          await m.react('☢')
          m.reply(te(m.prefix, m.command, m.pushName))
      }
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
