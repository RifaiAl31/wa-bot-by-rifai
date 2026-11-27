// owner/stop — satu file: metadata + kode fitur (gabungan dari engine7/plugins/owner/stop.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "stop",
  "command": [
    "stop",
    "shutdown",
    "kill"
  ],
  "category": "owner",
  "desc": "Stop bot process",
  "usage": ".stop",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 0,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/owner").split('\\').join('/')
module.exports = __vx.plugin("owner/stop", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/stop.js'
  const __vxExports = {};
  const pluginConfig = {
      name: 'stop',
      alias: ['shutdown', 'kill'],
      category: 'owner',
      description: 'Stop bot process',
      usage: '.stop',
      example: '.stop',
      isOwner: true,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 0,
      energi: 0,
      isEnabled: true
  }
  
  async function handler(m, { sock }) {
      await m.reply('🛑 *Stopping Bot...*\n\n> Bot dimatikan. Harus dinyalakan manual dari terminal.')
      console.log('Stopping via command...')
      
      // Allow message to send before exit
      setTimeout(() => {
          process.exit(1) // Exit code 1 usually stops auto-restart in simple loops
      }, 1000)
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
