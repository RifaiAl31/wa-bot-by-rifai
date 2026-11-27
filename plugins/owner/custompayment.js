// owner/custompayment — satu file: metadata + kode fitur (gabungan dari engine3/plugins/owner/custompayment.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "custompayment",
  "command": [
    "custompayment",
    "setpayment",
    "setpaytext"
  ],
  "category": "owner",
  "desc": "Atur teks custom untuk .payment dengan placeholder",
  "usage": ".custompayment <teks> / .custompayment reset",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/owner").split('\\').join('/')
module.exports = __vx.plugin("owner/custompayment", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/custompayment.js'
  const __vxExports = {};
  const { getDatabase } = require("../../lib/ext/src/lib/vanxone-database.js");
  
  const pluginConfig = {
    name: 'custompayment',
    alias: ['setpayment', 'setpaytext'],
    category: 'owner',
    description: 'Atur teks custom untuk .payment dengan placeholder',
    usage: '.custompayment <teks> / .custompayment reset',
    isOwner: true,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 0,
    isEnabled: true
  }
  
  async function handler(m) {
    const db = getDatabase()
    const input = m.text?.trim()
    const current = db.setting('customPaymentText') || ''
  
    if (!input) {
      return m.reply(
        `📝 *CUSTOM PAYMENT TEXT*\n\n` +
        `Teks saat ini:\n${current || '_(belum diatur, pakai default)_'}\n\n` +
        `*PLACEHOLDER YANG TERSEDIA:*\n` +
        `• \`{botname}\` — Nama bot\n` +
        `• \`{owner}\` — Nama owner\n` +
        `• \`{methods}\` — Daftar e-wallet\n` +
        `• \`{banks}\` — Daftar bank\n` +
        `• \`{qris}\` — Status QRIS\n\n` +
        `*CONTOH:*\n` +
        `> \`${m.prefix}custompayment Halo! Bayar ke {methods}\`\n\n` +
        `> \`${m.prefix}custompayment reset\` — Kembalikan ke default`
      )
    }
  
    if (input.toLowerCase() === 'reset') {
      db.setting('customPaymentText', '')
      return m.reply('✅ Teks custom payment direset ke default.')
    }
  
    db.setting('customPaymentText', input)
    return m.reply(`✅ Teks custom payment disimpan!\n\nPreview:\n${input}`)
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
