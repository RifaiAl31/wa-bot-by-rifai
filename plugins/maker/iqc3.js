// maker/iqc3 — satu file: metadata + kode fitur (gabungan dari engine7/plugins/maker/iqc3.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "iqc3",
  "command": [
    "iqc3",
    "canvasiqc3",
    "iqc3maker"
  ],
  "category": "maker",
  "desc": "Membuat gambar Canvas IQC dari teks",
  "usage": ".iqc3 <teks>",
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
module.exports = __vx.plugin("maker/iqc3", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/iqc3.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const fetch = __vxDef(require("node-fetch"));
  
  const pluginConfig = {
    name: "iqc3",
    alias: ["canvasiqc3", "iqc3maker"],
    category: "maker",
    description: "Membuat gambar Canvas IQC dari teks",
    usage: ".iqc3 <teks>",
    example: ".iqc3 Tes1",
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 1,
    isEnabled: true,
  };
  
  async function handler(m, { sock, text }) {
    if (!text) {
      return m.reply(`⚠️ *Format Salah*\n\nPenggunaan:\n\`.iqc3 <teks>\`\n\nContoh:\n\`.iqc3 Tes1\``);
    }
  
    const queryText = text.trim();
    const apiKey = "4ZtwE";
    const apiUrl = `https://api.theresav.biz.id/canvas/iqc?teks=${encodeURIComponent(queryText)}&apikey=${apiKey}`;
  
    await m.react('⏳');
  
    try {
      const response = await fetch(apiUrl);
      const contentType = response.headers.get('content-type') || '';
  
      // Jika API langsung mengembalikan gambar (Buffer)
      if (contentType.includes('image')) {
        const imageBuffer = await response.buffer();
        await sock.sendMessage(m.chat, {
          image: imageBuffer,
          caption: `✨ *Canvas IQC Generated!*`
        }, { quoted: m });
        await m.react('✅');
        return;
      }
  
      // Jika API mengembalikan JSON
      const resJson = await response.json();
      if (resJson.status && resJson.result) {
        const imageUrl = typeof resJson.result === 'string' ? resJson.result : resJson.result.url;
        await sock.sendMessage(m.chat, {
          image: { url: imageUrl },
          caption: `✨ *Canvas IQC Generated!*`
        }, { quoted: m });
        await m.react('✅');
      } else {
        await m.react('❌');
        m.reply(`❌ *Gagal generate:* ${resJson.message || 'Terjadi kesalahan pada server API.'}`);
      }
  
    } catch (err) {
      console.error('[IQC3 ERROR]', err);
      await m.react('❌');
      await m.reply(`❌ *Terjadi Kesalahan:* ${err.message}`);
    }
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
