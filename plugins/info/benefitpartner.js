// info/benefitpartner — satu file: metadata + kode fitur (gabungan dari engine7/plugins/info/benefitpartner.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "benefitpartner",
  "command": [
    "benefitpartner",
    "partnerbenefits",
    "keuntunganpartner"
  ],
  "category": "info",
  "desc": "Lihat keuntungan menjadi partner bot",
  "usage": ".benefitpartner",
  "owner": false,
  "group": false,
  "private": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/info").split('\\').join('/')
module.exports = __vx.plugin("info/benefitpartner", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/benefitpartner.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const config = __vxDef(require("../../lib/ext/config.e7.js"));
  const pluginConfig = {
      name: 'benefitpartner',
      alias: ['partnerbenefits', 'keuntunganpartner'],
      category: 'info',
      description: 'Lihat keuntungan menjadi partner bot',
      usage: '.benefitpartner',
      example: '.benefitpartner',
      isOwner: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 5,
      energi: 0,
      isEnabled: true
  }
  
  async function handler(m) {
  
      const prefix = m.prefix || '.'
  
      let txt = `🤝 *BENEFIT PARTNER*\n\n`
      txt += `Keuntungan menjadi partner ${config.bot?.name || 'Bot'}:\n\n`
  
      txt += `🔓 *Akses Fitur*\n`
      txt += `├ Energi & koin unlimited\n`
      txt += `├ Akses command owner tertentu\n`
      txt += `└ Prioritas support\n\n`
  
      txt += `💎 *Bonus*\n`
      txt += `├ +200.000 EXP saat aktivasi\n`
      txt += `├ +20.000 Koin saat aktivasi\n`
      txt += `├ Badge partner di profil\n`
      txt += `└ Akses early feature\n\n`
  
      txt += `💰 *Cara Jadi Partner*\n`
      txt += `├ Hubungi owner: ${config.owner?.name || 'Owner'}\n`
      txt += `├ Durasi: 30/60/90 hari\n`
      txt += `└ Command: \`${prefix}addpartner\` (owner only)\n\n`
  
      txt += `📋 *Command Partner*\n`
      txt += `├ \`${prefix}cekpartner\` — Cek status partner\n`
      txt += `├ \`${prefix}cekowner\` — Cek role user\n`
      txt += `└ \`${prefix}listpartner\` — Daftar partner\n\n`
  
      txt += `> _Hubungi owner untuk info lebih lanjut_`
  
      await m.reply(txt)
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
