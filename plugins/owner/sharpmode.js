// owner/sharpmode — satu file: metadata + kode fitur (gabungan dari engine8/plugins/owner/sharpmode.js)
const __vx = require("../../lib/adapter/e8.js")
const __meta = {
  "name": "sharpmode",
  "command": [
    "sharpmode",
    "sharpringan",
    "sharplight"
  ],
  "category": "owner",
  "desc": "Aktif/nonaktifkan mode ringan sharp (permanen)",
  "usage": ".sharpmode <on|off|status>",
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
module.exports = __vx.plugin("owner/sharpmode", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/sharpmode.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const config = __vxDef(require("../../lib/ext/config.e8.js"));
  const { sharp, getSharpMode, setSharpMode } = require("../../lib/ext/src/lib/vanxone-lazy.js");
  
  const pluginConfig = {
      name: 'sharpmode',
      alias: ['sharpringan', 'sharplight'],
      category: 'owner',
      description: 'Aktif/nonaktifkan mode ringan sharp (permanen)',
      usage: '.sharpmode <on|off|status>',
      example: '.sharpmode on',
      isOwner: true,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 0,
      energi: 0,
      isEnabled: true
  }
  
  function statusText() {
      const light = getSharpMode()
      let live = ''
      try {
          const c = sharp.cache()
          live = `\n> cache: ${c.memory.max === 0 ? 'off' : c.memory.max + ' MB / ' + c.items.max + ' item'}` +
                 `\n> thread: ${sharp.concurrency()}`
      } catch {}
      return `🖼️ *sʜᴀʀᴘ ᴍᴏᴅᴇ*\n\n> Status: ${light ? '✅ Ringan (aktif)' : '⛔ Standar bot (nonaktif)'}${live}`
  }
  
  async function handler(m) {
      if (!config.isOwner(m.sender)) {
          return m.reply('❌ *Owner Only!*')
      }
  
      const arg = (m.args?.[0] || '').toLowerCase()
  
      if (['on', 'aktif', 'enable', '1'].includes(arg)) {
          setSharpMode(true)
          return m.reply('✅ Sharp mode ringan aktif.\n> Permanen, tetap aktif setelah restart.')
      }
      if (['off', 'nonaktif', 'disable', '0'].includes(arg)) {
          setSharpMode(false)
          return m.reply('⛔ Sharp mode ringan dinonaktifkan.\n> Kembali ke tuning bawaan bot (cache 16 MB, 1 thread).')
      }
      if (!arg || arg === 'status' || arg === 'cek') {
          return m.reply(statusText() + `\n\n*Pakai:* .sharpmode on / off`)
      }
      return m.reply('Pakai: .sharpmode on | off | status')
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
