// sticker/smeme-animated — satu file: metadata + kode fitur (gabungan dari engine3/plugins/sticker/smeme-animated.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "smeme-animated",
  "command": [
    "smeme-animated",
    "smemevid"
  ],
  "category": "sticker",
  "desc": "Buat stiker meme animasi",
  "usage": ".smeme-animated <teks_atas>|<teks_bawah>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 2,
  "needs": {
    "apikeys": [
      "neoxr"
    ],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/sticker").split('\\').join('/')
module.exports = __vx.plugin("sticker/smeme-animated", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/smeme-animated.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const axios = __vxDef(require("axios"));
  const config = __vxDef(require("../../lib/ext/config.e3.js"));
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.js"));
  const { uploadImage } = require("../../lib/ext/src/lib/vanxone-uploader.js");
  const { downloadMediaMessage, getContentType } = require("../../lib/ext/src/lib/baileys.js");
  
  const pluginConfig = {
    name: 'smeme-animated',
    alias: ['smeme-animated', 'smemevid'],
    category: 'sticker',
    description: 'Buat stiker meme animasi',
    usage: '.smeme-animated <teks_atas>|<teks_bawah>',
    example: '.smeme-animated mas|anies (sambil balas gambar)',
    cooldown: 5,
    energi: 2,
  };
  
  async function handler(m, { sock }) {
    const text = m.text?.trim();
    
    if (!text) {
      return m.reply(`⚠️ Harap masukkan teks atas dan bawah!\nContoh: \`${m.prefix}${m.command} atas|bawah\``);
    }
  
    const parts = text.split('|');
    const top = parts[0]?.trim() || '';
    const bottom = parts[1]?.trim() || '';
  
    const msg = m.message;
    const isQuotedImage = m.quoted && (getContentType(m.quoted.message) === 'imageMessage' || m.quoted.mtype === 'imageMessage');
    const isImage = getContentType(msg) === 'imageMessage' || m.mtype === 'imageMessage';
  
    if (!isImage && !isQuotedImage) {
      return m.reply(`⚠️ Harap kirim atau balas gambar dengan caption \`${m.prefix}${m.command} teks_atas|teks_bawah\``);
    }
  
    await m.react('🕕');
  
    try {
      const targetMsg = isQuotedImage ? m.quoted : m;
      const buffer = await downloadMediaMessage(
        targetMsg,
        'buffer',
        {},
        { logger: console }
      );
  
      const imageUrl = await uploadImage(buffer);
      
      const apiUrl = `https://api.neoxr.eu/api/memegenvid?image=${encodeURIComponent(imageUrl)}&top=${encodeURIComponent(top)}&bottom=${encodeURIComponent(bottom)}&apikey=${config.APIkey.neoxr}`;
      
      const response = await axios.get(apiUrl);
      if (!response.data.status || !response.data.data?.url) {
        return m.reply('❌ Gagal membuat meme, kemungkinan API sedang gangguan.');
      }
  
      const stickerUrl = response.data.data.url;
      const stickerBuffer = await axios.get(stickerUrl, { responseType: 'arraybuffer' }).then(res => res.data);
  
      await sock.sendImageAsSticker(m.chat, stickerBuffer, m, {
          packname: config.sticker.packname,
          author: config.sticker.author
      });
  
      await m.react('✅');
    } catch (error) { globalThis.__vanxoneCatch?.(error);
      await m.react('☢');
      m.reply(te(m.prefix, m.command, m.pushName));
    }
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
