// info/harilibur — satu file: metadata + kode fitur (gabungan dari engine3/plugins/info/harilibur.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "harilibur",
  "command": [
    "harilibur",
    "libur",
    "harinasional"
  ],
  "category": "info",
  "desc": "Menampilkan informasi hari libur dan hari nasional mendatang",
  "usage": ".harilibur",
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
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/info").split('\\').join('/')
module.exports = __vx.plugin("info/harilibur", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/harilibur.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const axios = __vxDef(require("axios"));
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.js"));
  
  const pluginConfig = {
    name: "harilibur",
    alias: ["libur", "harinasional"],
    category: "info",
    description: "Menampilkan informasi hari libur dan hari nasional mendatang",
    usage: ".harilibur",
    example: ".harilibur",
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 1,
    isEnabled: true,
  };
  
  async function handler(m, { sock }) {
    await m.react("🕕");
  
    try {
      const res = await axios.get("https://api.nexray.eu.cc/information/hari-libur", {
        timeout: 30000,
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
        }
      });
  
      const data = res.data;
      if (!data.status || !data.result) {
        await m.react("❌");
        return m.reply("⚠️ Gagal mengambil informasi hari libur saat ini.");
      }
  
      const r = data.result;
      let caption = `📅 *HARI LIBUR & NASIONAL MENDATANG* 📅\n\n`;
  
      if (r.mendatang.hari_libur && r.mendatang.hari_libur.length > 0) {
        caption += `*Hari Libur Mendatang*\n`;
        r.mendatang.hari_libur.slice(0, 5).forEach(item => {
          caption += `- ${item.date}: ${item.event} (${item.daysUntil} hari lagi)\n`;
        });
        caption += `\n`;
      }
  
      if (r.mendatang.event_nasional && r.mendatang.event_nasional.length > 0) {
        caption += `*Hari Nasional Mendatang*\n`;
        r.mendatang.event_nasional.slice(0, 5).forEach(item => {
          caption += `- ${item.date}: ${item.event} (${item.daysUntil} hari lagi)\n`;
        });
      }
  
      await m.reply(caption.trim());
      await m.react("✅");
  
    } catch (error) {
      console.error("[Hari Libur]", error.message);
      await m.react("☢");
      m.reply("😔 Terjadi kesalahan saat mengambil data hari libur.");
    }
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
