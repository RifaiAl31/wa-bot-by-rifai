// owner/templateplugin — satu file: metadata + kode fitur (gabungan dari engine3/plugins/owner/templateplugin.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "templateplugin",
  "command": [
    "templateplugin",
    "tplplugin",
    "plugin-template"
  ],
  "category": "owner",
  "desc": "Generate plugin template (Owner Only)",
  "usage": ".templateplugin",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 0,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/owner").split('\\').join('/')
module.exports = __vx.plugin("owner/templateplugin", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/templateplugin.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const config = __vxDef(require("../../lib/ext/config.e3.js"));
  const pluginConfig = {
      name: 'templateplugin',
      alias: ['tplplugin', 'plugin-template'],
      category: 'owner',
      description: 'Generate plugin template (Owner Only)',
      usage: '.templateplugin',
      example: '.templateplugin',
      isOwner: true,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 0,
      energi: 0,
      isEnabled: true
  }
  function handler(m, { sock }) {
      const template = `
  const pluginConfig = {
      name: 'example',
      alias: ['ex'],
      category: 'general',
      description: 'Example plugin',
      usage: '.example',
      example: '.example',
      isOwner: false,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 3,
      energi: 1,
      isEnabled: true
  }
  async function handler(m, { sock }) {
      try {
          await m.reply('This is an example plugin!')
      } catch (error) {
          console.error('Example Plugin Error:', error)
          await m.reply('❌ *GAGAL*\\n\\n> ' + error.message)
      }
  }
  export { pluginConfig as config, handler }
  `
      m.reply(`\`\`\`${template}\`\`\``)
  }
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
