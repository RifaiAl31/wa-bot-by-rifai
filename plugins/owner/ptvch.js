// owner/ptvch — satu file: metadata + kode fitur (gabungan dari engine3/plugins/owner/ptvch.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "ptvch",
  "command": [
    "ptvch",
    "ptvchanel",
    "ptvstory"
  ],
  "category": "owner",
  "desc": "Kirim video sebagai PTV ke channel",
  "usage": ".ptvch (reply video)",
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
module.exports = __vx.plugin("owner/ptvch", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/ptvch.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const config = __vxDef(require("../../lib/ext/config.e3.js"));
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.js"));
  const pluginConfig = {
      name: 'ptvch',
      alias: ['ptvchanel', 'ptvstory'],
      category: 'owner',
      description: 'Kirim video sebagai PTV ke channel',
      usage: '.ptvch (reply video)',
      example: '.ptvch',
      isOwner: true,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 5,
      energi: 0,
      isEnabled: true
  }
  
  async function handler(m, { sock }) {
      let video = null
      
      if (m.quoted && m.quoted.isVideo) {
          try {
              video = await m.quoted.download()
          } catch (e) {
              return m.reply(`❌ Gagal download video dari quoted.`)
          }
      } else if (m.isVideo) {
          try {
              video = await m.download()
          } catch (e) {
              return m.reply(`❌ Gagal download video.`)
          }
      }
      
      if (!video) {
          return m.reply(
              `⚠️ *ᴄᴀʀᴀ ᴘᴀᴋᴀɪ*\n\n` +
              `> Kirim *video* atau *balas video* lalu ketik:\n` +
              `> \`${m.prefix}ptvch\``
          )
      }
      
      const channelId = config.saluran?.id || ''
      
      await m.reply(`🕕 *ᴍᴇɴɢɪʀɪᴍ ᴘᴛᴠ ᴋᴇ ᴄʜᴀɴɴᴇʟ...*`)
      
      try {
          await sock.sendMessage(channelId, {
              video: video,
              mimetype: 'video/mp4',
              gifPlayback: true,
              ptv: true
          })
          
          await m.react('✅')
          return m.reply(`✅ *sᴜᴋsᴇs*\n\n> Video berhasil dikirim ke channel sebagai PTV.`)
          
      } catch (err) {
          return m.reply(te(m.prefix, m.command, m.pushName))
      }
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
