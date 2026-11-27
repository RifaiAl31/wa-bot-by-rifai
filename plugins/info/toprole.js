// main/toprole — satu file: metadata + kode fitur (gabungan dari engine8/plugins/main/toprole.js)
const __vx = require("../../lib/adapter/e8.js")
const __meta = {
  "name": "toprole",
  "command": [
    "toprole",
    "topperan",
    "rankrole"
  ],
  "category": "info",
  "desc": "Lihat leaderboard berdasarkan role user",
  "usage": ".toprole",
  "owner": false,
  "group": false,
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
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/main").split('\\').join('/')
module.exports = __vx.plugin("main/toprole", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/toprole.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const { getDatabase } = require("../../lib/ext/src/lib/vanxone-database.e8.js");
  const config = __vxDef(require("../../lib/ext/config.e8.js"));
  const fs = __vxDef(require("fs"));
  const path = __vxDef(require("path"));
  
  const pluginConfig = {
      name: 'toprole',
      alias: ['toprole', 'topperan', 'toprole', 'rankrole'],
      category: 'main',
      description: 'Lihat leaderboard berdasarkan role user',
      usage: '.toprole',
      example: '.toprole',
      isOwner: false,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 10,
      energi: 0,
      isEnabled: true
  }
  
  const MEDALS = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟']
  
  const ROLE_ORDER = ['owner', 'partner', 'member', 'user']
  const ROLE_EMOJI = {
      owner:   '👑',
      partner: '🤝',
      member:  '🌿',
      user:    '👤',
  }
  const ROLE_LABEL = {
      owner:   'Owner',
      partner: 'Partner',
      member:  'Member',
      user:    'User',
  }
  
  function formatNumber(num) {
      if (num >= 1000000000000) return (num / 1000000000000).toFixed(2) + 'T'
      if (num >= 1000000000) return (num / 1000000000).toFixed(2) + 'B'
      if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M'
      if (num >= 1000) return (num / 1000).toFixed(2) + 'K'
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  }
  
  async function handler(m, { sock }) {
      const db = getDatabase()
      const dbData = db.data?.users || db.getAllUsers?.() || {}
  
      const grouped = {}
      for (const role of ROLE_ORDER) grouped[role] = []
  
      const senderJid = m.sender.replace('@s.whatsapp.net', '')
  
      for (const [jid, userData] of Object.entries(dbData)) {
          if (!jid || jid === 'undefined') continue
          if (jid.length > 15 || jid.startsWith('120')) continue
  
          const isOwner = config.isOwner?.(jid + '@s.whatsapp.net') || false
          const isPartner = config.isPartner?.(jid + '@s.whatsapp.net') || userData?.role === 'PARTNER' || false
  
          const role = isOwner ? 'owner'
              : isPartner ? 'partner'
              : (userData?.role?.toLowerCase() === 'member' ? 'member' : 'user')
  
          grouped[role].push({
              jid,
              name: userData.name || jid.split('@')[0],
              koin: userData.koin || 0,
              exp: userData.rpg?.exp || userData.exp || 0,
              level: userData.rpg?.level || userData.level || 1,
              energi: userData.energi || 0,
              stamina: userData.rpg?.stamina || 0,
              maxStamina: userData.rpg?.maxStamina || 100,
              role,
          })
      }
  
      const mentions = []
      let text = `👥 *TOP ROLE LEADERBOARD* 👥\n\n`
      text += `Distribusi user berdasarkan role mereka!\n\n`
  
      for (const role of ROLE_ORDER) {
          const list = grouped[role]
          if (list.length === 0) continue
  
          const emoji = ROLE_EMOJI[role]
          const label = ROLE_LABEL[role]
  
          list.sort((a, b) => b.exp - a.exp)
          
  const showAll = role === 'owner'
  const displayed = showAll ? list : list.slice(0, 5)
  
  text += `╭┈┈⬡「 ${emoji} *${label.toUpperCase()}* — ${list.length} user 」\n`
  
  displayed.forEach((u, i) => {
      const medal = MEDALS[i] || `${i + 1}.`
      const isMe = u.jid === senderJid ? ' *(You)*' : ''
      text += `┃ ${medal} @${u.jid.split('@')[0]}${isMe}\n`
      text += `┃    └ Lv.${u.level} | Koin: ${formatNumber(u.koin)} | EXP: ${formatNumber(u.exp)}\n`
      if (i < displayed.length - 1) text += `┃\n`
      mentions.push(u.jid.includes('@') ? u.jid : u.jid + '@s.whatsapp.net')
  })
  
  if (!showAll && list.length > 5) {
      text += `┃\n┃ _...dan ${list.length - 5} user lainnya_\n`
  }
  
  text += `╰┈┈┈┈┈┈┈┈⬡\n\n`
      }
  
      let senderRole = 'user'
      const senderData = dbData[senderJid] || dbData[senderJid + '@s.whatsapp.net'] || {}
      const senderFull = senderJid + '@s.whatsapp.net'
      if (config.isOwner?.(senderFull)) senderRole = 'owner'
      else if (config.isPartner?.(senderFull) || senderData?.role === 'PARTNER') senderRole = 'partner'
      else if (senderData?.role?.toLowerCase() === 'member') senderRole = 'member'
  
      const senderRankInRole = grouped[senderRole]?.findIndex(u => u.jid === senderJid)
      if (senderRankInRole !== -1 && senderRankInRole !== undefined) {
          text += `> Kamu: *${ROLE_EMOJI[senderRole]} ${ROLE_LABEL[senderRole]}* — Peringkat *#${senderRankInRole + 1}* di role ini.`
      } else {
          text += `> Kamu belum terdaftar di database.`
      }
  
      await m.reply(text, { mentions })
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
