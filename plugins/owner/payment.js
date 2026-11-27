// owner/payment — satu file: metadata + kode fitur (gabungan dari engine3/plugins/owner/payment.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "payment",
  "command": [
    "qris"
  ],
  "category": "owner",
  "desc": "Menampilkan info payment",
  "usage": ".payment",
  "owner": false,
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
module.exports = __vx.plugin("owner/payment", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/payment.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const config = __vxDef(require("../../lib/ext/config.e3.js"));
  const { getDatabase } = require("../../lib/ext/src/lib/vanxone-database.js");
  
  const pluginConfig = {
    name: 'payment',
    alias: ['pay', 'qris'],
    category: 'owner',
    description: 'Menampilkan info payment',
    usage: '.payment',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 0,
    isEnabled: true
  }
  
  function buildPaymentText(paymentCfg, customText, botName, ownerName) {
    const methods = (paymentCfg.methods || []).filter(m => m.number)
    const banks = (paymentCfg.banks || []).filter(b => b.number)
  
    if (customText) {
      return customText
        .replace(/\{botname\}/gi, botName)
        .replace(/\{owner\}/gi, ownerName)
        .replace(/\{methods\}/gi, methods.map(m => `• *${m.name}*: ${m.number} (${m.holder || m.name})`).join('\n'))
        .replace(/\{banks\}/gi, banks.map(b => `• *${b.name}*: ${b.number} (${b.holder || b.name})`).join('\n'))
        .replace(/\{qris\}/gi, paymentCfg.qrisUrl ? '✅ Tersedia' : '❌ Belum diatur')
    }
  
    let text = `💳 *P A Y M E N T*\n`
    text += `━━━━━━━━━━━━━━━━━━\n\n`
  
    if (methods.length > 0) {
      text += `📱 *E-Wallet:*\n`
      for (const m of methods) {
        text += `├─ • *${m.name}*\n`
        text += `│  \`${m.number}\`\n`
        if (m.holder) text += `│  a/n: ${m.holder}\n`
      }
      text += `\n`
    }
  
    if (banks.length > 0) {
      text += `🏦 *Bank Transfer:*\n`
      for (const b of banks) {
        text += `├─ • *${b.name}*\n`
        text += `│  \`${b.number}\`\n`
        if (b.holder) text += `│  a/n: ${b.holder}\n`
      }
      text += `\n`
    }
  
    if (paymentCfg.qrisUrl) {
      text += `📸 *QRIS:* Tersedia (lihat gambar)\n\n`
    }
  
    text += `━━━━━━━━━━━━━━━━━━\n`
    text += `> ${botName}`
  
    return text
  }
  
  async function handler(m, { sock }) {
    const db = getDatabase()
    const paymentCfg = config.payment || {}
    const customText = db.setting('customPaymentText') || paymentCfg.customText || ''
    const botName = config.bot?.name || 'Bot'
    const ownerName = config.owner?.name || 'Owner'
  
    const text = buildPaymentText(paymentCfg, customText, botName, ownerName)
  
    if (paymentCfg.qrisUrl) {
      try {
        await sock.sendMessage(m.chat, {
          image: { url: paymentCfg.qrisUrl },
          caption: text
        }, { quoted: m })
        return
      } catch {}
    }
  
    await sock.sendMessage(m.chat, { text }, { quoted: m })
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
