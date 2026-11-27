// ai/quillbot — satu file: metadata + kode fitur (gabungan dari engine3/plugins/ai/quillbot.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "quilbot",
  "command": [
    "quilbot",
    "quillbot",
    "parafrase"
  ],
  "category": "ai",
  "desc": "AI Quillbot untuk menulis ulang atau menyempurnakan kalimat",
  "usage": ".quilbot <teks>",
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
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/ai").split('\\').join('/')
module.exports = __vx.plugin("ai/quillbot", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/quillbot.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const axios = __vxDef(require("axios"));
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.js"));
  
  const pluginConfig = {
    name: "quilbot",
    alias: ["quillbot", "parafrase"],
    category: "ai",
    description: "AI Quillbot untuk menulis ulang atau menyempurnakan kalimat",
    usage: ".quilbot <teks>",
    example: ".quilbot Saya sedang makan nasi di rumah",
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 1,
    isEnabled: true,
  };
  
  async function handler(m, { sock }) {
    const text = m.args.join(" ") || m.text?.trim();
  
    if (!text) {
      return m.reply("❌ Masukkan teks yang ingin disempurnakan.\n\nContoh: `.quilbot Saya sedang makan nasi di rumah`");
    }
  
    await m.react("🕕");
  
    try {
      const apiUrl = `https://api.nexray.eu.cc/ai/quillbot?text=${encodeURIComponent(text)}`;
      const res = await axios.get(apiUrl, {
        timeout: 15000,
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
        }
      });
  
      const data = res.data;
      if (!data.status || !data.result) {
        await m.react("❌");
        return m.reply("⚠️ Quillbot gagal memproses teks.");
      }
  
      await m.reply(data.result);
      await m.react("✅");
  
    } catch (error) { globalThis.__vanxoneCatch?.(error);
      console.error("[Quillbot]", error.message);
      await m.react("☢");
      m.reply("😔 Terjadi kesalahan saat memproses teks ke Quillbot.");
    }
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
