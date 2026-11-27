// info/gagwatch — satu file: metadata + kode fitur (gabungan dari engine3/plugins/info/gagwatch.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "gag2watch",
  "command": [
    "gag2watch",
    "gag2-watch"
  ],
  "category": "info",
  "desc": "Cek informasi stok GAG2 Watch",
  "usage": ".gag2-watch",
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
module.exports = __vx.plugin("info/gagwatch", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/gagwatch.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const axios = __vxDef(require("axios"));
  
  const pluginConfig = {
    name: "gag2watch",
    alias: ["gag2-watch"],
    category: "info",
    description: "Cek informasi stok GAG2 Watch",
    usage: ".gag2-watch",
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 1,
    isEnabled: true,
  };
  
  async function handler(m) {
    await m.react("🕕");
  
    try {
      const response = await axios.get("https://my.izuka-api.xyz/api/tools/gag2-watch?watchItems=Seed");
      const data = response.data;
  
      if (!data.status || !data.data || !data.data.stock) {
        await m.react("❌");
        return m.reply(`Maaf, data GAG2 tidak ditemukan atau sistem sedang bermasalah.`);
      }
  
      const stock = data.data.stock;
      const weather = stock.weather;
  
      let txt = `🌱 *GAG2 STOCK MONITOR*\n\n`;
      txt += `*STATUS:* ${stock.message || '-'}\n`;
      txt += `*RESTOCK IN:* ${stock.restockInLabel || '-'}\n\n`;
  
      if (weather && weather.active) {
        txt += `⛅ *WEATHER:* ${weather.type.toUpperCase()}\n`;
        if (weather.effects && weather.effects.length > 0) {
          txt += `_Efek:_ ${weather.effects[0]}\n`;
        }
        txt += `\n`;
      }
  
      txt += `*SEEDS:*\n`;
      stock.seeds.forEach(s => {
        txt += `- ${s.name}: ${s.quantity}\n`;
      });
      txt += `\n`;
  
      txt += `*GEAR:*\n`;
      stock.gear.forEach(g => {
        txt += `- ${g.name}: ${g.quantity}\n`;
      });
      txt += `\n`;
  
      txt += `*CRATES:*\n`;
      stock.crates.forEach(c => {
        txt += `- ${c.name}: ${c.quantity}\n`;
      });
  
      await m.react("✅");
      await m.reply(txt);
    } catch (error) {
      console.error("[GAG-WATCH Plugin Error]", error);
      await m.react("☢");
      m.reply(`Terjadi kesalahan saat mengambil data GAG. Coba lagi nanti.`);
    }
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
