// tools/ptv — satu file: metadata + kode fitur (gabungan dari engine3/plugins/tools/ptv.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "ptv",
  "command": [
    "ptv",
    "pvideo",
    "circlevideo"
  ],
  "category": "tools",
  "desc": "Kirim video sebagai PTV (circle video)",
  "usage": ".ptv (reply video)",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/tools").split('\\').join('/')
module.exports = __vx.plugin("tools/ptv", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/ptv.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.js"));
  const pluginConfig = {
      name: 'ptv',
      alias: ['pvideo', 'circlevideo'],
      category: 'tools',
      description: 'Kirim video sebagai PTV (circle video)',
      usage: '.ptv (reply video)',
      example: '.ptv',
      isOwner: false,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 5,
      energi: 1,
      isEnabled: true
  }
  
  async function handler(m, { sock }) {
      let video = null
      
      if (m.quoted && m.quoted.isVideo) {
          try {
              video = await m.quoted.download()
          } catch (e) { globalThis.__vanxoneCatch?.(e);
              return m.reply(`❌ Gagal download video dari quoted.`)
          }
      } else if (m.isVideo) {
          try {
              video = await m.download()
          } catch (e) { globalThis.__vanxoneCatch?.(e);
              return m.reply(`❌ Gagal download video.`)
          }
      }
      
      if (!video) {
          return m.reply(
              `⚠️ *ᴄᴀʀᴀ ᴘᴀᴋᴀɪ*\n\n` +
              `> Kirim *video* atau *balas video* lalu ketik:\n` +
              `> \`${m.prefix}ptv\``
          )
      }
      
      await m.reply(`🕕 *ᴍᴇᴍʙᴜᴀᴛ ᴘᴛᴠ...*`)
      
      try {
          await sock.sendMessage(m.chat, {
              video: video,
              mimetype: 'video/mp4',
              gifPlayback: true,
              ptv: true
          }, { quoted: m })
          
          m.react('✅')
          
      } catch (err) { globalThis.__vanxoneCatch?.(err);
          return m.reply(te(m.prefix, m.command, m.pushName))
      }
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
