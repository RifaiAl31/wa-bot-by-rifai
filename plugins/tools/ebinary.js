// tools/ebinary — satu file: metadata + kode fitur (gabungan dari engine7/plugins/tools/ebinary.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "ebinary",
  "command": [
    "ebinary",
    "encodebinary",
    "text2binary"
  ],
  "category": "tools",
  "desc": "Encode teks menjadi binary",
  "usage": ".ebinary <teks>",
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
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/tools").split('\\').join('/')
module.exports = __vx.plugin("tools/ebinary", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/ebinary.js'
  const __vxExports = {};
  /*
    Fitur tambahan hasil audit FURINA V17 → WhatsApp Bot.
  */
  
  const pluginConfig = {
      name: 'ebinary',
      alias: ['encodebinary', 'text2binary'],
      category: 'tools',
      description: 'Encode teks menjadi binary',
      usage: '.ebinary <teks>',
      example: '.ebinary WhatsApp Bot',
      cooldown: 3,
      energi: 1,
      isEnabled: true
  }
  
  async function handler(m) {
      const text = m.text?.trim()
      if (!text) return m.reply(`Contoh: ${m.prefix}ebinary WhatsApp Bot`)
      const result = [...text].map(char => char.charCodeAt(0).toString(2)).join(' ')
      return m.reply(result)
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
