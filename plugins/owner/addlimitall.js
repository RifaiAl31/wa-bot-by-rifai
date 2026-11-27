// owner/addlimitall — satu file: metadata + kode fitur (gabungan dari engine3/plugins/owner/addlimitall.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "addenergiall",
  "command": [
    "addlimitall",
    "addenergiall",
    "addenergianall",
    "bonusenergiall"
  ],
  "category": "owner",
  "desc": "Menambahkan limit/energi ke semua member grup",
  "usage": ".addenergiall <jumlah>",
  "owner": true,
  "group": true,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 10,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/owner").split('\\').join('/')
module.exports = __vx.plugin("owner/addlimitall", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/addlimitall.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const config = __vxDef(require("../../lib/ext/config.e3.js"));
  const { getDatabase } = require("../../lib/ext/src/lib/vanxone-database.js");
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.js"));
  const pluginConfig = {
      name: 'addenergiall',
      alias: ['addenergianall', 'bonusenergiall'],
      category: 'owner',
      description: 'Menambahkan limit/energi ke semua member grup',
      usage: '.addenergiall <jumlah>',
      example: '.addenergiall 50',
      isOwner: true,
      isPremium: false,
      isGroup: true,
      isPrivate: false,
      cooldown: 10,
      energi: 0,
      isEnabled: true
  }
  
  async function handler(m, { sock }) {
      try {
          const amount = parseInt(m.args[0])
          
          if (isNaN(amount) || amount <= 0) {
              return m.reply(`⚠️ *ᴄᴀʀᴀ ᴘᴀᴋᴀɪ*\n\n> Masukkan jumlah limit yang ingin ditambahkan.\n\n\`Contoh: ${m.prefix}addlimitall 50\``)
          }
          
          const groupMeta = m.groupMetadata
          const participants = groupMeta.participants || []
          
          if (participants.length === 0) {
              return m.reply(`❌ *ɢᴀɢᴀʟ*\n\n> Tidak ada member di grup ini`)
          }
          
          await m.react('🕕')
          const db = getDatabase()
          let successCount = 0
          
          for (const participant of participants) {
              const number = participant.jid?.replace(/[^0-9]/g, '') || ''
              if (!number) continue
              const jid = number + '@s.whatsapp.net'
              db.updateEnergi(jid, amount)
              successCount++
          }
  
          const gb = m?.groupMetadata
          
          await db.save()
          await m.react('⚡')
          await m.reply(
             `✅ Berhasil menambahkan limit ke semua member ( Total *${successCount}* Member ) di grup *${gb?.subject}*`,
              )
          
      } catch (error) {
          await m.react('☢')
          await m.reply(te(m.prefix, m.command, m.pushName))
      }
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
