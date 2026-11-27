// tools/delpp — satu file: metadata + kode fitur (gabungan dari engine3/plugins/tools/delpp.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "delpp",
  "command": [
    "delpp",
    "delprofilebot",
    "delppbot",
    "hapusppbot"
  ],
  "category": "tools",
  "desc": "Menghapus foto profil bot",
  "usage": ".delpp",
  "owner": true,
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
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/tools").split('\\').join('/')
module.exports = __vx.plugin("tools/delpp", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/delpp.js'
  const __vxExports = {};
  const pluginConfig = {
      name: 'delpp',
      alias: ['delprofilebot', 'delppbot', 'hapusppbot'],
      category: 'tools',
      description: 'Menghapus foto profil bot',
      usage: '.delpp',
      example: '.delpp',
      isOwner: true,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 10,
      energi: 0,
      isEnabled: true
  }
  
  async function handler(m, { sock }) {
      try {
          const botJid = sock.user?.id
          if (!botJid) {
              await m.reply(`❌ Bot JID tidak ditemukan.`)
              return
          }
          
          await sock.removeProfilePicture(botJid)
          
          await m.reply(
              `✅ *ᴘᴘ ʙᴏᴛ ᴅɪʜᴀᴘᴜs*\n\n` +
              `> Foto profil bot berhasil dihapus!`
          )
      } catch (error) { globalThis.__vanxoneCatch?.(error);
          await m.reply(
              `❌ *ɢᴀɢᴀʟ*\n\n` +
              `> Tidak dapat menghapus foto bot.\n` +
              `> _${error.message}_`
          )
      }
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
