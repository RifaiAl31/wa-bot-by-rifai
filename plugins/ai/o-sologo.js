// ai/sologo — satu file: metadata + kode fitur (gabungan dari engine3/plugins/ai/sologo.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "sologo",
  "command": [
    "sologo",
    "ailogo",
    "bikinlogo"
  ],
  "category": "ai",
  "desc": "Membuat logo menggunakan AI dari teks (prompt)",
  "usage": ".sologo <prompt>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 10,
  "energi": 2,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/ai").split('\\').join('/')
module.exports = __vx.plugin("ai/sologo", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/sologo.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const axios = __vxDef(require("axios"));
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.js"));
  
  const pluginConfig = {
    name: "sologo",
    alias: ["ailogo", "bikinlogo"],
    category: "ai",
    description: "Membuat logo menggunakan AI dari teks (prompt)",
    usage: ".sologo <prompt>",
    example: ".sologo Kucing lucu warna biru",
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 10,
    energi: 2,
    isEnabled: true,
  };
  
  async function handler(m, { sock }) {
    const prompt = m.text?.trim() || m.args.join(" ");
  
    if (!prompt) {
      return m.reply("❌ Masukkan deskripsi logo yang ingin dibuat.\n\nContoh: `.sologo robot keren warna merah`");
    }
  
    await m.react("🕕");
  
    try {
      const apiUrl = `https://api.nexray.eu.cc/ai/sologo?prompt=${encodeURIComponent(prompt)}`;
      const res = await axios.get(apiUrl, {
        timeout: 120000,
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
        }
      });
  
      const data = res.data;
      if (!data.status || !data.result || data.result.length === 0) {
        await m.react("❌");
        return m.reply("⚠️ AI gagal membuat logo. Coba gunakan prompt (deskripsi) yang lain.");
      }
  
      const logo = data.result[0];
  
      const caption = `🎨 *SOLOGO AI* 🎨\n\n` +
        `*Prompt:* ${prompt}\n` +
        `*Judul:* ${logo.title}\n` +
        `*Deskripsi:* ${logo.desc}\n` +
        `*Tipe:* ${logo.logo_type || "origin"}`;
  
      await sock.sendMessage(m.chat, {
        image: { url: logo.thumbnail },
        caption: caption
      }, { quoted: m });
  
      await m.react("✅");
  
    } catch (error) { globalThis.__vanxoneCatch?.(error);
      console.error("[SoLogo AI]", error.message);
      await m.react("☢");
      m.reply("😔 Terjadi kesalahan saat memproses permintaan ke AI.");
    }
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
