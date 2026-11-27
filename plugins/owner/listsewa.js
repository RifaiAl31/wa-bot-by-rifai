// owner/listsewa — satu file: metadata + kode fitur (gabungan dari engine3/plugins/owner/listsewa.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "listsewa",
  "command": [
    "sewalist",
    "daftarsewa"
  ],
  "category": "owner",
  "desc": "Lihat daftar grup yang terdaftar sewa",
  "usage": ".listsewa",
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
module.exports = __vx.plugin("owner/listsewa", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/listsewa.js'
  const __vxNs = (m) => (m && m.__esModule ? m : (m !== null && (typeof m === 'object' || typeof m === 'function') ? Object.assign(Object.create(null), m, { default: m }) : { default: m }));
  const __vxExports = {};
  const { getDatabase } = require("../../lib/ext/src/lib/vanxone-database.js");
  const timeHelper = __vxNs(require("../../lib/ext/src/lib/vanxone-time.js"));
  const pluginConfig = {
      name: 'listsewa',
      alias: ['sewalist', 'daftarsewa'],
      category: 'owner',
      description: 'Lihat daftar grup yang terdaftar sewa',
      usage: '.listsewa',
      example: '.listsewa',
      isOwner: true,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 5,
      energi: 0,
      isEnabled: true
  }
  
  function formatCountdown(data) {
      if (data.status === 'expired') return '🚫 EXPIRED (left)'
      if (data.isLifetime) return '♾️ Permanent'
      const diff = data.expiredAt - Date.now()
      if (diff <= 0) return '❌ EXPIRED'
      const days = Math.floor(diff / 86400000)
      const hours = Math.floor((diff % 86400000) / 3600000)
      const minutes = Math.floor((diff % 3600000) / 60000)
      if (days > 0) return `${days}d ${hours}h`
      if (hours > 0) return `${hours}h ${minutes}m`
      return `${minutes}m`
  }
  
  function getStatusEmoji(data) {
      if (data.status === 'expired') return '🚫'
      if (data.isLifetime) return '♾️'
      const diff = data.expiredAt - Date.now()
      if (diff <= 0) return '❌'
      if (diff <= 259200000) return '⚠️'
      return '✅'
  }
  
  function handler(m) {
      const db = getDatabase()
      if (!db.db.data.sewa) {
          db.db.data.sewa = { enabled: false, groups: {} }
          db.db.write()
      }
  
      const sewaGroups = db.db.data.sewa.groups || {}
      const groupIds = Object.keys(sewaGroups)
  
      if (groupIds.length === 0) {
          return m.reply(
              `📋 *DAFTAR SEWA*\n\n` +
              `Status: *${db.db.data.sewa.enabled ? '✅ AKTIF' : '❌ NONAKTIF'}*\n` +
              `Belum ada grup terdaftar\n\n` +
              `Tambah dengan: *${m.prefix}addsewa <link> <durasi>*`
          )
      }
  
      const sorted = groupIds.sort((a, b) => {
          const aData = sewaGroups[a]
          const bData = sewaGroups[b]
          if (aData.isLifetime && !bData.isLifetime) return 1
          if (!aData.isLifetime && bData.isLifetime) return -1
          return (aData.expiredAt || 0) - (bData.expiredAt || 0)
      })
  
      const active = sorted.filter(id => sewaGroups[id].isLifetime || sewaGroups[id].expiredAt > Date.now())
      const expired = sorted.filter(id => !sewaGroups[id].isLifetime && sewaGroups[id].expiredAt <= Date.now())
  
      let text = `📋 *DAFTAR SEWA*\n\n`
      text += `Status sistem: *${db.db.data.sewa.enabled ? '✅ AKTIF' : '❌ NONAKTIF'}*\n`
      text += `Total: *${groupIds.length}* grup (${active.length} aktif, ${expired.length} expired)\n\n`
  
      for (let i = 0; i < sorted.length; i++) {
          const gid = sorted[i]
          const data = sewaGroups[gid]
          const status = getStatusEmoji(data)
          const countdown = formatCountdown(data)
          const addedDate = data.addedAt ? timeHelper.fromTimestamp(data.addedAt, 'DD/MM/YYYY') : '-'
  
          text += `${status} *${i + 1}. ${data.name || 'Unknown'}*\n`
          text += `   ID: ${gid.split('@')[0]}\n`
          text += `   Sisa: ${countdown}\n`
          text += `   Ditambah: ${addedDate}\n\n`
      }
  
      text += `*AKSI:*\n`
      text += `• *${m.prefix}renewsewa <id> <durasi>* — Perpanjang\n`
      text += `• *${m.prefix}delsewa <id>* — Hapus dari whitelist`
  
      return m.reply(text)
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
