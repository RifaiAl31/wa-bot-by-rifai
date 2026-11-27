// fun/ramalan — satu file: metadata + kode fitur (gabungan dari engine7/plugins/fun/ramalan.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "ramal",
  "command": [
    "ramal"
  ],
  "category": "fun",
  "desc": "Imported from WhatsApp Bot V4.6",
  "usage": "",
  "owner": false,
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
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/fun").split('\\').join('/')
module.exports = __vx.plugin("fun/ramalan", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/ramalan.js'
  const __vxExports = {};
  const FEATURE_CREDIT = "Fitur by: Owner Bot";
  
  
  const pluginConfig = {
    name: "ramal",
    alias: [],
    category: "fun",
    description: "Imported from WhatsApp Bot V4.6",
    usage: "",
    example: "",
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 3,
    energi: 0,
    isEnabled: true,
  };
  
  async function handler(m, { text }) {
    const nama = text || m.pushName || 'Kamu'
  
    const ramalan = [
      '💸 Akan jadi sultan dadakan dari giveaway yang gak sengaja diikutin.',
      '💔 Akan ditikung sahabat sendiri, tapi tetap ikhlas karena jodoh gak ke mana.',
      '🛌 Kamu akan tidur 14 jam dan bangun tetap capek.',
      '📱 HP kamu akan jatuh tapi nggak lecet. Cuma mental kamu yang retak.',
      '🎓 Kamu akan lulus... dari hubungan tanpa kejelasan.',
      '📉 Akan investasi kripto, tapi malah beli token tipu-tipu.',
      '🛍️ Kamu akan belanja banyak, tapi lupa bayar listrik.',
      '👽 Alien bakal culik kamu karena mengira kamu spesies langka.',
      '💘 Akan jatuh cinta sama orang yang ngira kamu bot.',
      '😂 Kamu akan ketawa hari ini gara-gara baca pesan ini.'
    ]
  
    const hasil = ramalan[Math.floor(Math.random() * ramalan.length)]
    m.reply(`🔮 *Ramalan Masa Depan*\n\n${nama}, ${hasil}`)
  }
  
  
  
  Object.defineProperty(__vxExports, "FEATURE_CREDIT", { enumerable: true, get: () => FEATURE_CREDIT });
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
