// tools/dbinary — satu file: metadata + kode fitur (gabungan dari engine7/plugins/tools/dbinary.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "dbinary",
  "command": [
    "dbinary",
    "decodebinary",
    "binary2text"
  ],
  "category": "tools",
  "desc": "Decode binary menjadi teks",
  "usage": ".dbinary <binary>",
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
module.exports = __vx.plugin("tools/dbinary", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/dbinary.js'
  const __vxExports = {};
  /*
    Fitur tambahan hasil audit FURINA V17 → WhatsApp Bot.
  */
  
  const pluginConfig = {
      name: 'dbinary',
      alias: ['decodebinary', 'binary2text'],
      category: 'tools',
      description: 'Decode binary menjadi teks',
      usage: '.dbinary <binary>',
      example: '.dbinary 1001001 110110 110',
      cooldown: 3,
      energi: 1,
      isEnabled: true
  }
  
  async function handler(m) {
      const text = m.text?.trim()
      if (!text) return m.reply(`Contoh: ${m.prefix}dbinary 1000001 1000010`)
      const chunks = text.split(/\s+/)
      if (!chunks.every(x => /^[01]+$/.test(x))) return m.reply('❌ Format binary tidak valid.')
      try {
          const result = chunks.map(x => String.fromCharCode(parseInt(x, 2))).join('')
          return m.reply(result || '❌ Binary kosong.')
      } catch {
          return m.reply('❌ Gagal decode binary.')
      }
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
