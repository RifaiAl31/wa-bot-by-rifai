// maker/carbonlocal — satu file: metadata + kode fitur (gabungan dari engine7/plugins/maker/carbonlocal.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "carbonlocal",
  "command": [
    "carbonlocal",
    "carbonlv",
    "carboncanvas",
    "carbonsnap"
  ],
  "category": "maker",
  "desc": "Bikin screenshot kode aesthetic seperti Carbon.now.sh (via Canvas lokal)",
  "usage": ".carbonlocal <kode> (atau reply pesan)",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 8,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/maker").split('\\').join('/')
module.exports = __vx.plugin("maker/carbonlocal", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/carbonlocal.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const config = __vxDef(require("../../lib/ext/config.e7.js"));
  const { generateCarbon } = require("../../lib/ext/src/lib/vanxone-carbon.js");
  const pluginConfig = {
      name: 'carbonlocal',
      alias: ['carbonlv', 'carboncanvas', 'carbonsnap'],
      category: 'maker',
      description: 'Bikin screenshot kode aesthetic seperti Carbon.now.sh (via Canvas lokal)',
      usage: '.carbonlocal <kode> (atau reply pesan)',
      example: '.carbonlocal console.log("Hello Darling!")',
      isOwner: false,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 8,
      energi: 1,
      isEnabled: true
  }
  
  async function handler(m, { sock }) {
      let code = m.args.join(' ') || m.text?.trim() || ''
      
      if (m.quoted) {
          code = m.quoted.text || m.quoted.body || code
      }
      
      if (!code || code.length < 3) {
          return m.reply(
              `💕 *ᴄᴀʀʙᴏɴ ᴄᴏᴅᴇ ꜱɴᴀᴘꜱʜᴏᴛ (ʟᴏᴄᴀʟ)* 💕\n\n` +
              `╭━━━━━━━━━━━━━━━━━━━━━⬣\n` +
              `┃ ✦ *Cara Pakai*\n` +
              `┃\n` +
              `┃   ${m.prefix}carbonlocal <kode>\n` +
              `┃   atau reply pesan dengan .carbonlocal\n` +
              `┃\n` +
              `┃ ✦ *Contoh*\n` +
              `┃\n` +
              `┃   ${m.prefix}carbonlocal console.log("Hello")\n` +
              `┃\n` +
              `┃ 💗 *WhatsApp Bot:* Mau bikin screenshot kode apa darling~?\n` +
              `╰━━━━━━━━━━━━━━━━━━━━━⬣`
          )
      }
      
      m.react('💕')
      await m.reply(`⏳ *ᴘʀᴏᴄᴇꜱꜱɪɴɢ...*\n\n💗 *WhatsApp Bot:* Lagi bikin screenshot kode darling~ tunggu sebentar yaa 🎨`)
      
      try {
          const imageBuffer = await generateCarbon(code)
          
          await sock.sendMessage(m.chat, {
              image: imageBuffer,
              caption: `💕 *ᴄᴀʀʙᴏɴ ᴄᴏᴅᴇ (ʟᴏᴄᴀʟ)* 💕\n\n` +
                      `╭━━━━━━━━━━━━━━━━━━━━━⬣\n` +
                      `┃ ✅ *ʙᴇʀʜᴀꜱɪʟ*\n` +
                      `┃ 📝 *ᴋᴏᴅᴇ*: ${code.length > 50 ? code.substring(0, 50) + '...' : code}\n` +
                      `┃\n` +
                      `┃ 💗 *WhatsApp Bot:* Ini hasilnya darling~ 📸\n` +
                      `╰━━━━━━━━━━━━━━━━━━━━━⬣`
          }, { quoted: m })
          
          m.react('✅')
          
      } catch (err) {
          console.error('[Carbon Canvas] Error:', err)
          m.react('💔')
          return m.reply(
              `💔 *ᴇʀʀᴏʀ*\n\n` +
              `> ${err.message}\n\n` +
              `> Coba lagi ya darling~ 🥺`
          )
      }
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
