// owner/aktifaudiomenu — satu file: metadata + kode fitur (gabungan dari engine3/plugins/owner/aktifaudiomenu.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "aktifaudiomenu",
  "command": [
    "aktifaudiomenu",
    "audiomenu",
    "setaudiomenu",
    "toggleaudiomenu"
  ],
  "category": "owner",
  "desc": "Toggle audio saat menampilkan menu",
  "usage": ".aktifaudiomenu ya/gak",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
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
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/owner").split('\\').join('/')
module.exports = __vx.plugin("owner/aktifaudiomenu", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/aktifaudiomenu.js'
  const __vxExports = {};
  const { getDatabase } = require("../../lib/ext/src/lib/vanxone-database.js");
  const pluginConfig = {
      name: 'aktifaudiomenu',
      alias: ['audiomenu', 'setaudiomenu', 'toggleaudiomenu'],
      category: 'owner',
      description: 'Toggle audio saat menampilkan menu',
      usage: '.aktifaudiomenu ya/gak',
      example: '.aktifaudiomenu ya',
      isOwner: true,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 3,
      energi: 0,
      isEnabled: true
  }
  
  async function handler(m, { sock, db }) {
      const args = m.args || []
      const option = args[0]?.toLowerCase()
  
      const current = db.setting('audioMenu') !== false
  
      if (!option) {
          return m.reply(
              `🔊 *ᴀᴜᴅɪᴏ ᴍᴇɴᴜ sᴇᴛᴛɪɴɢ*\n\n` +
              `> Status: *${current ? '✅ Aktif' : '❌ Nonaktif'}*\n\n` +
              `*Cara pakai:*\n` +
              `> \`${m.prefix}aktifaudiomenu ya\` - Aktifkan audio\n` +
              `> \`${m.prefix}aktifaudiomenu gak\` - Nonaktifkan audio`
          )
      }
  
      if (option === 'ya' || option === 'on' || option === '1' || option === 'aktif') {
          if (current) {
              return m.reply(`⚠️ Audio menu sudah aktif!`)
          }
          db.setting('audioMenu', true)
          await db.save()
          await m.react('✅')
          return m.reply(`✅ Audio menu *diaktifkan*!\n\n> Sekarang ketika ada yang ketik \`.menu\`, audio akan muncul.`)
      }
  
      if (option === 'gak' || option === 'off' || option === '0' || option === 'nonaktif') {
          if (!current) {
              return m.reply(`⚠️ Audio menu sudah nonaktif!`)
          }
          db.setting('audioMenu', false)
          await db.save()
          await m.react('✅')
          return m.reply(`❌ Audio menu *dinonaktifkan*!\n\n> Sekarang \`.menu\` tidak akan ada audio.`)
      }
  
      return m.reply(`❌ Opsi tidak valid!\n\nGunakan: \`ya\` atau \`gak\``)
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
