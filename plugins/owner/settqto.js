// owner/settqto — satu file: metadata + kode fitur (gabungan dari engine1/plugins/owner/settqto.js)
const __vx = require("../../lib/adapter/e1.js")
const __meta = {
  "name": "settqto",
  "command": [
    "settqto",
    "settq",
    "tqtoset"
  ],
  "category": "owner",
  "desc": "Mengatur tampilan tqto",
  "usage": ".settqto <v1/v2>",
  "owner": true,
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
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/owner").split('\\').join('/')
module.exports = __vx.plugin("owner/settqto", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/settqto.js'
  const module = { exports: {} }; const exports = module.exports;
  const { getDatabase } = require("../../lib/ext/src/lib/database.js")
  
  const pluginConfig = {
      name: 'settqto',
      alias: ['settq', 'tqtoset'],
      category: 'owner',
      description: 'Mengatur tampilan tqto',
      usage: '.settqto <v1/v2>',
      example: '.settqto v2',
      isOwner: true,
      cooldown: 3
  }
  
  const VARIANTS = {
      v1: { id: 1, name: 'Aesthetic', desc: 'Tampilan text panjang (default)' },
      v2: { id: 2, name: 'Table', desc: 'Tampilan tabel list member' }
  }
  
  async function handler(m, { db }) {
      const database = db || await getDatabase()
      const args = m.args || []
      const variant = args[0]?.toLowerCase()
  
      if (variant) {
          const selected = VARIANTS[variant]
  
          if (!selected) {
              return m.reply('❌ Variant tidak valid!\nGunakan: v1 atau v2')
          }
  
          database.setting('tqtoVariant', selected.id)
          await database.save()
  
          return m.reply(
              `✅ TQTO diubah ke *V${selected.id}*\n\n` +
              `> *${selected.name}*\n` +
              `> _${selected.desc}_`
          )
      }
  
      const current = database.setting('tqtoVariant') || 1
  
      let txt = `🎨 *SET TQTO STYLE*\n\n`
      txt += `> Variant aktif: *V${current}*\n`
      txt += `> _${VARIANTS[`v${current}`]?.name}_\n\n`
  
      for (const [key, val] of Object.entries(VARIANTS)) {
          const mark = val.id === current ? ' ✓' : ''
          txt += `• ${key.toUpperCase()}${mark} — ${val.desc}\n`
      }
  
      txt += `\nGunakan: .settqto v1 / v2`
  
      return m.reply(txt)
  }
  
  module.exports = {
      config: pluginConfig,
      handler
  }
  return module.exports
})
