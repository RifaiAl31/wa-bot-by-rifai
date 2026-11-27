// tools/removebg — satu file: metadata + kode fitur (gabungan dari engine3/plugins/tools/removebg.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "removebg",
  "command": [
    "rmbg",
    "nobg",
    "hapusbg"
  ],
  "category": "tools",
  "desc": "Menghapus background gambar",
  "usage": ".removebg (reply gambar)",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 10,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/tools").split('\\').join('/')
module.exports = __vx.plugin("tools/removebg", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/removebg.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const { pixa } = require("../../lib/ext/src/scraper/removebackground.e3.js");
  const fs = __vxDef(require("fs"));
  const path = __vxDef(require("path"));
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.js"));
  const pluginConfig = {
      name: 'removebg',
      alias: ['rmbg', 'nobg', 'hapusbg'],
      category: 'tools',
      description: 'Menghapus background gambar',
      usage: '.removebg (reply gambar)',
      example: '.removebg',
      isOwner: false,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 10,
      energi: 1,
      isEnabled: true
  };
  
  async function handler(m, { sock }) {
      try {
          const isImage = m.isImage || (m.quoted && m.quoted.isImage);
          if (!isImage) {
              return await m.reply('❌ *ɢᴀᴍʙᴀʀ ᴅɪʙᴜᴛᴜʜᴋᴀɴ*\n\n> Reply atau kirim gambar dengan caption .removebg');
          }
          
          await m.react('🕕')
          
          let mediaBuffer;
          if (m.isImage && m.download) {
              mediaBuffer = await m.download();
          } else if (m.quoted && m.quoted.isImage && m.quoted.download) {
              mediaBuffer = await m.quoted.download();
          } else {
              return await m.reply('❌ Gagal mengunduh gambar');
          }
          
          if (!mediaBuffer || !Buffer.isBuffer(mediaBuffer)) {
              return await m.reply('❌ Buffer gambar tidak valid');
          }
          const pathnya = path.join(process.cwd(), 'temp', `rmbg_${Date.now()}.jpg`);
          fs.writeFileSync(pathnya, mediaBuffer);
          const result = await pixa(pathnya);
          
          await sock.sendMessage(m.chat, {
              image: result,
              caption: `✅ *ʙᴀᴄᴋɢʀᴏᴜɴᴅ ᴅɪʜᴀᴘᴜs*\n\n> Background gambar berhasil dihapus`
          }, { quoted: m });
          try {
              fs.unlinkSync(pathnya);
          } catch (e) {}
      } catch (error) {
          console.error('[RemoveBG Error]', error);
          m.reply(te(m.prefix, m.command, m.pushName));
      }
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
