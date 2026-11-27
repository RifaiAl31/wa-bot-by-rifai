// tools/imgtoprompt — satu file: metadata + kode fitur (gabungan dari engine3/plugins/tools/imgtoprompt.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "imgtoprompt",
  "command": [
    "imgtoprompt",
    "img2prompt",
    "imagetoprompt",
    "i2p"
  ],
  "category": "tools",
  "desc": "Mengubah gambar menjadi prompt AI",
  "usage": ".imgtoprompt (reply gambar)",
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
    "scrapers": [
      "img2prompt"
    ],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/tools").split('\\').join('/')
module.exports = __vx.plugin("tools/imgtoprompt", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/imgtoprompt.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  /**
   * @file plugins/tools/imgtoprompt.js
   * @description Plugin untuk mengubah gambar menjadi prompt AI
   */
  
  const imgtoprompt = __vxDef(require("../../lib/ext/src/scraper/img2prompt.e3.js"));
  const fs = __vxDef(require("fs"));
  const path = __vxDef(require("path"));
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.js"));
  const pluginConfig = {
      name: 'imgtoprompt',
      alias: ['img2prompt', 'imagetoprompt', 'i2p'],
      category: 'tools',
      description: 'Mengubah gambar menjadi prompt AI',
      usage: '.imgtoprompt (reply gambar)',
      example: '.imgtoprompt',
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
              return await m.reply('❌ *ɢᴀᴍʙᴀʀ ᴅɪʙᴜᴛᴜʜᴋᴀɴ*\n\n> Reply atau kirim gambar dengan caption .imgtoprompt');
          }
          
          await m.reply('🕕 *ᴍᴇᴍᴘʀᴏsᴇs ɢᴀᴍʙᴀʀ...*\n\n> Menganalisis gambar untuk menghasilkan prompt');
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
          const tmpDir = path.join(process.cwd(), 'temp');
          if (!fs.existsSync(tmpDir)) {
              fs.mkdirSync(tmpDir, { recursive: true });
          }
          
          const tmpFile = path.join(tmpDir, `img2prompt_${Date.now()}.webp`);
          fs.writeFileSync(tmpFile, mediaBuffer);
          const result = await imgtoprompt(tmpFile);
          try {
              fs.unlinkSync(tmpFile);
          } catch (e) { globalThis.__vanxoneCatch?.(e);}
          if (result.status === 'eror' || !result.prompt) {
              return await m.reply(`❌ *ɢᴀɢᴀʟ*\n\n> ${result.msg || 'Tidak dapat menghasilkan prompt dari gambar ini'}`);
          }
          const responseText = `🎨 *ɪᴍᴀɢᴇ ᴛᴏ ᴘʀᴏᴍᴘᴛ*\n\n` +
              `\`\`\`${result.prompt}\`\`\`\n\n` +
              `> _Generated at: ${result.generatedAt || new Date().toISOString()}_`;
          await m.reply(responseText);
      } catch (error) { globalThis.__vanxoneCatch?.(error);
          console.error('[ImgToPrompt Error]', error);
          m.reply(te(m.prefix, m.command, m.pushName));
      }
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
