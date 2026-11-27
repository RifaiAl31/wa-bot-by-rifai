// rpg/dailyrpg — satu file: metadata + kode fitur (gabungan dari engine1/plugins/rpg/dailyrpg.js)
const __vx = require("../../lib/adapter/e1.js")
const __meta = {
  "name": "dailyrpg",
  "command": [
    "dailyrpg"
  ],
  "category": "rpg",
  "desc": "Klaim hadiah harian",
  "usage": ".dailyrpg",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 0,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/rpg").split('\\').join('/')
module.exports = __vx.plugin("rpg/dailyrpg", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/dailyrpg.js'
  const module = { exports: {} }; const exports = module.exports;
  const hsAsset = require("../../lib/ext/src/lib/assets.js")
  const { getDatabase } = require("../../lib/ext/src/lib/database.js")
  const { addExpWithLevelCheck } = require("../../lib/ext/src/lib/levelHelper.js")
  const config = require("../../lib/ext/config.js")
  const path = require('path')
  const fs = require('fs')
  
  const pluginConfig = {
      name: 'dailyrpg',
      alias: [],
      category: 'rpg',
      description: 'Klaim hadiah harian',
      usage: '.dailyrpg',
      example: '.dailyrpg',
      isOwner: false,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 0,
      energi: 0,
      isEnabled: true
  }
  
  let thumbRpg = null
  hsAsset.tryBuffer('images/vx-rpg').then(b => { if (b) thumbRpg = b }).catch(() => {})
  
  function getContextInfo(title = '🎁 *ᴅᴀɪʟʏ*', body = 'Hadiah Harian') {
      const saluranId = config.saluran?.id || ''
      const saluranName = config.saluran?.name || config.bot?.name || 'WhatsApp Bot'
      
      const contextInfo = {
          forwardingScore: 9999,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
              newsletterJid: saluranId,
              newsletterName: saluranName,
              serverMessageId: 127
          }
      }
      
      
      return contextInfo
  }
  
  function msToTime(duration) {
      const hours = Math.floor((duration / (1000 * 60 * 60)) % 24)
      const minutes = Math.floor((duration / (1000 * 60)) % 60)
      const seconds = Math.floor((duration / 1000) % 60)
      return `${hours} jam ${minutes} menit ${seconds} detik`
  }
  
  async function handler(m, { sock }) {
      const db = getDatabase()
      const user = db.getUser(m.sender)
      if (!user.rpg) user.rpg = {}
      
      const COOLDOWN = 86400000
      const lastClaim = user.rpg.lastDaily || 0
      const now = Date.now()
      
      if (now - lastClaim < COOLDOWN) {
          const remaining = COOLDOWN - (now - lastClaim)
          return m.reply(
              `⏰ *sᴜᴅᴀʜ ᴋʟᴀɪᴍ*\n\n` +
              `> Kamu sudah klaim hadiah harian hari ini\n` +
              `> Kembali dalam: *${msToTime(remaining)}*`
          )
      }
      
      const expReward = 1000
      const moneyReward = 5000
      const energiReward = 3
      
      user.rpg.lastDaily = now
      user.koin = (user.koin || 0) + moneyReward
      user.energi = (user.energi || 0) + energiReward
      
      const levelResult = await addExpWithLevelCheck(sock, m, db, user, expReward)
      db.save()
      
      await m.react('🎁')
      
      let txt = `🎁 *ᴅᴀɪʟʏ ʀᴇᴡᴀʀᴅ*\n\n`
      txt += `╭┈┈⬡「 🎊 *ʜᴀᴅɪᴀʜ* 」\n`
      txt += `┃ 💵 Money: *+Rp ${moneyReward.toLocaleString('id-ID')}*\n`
      txt += `┃ 🚄 Exp: *+${expReward}*\n`
      txt += `┃ ⚡ Energi: *+${energiReward}*\n`
      txt += `╰┈┈┈┈┈┈┈┈⬡\n\n`
      await sock.sendMessage(m.chat, {
          text: txt,
          contextInfo: getContextInfo()
      }, { quoted: m })
  }
  
  module.exports = {
      config: pluginConfig,
      handler
  }
  return module.exports
})
