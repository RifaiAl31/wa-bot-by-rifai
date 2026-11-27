// owner/listjadibot — satu file: metadata + kode fitur (gabungan dari engine7/plugins/owner/listjadibot.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "listjadibot",
  "command": [
    "listjadibot",
    "jadibotlist",
    "alljadibot"
  ],
  "category": "owner",
  "desc": "Lihat semua session jadibot yang tersimpan",
  "usage": ".listjadibot",
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
module.exports = __vx.plugin("owner/listjadibot", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/listjadibot.js'
  const __vxExports = {};
  const { getAllJadibotSessions, getActiveJadibots } = require("../../lib/ext/src/lib/vanxone-jadibot-manager.js");
  const pluginConfig = {
      name: 'listjadibot',
      alias: ['jadibotlist', 'alljadibot'],
      category: 'owner',
      description: 'Lihat semua session jadibot yang tersimpan',
      usage: '.listjadibot',
      example: '.listjadibot',
      isOwner: true,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 5,
      energi: 0,
      isEnabled: true
  }
  
  async function handler(m, { sock }) {
      const sessions = getAllJadibotSessions()
      const active = getActiveJadibots()
  
      if (sessions.length === 0) {
          return m.reply(`❌ Tidak ada session jadibot tersimpan`)
      }
  
      let txt = `🤖 *ᴅᴀꜰᴛᴀʀ ᴊᴀᴅɪʙᴏᴛ*\n\n`
      txt += `> 📊 Total: *${sessions.length}* session\n`
      txt += `> 🟢 Aktif: *${active.length}*\n`
      txt += `> ⚫ Offline: *${sessions.length - active.length}*\n\n`
  
      sessions.forEach((s, i) => {
          const status = s.isActive ? '🟢' : '⚫'
          const label = s.isActive ? 'Online' : 'Offline'
          txt += `${status} *${i + 1}.* @${s.id} — _${label}_\n`
      })
  
      txt += `\n> \`${m.prefix}listjadibotaktif\` — Detail aktif\n`
      txt += `> \`${m.prefix}stopalljadibot\` — Stop semua\n`
      txt += `> \`${m.prefix}stopdandeletejadibot @user\` — Hapus session`
  
      const mentions = sessions.map(s => s.jid)
  
      await sock.sendMessage(m.chat, {
          text: txt,
          mentions,
          interactiveButtons: [
              {
                  name: 'quick_reply',
                  buttonParamsJson: JSON.stringify({
                      display_text: '🟢 Lihat Aktif',
                      id: `${m.prefix}listjadibotaktif`
                  })
              },
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
