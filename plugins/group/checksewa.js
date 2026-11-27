// group/checksewa — satu file: metadata + kode fitur (gabungan dari engine3/plugins/group/checksewa.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "checksewa",
  "command": [
    "checksewa",
    "sisasewa"
  ],
  "category": "group",
  "desc": "Cek sisa waktu sewa bot di grup ini",
  "usage": ".checksewa",
  "owner": false,
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
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/group").split('\\').join('/')
module.exports = __vx.plugin("group/checksewa", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/checksewa.js'
  const __vxNs = (m) => (m && m.__esModule ? m : (m !== null && (typeof m === 'object' || typeof m === 'function') ? Object.assign(Object.create(null), m, { default: m }) : { default: m }));
  const __vxExports = {};
  const { getDatabase } = require("../../lib/ext/src/lib/vanxone-database.js");
  const timeHelper = __vxNs(require("../../lib/ext/src/lib/vanxone-time.js"));
  const pluginConfig = {
      name: 'checksewa',
      alias: ['ceksewa', 'sisasewa'],
      category: 'group',
      description: 'Cek sisa waktu sewa bot di grup ini',
      usage: '.checksewa',
      example: '.checksewa',
      isOwner: false,
      isPremium: false,
      isGroup: true,
      isPrivate: false,
      isAdmin: false,
      cooldown: 10,
      energi: 0,
      isEnabled: true
  }
  
  function formatCountdown(expiredAt) {
      const diff = expiredAt - Date.now()
      if (diff <= 0) return { text: 'EXPIRED', expired: true }
      const days = Math.floor(diff / 86400000)
      const hours = Math.floor((diff % 86400000) / 3600000)
      const minutes = Math.floor((diff % 3600000) / 60000)
      let text = ''
      if (days > 0) text += `${days} hari `
      if (hours > 0) text += `${hours} jam `
      if (minutes > 0 && days === 0) text += `${minutes} menit`
      return { text: text.trim(), expired: false }
  }
  
  function handler(m) {
      const db = getDatabase()
      if (!db.db.data.sewa) {
          db.db.data.sewa = { enabled: false, groups: {} }
          db.db.write()
      }
  
      if (!db.db.data.sewa.enabled) {
          return m.reply(`ℹ️ Sistem sewa tidak aktif\n\nBot ini bisa digunakan di semua grup.`)
      }
  
      const sewaData = db.db.data.sewa.groups[m.chat]
  
      if (!sewaData) {
          return m.reply(`❌ Grup ini tidak terdaftar dalam sistem sewa\n\nHubungi owner bot untuk info sewa.`)
      }
  
      const groupName = sewaData.name || m.chat.split('@')[0]
      const addedDate = sewaData.addedAt ? timeHelper.fromTimestamp(sewaData.addedAt, 'D MMMM YYYY') : '-'
  
      if (sewaData.isLifetime) {
          m.react('♾️')
          return m.reply(
              `♾️ *STATUS SEWA*\n\n` +
              `Grup: *${groupName}*\n` +
              `Status: *Permanent* ♾️\n` +
              `Terdaftar sejak: *${addedDate}*\n\n` +
              `Bot akan aktif selamanya di grup ini.`
          )
      }
  
      const countdown = formatCountdown(sewaData.expiredAt)
      const expiredStr = timeHelper.fromTimestamp(sewaData.expiredAt, 'D MMMM YYYY HH:mm')
  
      if (countdown.expired) {
          return m.reply(
              `❌ *SEWA EXPIRED*\n\n` +
              `Grup: *${groupName}*\n` +
              `Berakhir: *${expiredStr}*\n\n` +
              `Hubungi owner bot untuk perpanjang sewa.`
          )
      }
  
      const diff = sewaData.expiredAt - Date.now()
      const isAlmostExpired = diff <= 259200000
  
      m.react(isAlmostExpired ? '⚠️' : '⏱️')
      let text = `⏱️ *STATUS SEWA*\n\n`
      text += `Grup: *${groupName}*\n`
      text += `Sisa waktu: *${countdown.text}*\n`
      text += `Berakhir: *${expiredStr}*\n`
      text += `Terdaftar sejak: *${addedDate}*`
  
      if (isAlmostExpired) {
          text += `\n\n⚠️ Sewa hampir habis! Hubungi owner bot untuk perpanjang.`
      }
  
      return m.reply(text)
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
