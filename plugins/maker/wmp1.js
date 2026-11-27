// maker/wmp1 — satu file: metadata + kode fitur (gabungan dari engine7/plugins/maker/wmp1.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "wmp1",
  "command": [
    "wmp1",
    "canvaswmp1",
    "wmp1meme"
  ],
  "category": "maker",
  "desc": "Membuat gambar Canvas WMP1 dengan teks custom",
  "usage": ".wmp1 <teks1|teks2|teks3|teks4>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/maker").split('\\').join('/')
module.exports = __vx.plugin("maker/wmp1", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/wmp1.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const axios = __vxDef(require("axios"));
  
  const pluginConfig = {
    name: "wmp1",
    alias: ["canvaswmp1", "wmp1meme"],
    category: "maker",
    description: "Membuat gambar Canvas WMP1 dengan teks custom",
    usage: ".wmp1 <teks1|teks2|teks3|teks4>",
    example: ".wmp1 ngapain cemburu|kan|cuman sebatas|teman",
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 1,
    isEnabled: true,
  };
  
  async function handler(m, { sock, args }) {
    const prefix = m.prefix || '.';
    const command = m?.command || 'wmp1';
  
    const text = args.join(' ').trim();
  
    if (!text) {
      if (m.react) await m.react("❌");
      return m.reply(
        `📌 *Cara Penggunaan:*\n` +
        `Ketik *${prefix + command} teks1|teks2|teks3|teks4*\n\n` +
        `Contoh: *${prefix + command} ngapain cemburu|kan|cuman sebatas|teman*`
      );
    }
  
    if (m.react) await m.react("⏳");
  
    try {
      // Format URL API Nexadev WMP1
      const apiUrl = `https://apii.nexadev.my.id/wmp1?text=${encodeURIComponent(text)}`;
  
      // Ambil hasil gambar berupa Buffer
      const response = await axios.get(apiUrl, {
        responseType: 'arraybuffer',
        timeout: 20000
      });
  
      const imageBuffer = Buffer.from(response.data, 'binary');
  
      // Kirim gambar ke WhatsApp
      await sock.sendMessage(m.chat, {
        image: imageBuffer,
        caption: `🎨 *WMP1 Canvas Generator*\n\n💬 *Teks:* ${text}`
      }, { quoted: m });
  
      if (m.react) await m.react("✅");
  
    } catch (e) {
      console.error('[CANVAS WMP1 ERROR]', e);
      if (m.react) await m.react("❌");
      
      const errMsg = e.response?.data?.message || e.message;
      return m.reply(`❌ *Gagal membuat gambar WMP1:* ${errMsg}`);
    }
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
