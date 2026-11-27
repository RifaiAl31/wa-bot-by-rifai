// group/delppgc — satu file: metadata + kode fitur (gabungan dari engine3/plugins/group/delppgc.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "delppgc",
  "command": [
    "delppgc",
    "delprofilegc",
    "delppgroup",
    "hapusppgc"
  ],
  "category": "group",
  "desc": "Menghapus foto profil grup",
  "usage": ".delppgc",
  "owner": false,
  "group": true,
  "private": false,
  "premium": false,
  "admin": true,
  "botAdmin": true,
  "cooldown": 10,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/group").split('\\').join('/')
module.exports = __vx.plugin("group/delppgc", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/delppgc.js'
  const __vxExports = {};
  const pluginConfig = {
      name: 'delppgc',
      alias: ['delprofilegc', 'delppgroup', 'hapusppgc'],
      category: 'group',
      description: 'Menghapus foto profil grup',
      usage: '.delppgc',
      example: '.delppgc',
      isOwner: false,
      isPremium: false,
      isGroup: true,
      isPrivate: false,
      isAdmin: true,
      isBotAdmin: true,
      cooldown: 10,
      energi: 0,
      isEnabled: true
  }
  
  async function handler(m, { sock }) {
      try {
          await sock.removeProfilePicture(m.chat)
          
          await m.reply(
              `✅ PP Grup sekarang sudah botak`
          )
      } catch (error) {
          await m.reply(
              `❌ *ɢᴀɢᴀʟ*\n\n` +
              `> Tidak dapat menghapus foto grup.\n` +
              `> _${error.message}_`
          )
      }
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
