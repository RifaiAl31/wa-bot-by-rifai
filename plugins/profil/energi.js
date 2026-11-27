// user/energi — satu file: metadata + kode fitur (gabungan dari engine3/plugins/user/energi.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "energi",
  "command": ["energi", "myenergi", "limit"],
  "category": "profil",
  "desc": "Cek energi user",
  "usage": ".energi [@user]",
  "owner": false,
  "group": false,
  "private": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 3,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/user").split('\\').join('/')
module.exports = __vx.plugin("user/energi", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/energi.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const { getDatabase } = require("../../lib/ext/src/lib/vanxone-database.js");
  const config = __vxDef(require("../../lib/ext/config.e3.js"));
  const pluginConfig = {
      name: 'energi',
      alias: ['cekenergi', 'myenergi', 'energy', 'limit', 'ceklimit'],
      category: 'user',
      description: 'Cek energi user',
      usage: '.energi [@user]',
      example: '.energi',
      isOwner: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 3,
      energi: 0,
      isEnabled: true
  }
  
  function formatNumber(num) {
      if (num === -1) return '∞ Unlimited'
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  }
  
  async function handler(m, { sock }) {
      const db = getDatabase()
      
      let targetJid = m.sender
      let targetName = m.pushName || 'Kamu'
      
      if (m.quoted) {
          targetJid = m.quoted.sender
          targetName = m.quoted.pushName || targetJid.split('@')[0]
      } else if (m.mentionedJid?.length) {
          targetJid = m.mentionedJid[0]
          targetName = targetJid.split('@')[0]
      }
      
      const user = db.getUser(targetJid) || db.setUser(targetJid)
      const isOwner = config.owner?.number?.includes(targetJid.replace(/[^0-9]/g, '')) || config.isOwner?.(targetJid)
  
      const dbToggle = db.setting('energi')
      const energiEnabled = dbToggle !== undefined ? dbToggle : (config.energi?.enabled !== false)
  
      let finalEnergi
      if (!energiEnabled || isOwner) {
          finalEnergi = -1
      } else {
          finalEnergi = user.energi ?? config.energi?.default ?? 25
      }
  
      const isUnlimited = finalEnergi === -1
      const energiDisplay = formatNumber(finalEnergi)
      
      const isSelf = targetJid === m.sender
      
      let userStatus = 'User'
      if (isOwner) userStatus = 'Owner'
      if (!energiEnabled) userStatus += ' (Energi OFF)'
      
      let text = `*〔 ⚡ ENERGI INFO 〕*\n\n`
  
  text += `*〔 👤 User 〕* ${targetName}\n`
  text += `*〔 ⚡ Energi 〕* ${energiDisplay}\n`
  text += `*〔 👤 Status 〕* ${userStatus}\n\n`
      
      if (!energiEnabled) {
          text += `🔌 Sistem energi dinonaktifkan — semua command gratis`
      } else if (isSelf && !isUnlimited && finalEnergi < 10) {
          text += `⚠️ Energi hampir habis!\n`
          text += `Gunakan \`.buyenergi\` untuk beli`
      } else if (isUnlimited) {
          text += `✨ Energi unlimited aktif!`
      }
      
      await m.reply(text)
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
