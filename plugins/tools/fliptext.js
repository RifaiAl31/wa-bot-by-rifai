// tools/fliptext — satu file: metadata + kode fitur (gabungan dari engine7/plugins/tools/fliptext.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "fliptext",
  "command": [
    "fliptext",
    "baliktext"
  ],
  "category": "tools",
  "desc": "Membalik susunan teks",
  "usage": ".fliptext <teks>",
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
module.exports = __vx.plugin("tools/fliptext", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/fliptext.js'
  const __vxExports = {};
  /*
  ╔══════════════════════════════════════════════╗
  ║       👑  WhatsApp Bot 𝑴𝑫 〽️                        ║
  ╚══════════════════════════════════════════════╝
  
    Fitur tambahan hasil audit FURINA V17 → WhatsApp Bot.
  */
  
  const pluginConfig = {
      name: 'fliptext',
      alias: ['baliktext'],
      category: 'tools',
      description: 'Membalik susunan teks',
      usage: '.fliptext <teks>',
      example: '.fliptext WhatsApp Bot',
      cooldown: 3,
      energi: 1,
      isEnabled: true
  }
  
  async function handler(m) {
      const text = m.text?.trim()
      if (!text) return m.reply(`Contoh: ${m.prefix}fliptext WhatsApp Bot`)
      const flipped = [...text].reverse().join('')
      return m.reply(`「 FLIP TEXT 」\n\n• Normal :\n${text}\n\n• Flip :\n${flipped}`)
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
