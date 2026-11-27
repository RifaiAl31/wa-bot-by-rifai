// tools/setname — satu file: metadata + kode fitur (gabungan dari engine3/plugins/tools/setname.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "setnamebot",
  "command": [
    "setbotnama"
  ],
  "category": "tools",
  "desc": "Mengubah nama profil bot",
  "usage": ".setname <nama baru>",
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
module.exports = __vx.plugin("tools/setname", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/setname.js'
  const __vxExports = {};
  const pluginConfig = {
      name: 'setname',
      alias: ['setnamebot', 'setbotnama'],
      category: 'tools',
      description: 'Mengubah nama profil bot',
      usage: '.setname <nama baru>',
      example: '.setname WhatsApp Bot',
      isOwner: true,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 10,
      energi: 0,
      isEnabled: true
  }
  
  async function handler(m, { sock }) {
      const newName = m.text?.trim()
      
      if (!newName) {
          await m.reply(
              `⚠️ *ᴄᴀʀᴀ ᴘᴀᴋᴀɪ*\n\n` +
              `> \`${m.prefix}setname Nama Bot Baru\``
          )
          return
      }
      
      if (newName.length < 1 || newName.length > 25) {
          await m.reply(
              `⚠️ *ᴠᴀʟɪᴅᴀsɪ*\n\n` +
              `> Nama bot harus 1-25 karakter.`
          )
          return
      }
      
      try {
          await sock.updateProfileName(newName)
          
          await m.reply(
              `✅ *ɴᴀᴍᴀ ʙᴏᴛ ᴅɪᴜʙᴀʜ*\n\n` +
              `> Nama bot sekarang: *${newName}*`
          )
      } catch (error) { globalThis.__vanxoneCatch?.(error);
          await m.reply(
              `❌ *ɢᴀɢᴀʟ*\n\n` +
              `> Tidak dapat mengubah nama bot.\n` +
              `> _${error.message}_`
          )
      }
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
