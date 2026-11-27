// maker/quotephoto — satu file: metadata + kode fitur (gabungan dari engine7/plugins/maker/quotephoto.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "quotephoto",
  "command": [
    "quotephoto",
    "qphoto",
    "quotepic",
    "katatutur",
    "picturequote"
  ],
  "category": "maker",
  "desc": "Buat gambar kata-kata quote estetik di atas kertas",
  "usage": ".quotephoto teks|author",
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
module.exports = __vx.plugin("maker/quotephoto", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/quotephoto.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const fetch = __vxDef(require("node-fetch"));
  
  const pluginConfig = {
    name: "quotephoto",
    alias: ["qphoto", "quotepic", "katatutur", "picturequote"],
    category: "maker",
    description: "Buat gambar kata-kata quote estetik di atas kertas",
    usage: ".quotephoto teks|author",
    example: ".quotephoto Jangan ragu untuk memulai hal baru|Geto",
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
      return m.reply(`⚠️ *Format Salah*\n\nPenggunaan:\n\`.quotephoto teks|author\`\n\nContoh:\n\`.quotephoto Jangan ragu untuk memulai hal baru|Geto\``);
    }
  
    // Parse argumen teks dan author (pemisah menggunakan "|")
    let [teksInput, authorInput] = text.split('|').map(v => v ? v.trim() : '');
  
    if (!teksInput) {
      return m.reply(`⚠️ Masukkan teks quote yang ingin dibuat!\n\nContoh:\n\`.quotephoto Tetap semangat meskipun lelah|Geto\``);
    }
  
    // Jika author tidak diisi, otomatis menggunakan pushname / nama pengirim
    const authorName = authorInput || m.pushName || 'Anonymous';
    const apiKey = "4ZtwE";
    const apiUrl = `https://api.theresav.biz.id/canvas/reminder?teks=${encodeURIComponent(teksInput)}&author=${encodeURIComponent(authorName)}&apikey=${apiKey}`;
  
    await m.react('⏳');
  
    try {
      const response = await fetch(apiUrl);
      const contentType = response.headers.get('content-type') || '';
  
      // Jika API langsung mengembalikan gambar (Buffer)
      if (contentType.includes('image')) {
        const imageBuffer = await response.buffer();
        await sock.sendMessage(m.chat, {
          image: imageBuffer,
          caption: `✨ *Quote Photo Generated!*`
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
          caption: `✨ *Quote Photo Generated!*`
        }, { quoted: m });
        await m.react('✅');
      } else {
        await m.react('❌');
        m.reply(`❌ *Gagal generate:* ${resJson.message || 'Terjadi kesalahan pada server API.'}`);
      }
  
    } catch (err) {
      console.error('[QUOTE PHOTO ERROR]', err);
      await m.react('❌');
      await m.reply(`❌ *Terjadi Kesalahan:* ${err.message}`);
    }
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
