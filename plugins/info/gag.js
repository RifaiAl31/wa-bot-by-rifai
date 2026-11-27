// info/gag — satu file: metadata + kode fitur (gabungan dari engine3/plugins/info/gag.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "gag",
  "command": [
    "gag",
    "growagarden",
    "gaginfo"
  ],
  "category": "info",
  "desc": "Menampilkan informasi stok Grow a Garden",
  "usage": ".gag",
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
module.exports = __vx.plugin("info/gag", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/gag.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const axios = __vxDef(require("axios"));
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.js"));
  
  const pluginConfig = {
    name: "gag",
    alias: ["growagarden", "gaginfo"],
    category: "info",
    description: "Menampilkan informasi stok Grow a Garden",
    usage: ".gag",
    example: ".gag",
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
      const res = await axios.get("https://api.nexray.eu.cc/information/growagarden", {
        timeout: 30000,
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
        }
      });
  
      const data = res.data;
      if (!data.status || !data.result) {
        await m.react("❌");
        return m.reply("⚠️ Gagal mengambil informasi Grow a Garden saat ini.");
      }
  
      const r = data.result;
  
      const formatStock = (arr, title) => {
        if (!arr || arr.length === 0) return "";
        let txt = `*${title}*\n`;
        arr.forEach(item => {
          txt += `- ${item.name}: ${item.value}\n`;
        });
        return txt + "\n";
      };
  
      let caption = `🌱 *GROW A GARDEN INFO* 🌱\n\n`;
  
      caption += formatStock(r.gearStock, "⚙️ Gear Stock");
      caption += formatStock(r.eggStock, "🥚 Egg Stock");
      caption += formatStock(r.eventStock, "🎟️ Event Stock");
      caption += formatStock(r.cosmeticsStock, "👕 Cosmetics Stock");
      caption += formatStock(r.seedsStock, "🌾 Seeds Stock");
      caption += formatStock(r.merchantsStock, "🏪 Merchants Stock");
  
      if (r.lastSeen && r.lastSeen.length > 0) {
        caption += `*👀 Last Seen*\n`;
        r.lastSeen.slice(0, 5).forEach(item => {
          caption += `- ${item.name}: ${item.seen}\n`;
        });
      }
  
      await m.reply(caption.trim());
      await m.react("✅");
  
    } catch (error) {
      console.error("[GAG Info]", error.message);
      await m.react("☢");
      m.reply("😔 Terjadi kesalahan saat mengambil data GAG.");
    }
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
