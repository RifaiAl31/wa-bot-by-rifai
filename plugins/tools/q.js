// owner/q — satu file: metadata + kode fitur (gabungan dari engine3/plugins/owner/q.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "q",
  "command": [
    "quoted",
    "inspect"
  ],
  "category": "tools",
  "desc": "Ambil JSON message dari pesan yang direply",
  "usage": ".q (reply pesan)",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 3,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/owner").split('\\').join('/')
module.exports = __vx.plugin("owner/q", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/q.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const util = __vxDef(require("util"));
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.js"));
  const pluginConfig = {
      name: 'q',
      alias: ['quoted', 'inspect'],
      category: 'tools',
      description: 'Ambil JSON message dari pesan yang direply',
      usage: '.q (reply pesan)',
      isOwner: true,
      cooldown: 3,
      isEnabled: true
  }
  
  async function handler(m) {
      if (!m.quoted) {
          return m.reply('❌ *Reply pesan yang ingin di-inspect*')
      }
  
      try {
          const quoted = m.quoted || {}
  
          await m.reply(JSON.stringify(quoted, null, 2))
      } catch (err) {
          await m.reply(te(m.prefix, m.command, m.pushName))
      }
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
