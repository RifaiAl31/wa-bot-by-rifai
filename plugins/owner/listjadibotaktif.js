// owner/listjadibotaktif — satu file: metadata + kode fitur (gabungan dari engine7/plugins/owner/listjadibotaktif.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "listjadibotaktif",
  "command": [
    "listjadibotaktif",
    "jadibotaktif",
    "activejadibots"
  ],
  "category": "owner",
  "desc": "Lihat jadibot yang sedang aktif dengan detail",
  "usage": ".listjadibotaktif",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/owner").split('\\').join('/')
module.exports = __vx.plugin("owner/listjadibotaktif", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/listjadibotaktif.js'
  const __vxExports = {};
  const { getActiveJadibots } = require("../../lib/ext/src/lib/vanxone-jadibot-manager.js");
  const pluginConfig = {
      name: 'listjadibotaktif',
      alias: ['jadibotaktif', 'activejadibots'],
      category: 'owner',
      description: 'Lihat jadibot yang sedang aktif dengan detail',
      usage: '.listjadibotaktif',
      example: '.listjadibotaktif',
      isOwner: true,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 5,
      energi: 0,
      isEnabled: true
  }
  
  function formatUptime(ms) {
      const seconds = Math.floor(ms / 1000)
      const minutes = Math.floor(seconds / 60)
      const hours = Math.floor(minutes / 60)
      if (hours > 0) return `${hours}h ${minutes % 60}m`
      if (minutes > 0) return `${minutes}m ${seconds % 60}s`
      return `${seconds}s`
  }
  
  async function handler(m, { sock }) {
      const active = getActiveJadibots()
  
      if (active.length === 0) {
          return m.reply(`❌ Tidak ada jadibot yang aktif saat ini`)
      }
  
      let txt = `🟢 *ᴊᴀᴅɪʙᴏᴛ ᴀᴋᴛɪꜰ*\n\n`
      txt += `> 📊 Total: *${active.length}* bot aktif\n\n`
  
      active.forEach((s, i) => {
          const uptime = formatUptime(Date.now() - s.startedAt)
          const owner = s.ownerJid?.split('@')[0] || 'Unknown'
          txt += `*${i + 1}.* 🟢 @${s.id}\n`
          txt += `   ⏱️ *${uptime}* — 👤 @${owner}\n\n`
      })
  
      txt += `> \`${m.prefix}stopalljadibot\` — Hentikan semua`
  
      const mentions = active.flatMap(s => [s.jid, s.ownerJid].filter(Boolean))
  
      await sock.sendMessage(m.chat, {
          text: txt,
          mentions,
          interactiveButtons: [
              {
                  name: 'quick_reply',
                  buttonParamsJson: JSON.stringify({
                      display_text: '🛑 Stop Semua',
                      id: `${m.prefix}stopalljadibot`
                  })
              }
          ]
      }, { quoted: m })
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
