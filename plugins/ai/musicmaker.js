// ai/musicmaker — satu file: metadata + kode fitur (gabungan dari engine3/plugins/ai/musicmaker.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "musicmaker",
  "command": [
    "musicmaker",
    "bikinlagu",
    "suno"
  ],
  "category": "ai",
  "desc": "Membuat musik atau lagu menggunakan AI dari teks (prompt)",
  "usage": ".musicmaker <prompt>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 30,
  "energi": 3,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/ai").split('\\').join('/')
module.exports = __vx.plugin("ai/musicmaker", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/musicmaker.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const axios = __vxDef(require("axios"));
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.js"));
  
  const pluginConfig = {
    name: "musicmaker",
    alias: ["bikinlagu", "suno"],
    category: "maker",
    description: "Membuat musik atau lagu menggunakan AI dari teks (prompt)",
    usage: ".musicmaker <prompt>",
    example: ".musicmaker Lagu sedih tentang perpisahan dengan musik piano",
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 30,
    energi: 3,
    isEnabled: true,
  };
  
  async function handler(m, { sock }) {
    const prompt = m.text?.trim() || m.args.join(" ");
  
    if (!prompt) {
      return m.reply("❌ Masukkan deskripsi lagu yang ingin dibuat.\n\nContoh: `.musicmaker Lagu pop romantis yang ceria`");
    }
  
    await m.react("🕕");
  
    try {
      const apiUrl = `https://api.nexray.eu.cc/ai/suno?prompt=${encodeURIComponent(prompt)}`;
      
      const res = await axios.get(apiUrl, {
        timeout: 180000,
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
        }
      });
  
      const data = res.data;
      if (!data.status || !data.result) {
        await m.react("❌");
        return m.reply("⚠️ AI gagal membuat lagu. Coba gunakan prompt (deskripsi) yang lain.");
      }
  
      const r = data.result;
  
      const caption = `🎵 *MUSIC MAKER AI* 🎵\n\n` +
        `*Judul:* ${r.title}\n` +
        `*Tags:* ${r.tags}\n` +
        `*Durasi:* ${r.duration} detik\n\n` +
        `*Lirik:*\n${r.lyrics}`;
  
      await sock.sendMessage(m.chat, {
        audio: { url: r.url },
        mimetype: "audio/mpeg",
        ptt: false,
      }, { quoted: m });
  
      await sock.sendMessage(m.chat, {
        image: { url: r.thumbnail },
        caption: caption
      }, { quoted: m });
  
      await m.react("✅");
  
    } catch (error) { globalThis.__vanxoneCatch?.(error);
      console.error("[Music Maker AI]", error.message);
      await m.react("☢");
      m.reply("😔 Terjadi kesalahan saat memproses permintaan pembuatan lagu ke AI. Server AI mungkin sibuk.");
    }
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
