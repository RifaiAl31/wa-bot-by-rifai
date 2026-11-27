// owner/hapususer — satu file: metadata + kode fitur (gabungan dari engine7/plugins/owner/hapususer.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "hapususer",
  "command": [
    "hapususer",
    "deluser",
    "deleteuser"
  ],
  "category": "owner",
  "desc": "Hapus user dari database",
  "usage": ".hapususer",
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
module.exports = __vx.plugin("owner/hapususer", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/hapususer.js'
  const __vxExports = {};
  const FEATURE_CREDIT = "Fitur by: Owner Bot";
  
  
  const { getDatabase } = require("../../lib/ext/src/lib/vanxone-database.e4.js");
  const pluginConfig = {
      name: 'hapususer',
      alias: ['deluser','deleteuser'],
      category: 'owner',
      description: 'Hapus user dari database',
      usage: '.hapususer',
      isOwner: true,
      cooldown: 5,
      isEnabled: true
  }
  
  async function handler(m, { sock }) {
  
      const db = getDatabase()
      const args = m.args || []
  
      // ✅ CONFIRM HAPUS
      if (args[0] === '--confirm' && args[1]) {
  
          const target = args[1]
          const user = db.data.users[target]
  
          if (!user) {
              return m.reply(`❌ User tidak ditemukan.`)
          }
  
          delete db.data.users[target]
          db.save()
  
          return m.reply(
  `╭━━━〔 💔 WhatsApp Bot DELETE 💔 〕━━━⬣
  ┃
  ┃ Ara ara~ user berhasil dihapus 😈
  ┃
  ┃ 👤 Target : ${target}
  ┃ 💣 Status : *Terhapus*
  ┃
  ┃ Jangan nakal lagi ya darling...
  ┃ atau kamu berikutnya 😏
  ┃
  ╰━━━━━━━━━━━━━━━━━━⬣`
          )
      }
  
      // 📋 AMBIL USER LIST
      const users = Object.entries(db.data.users || {})
  
      if (users.length === 0) {
          return m.reply(`❌ Tidak ada user di database.`)
      }
  
      // 🔽 FORMAT LIST
      const rows = users.slice(0, 50).map(([jid, user]) => ({
          title: user.name || 'No Name',
          description: `💰 Koin: ${user.koin || 0}`,
          id: `${m.prefix}hapususer --confirm ${jid}`
      }))
  
      // 💗 UI WhatsApp Bot
      await sock.sendMessage(m.chat, {
          text:
  `╭━━━〔 💗 WhatsApp Bot SYSTEM 💗 〕━━━⬣
  ┃
  ┃ Hai ${m.pushName || 'Darling'} 😋
  ┃ Mau hapus siapa nih?
  ┃
  ┃ Pilih user di bawah ya~
  ┃ Jangan salah pilih 😈
  ┃
  ╰━━━━━━━━━━━━━━━━━━⬣`,
          footer: 'WhatsApp Bot 💗',
          interactiveButtons: [
              {
                  name: 'single_select',
                  buttonParamsJson: JSON.stringify({
                      title: '💀 Pilih Target',
                      sections: [
                          {
                              title: 'Daftar User',
                              rows
                          }
                      ]
                  })
              }
          ]
      }, { quoted: m })
  }
  
  
  
  Object.defineProperty(__vxExports, "FEATURE_CREDIT", { enumerable: true, get: () => FEATURE_CREDIT });
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
