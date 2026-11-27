// ai/simi — satu file: metadata + kode fitur (gabungan dari engine3/plugins/ai/simi.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "simi",
  "command": [
    "simi",
    "simisimi"
  ],
  "category": "ai",
  "desc": "Ngobrol santai bareng SimiSimi",
  "usage": ".simi <pesan>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 3,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/ai").split('\\').join('/')
module.exports = __vx.plugin("ai/simi", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/simi.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const axios = __vxDef(require("axios"));
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.js"));
  
  const pluginConfig = {
    name: "simi",
    alias: ["simisimi"],
    category: "ai",
    description: "Ngobrol santai bareng SimiSimi",
    usage: ".simi <pesan>",
    example: ".simi Halo Simi!",
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 3,
    energi: 1,
    isEnabled: true,
  };
  
  async function handler(m, { sock }) {
    const text = m.args.join(" ") || m.text?.trim();
  
    if (!text) {
      return m.reply("❌ Mau ngobrol apa sama Simi?\n\nContoh: `.simi Halo Simi!`");
    }
  
    await m.react("🕕");
  
    try {
      const apiUrl = `https://api.nexray.eu.cc/ai/simisimi?text=${encodeURIComponent(text)}`;
      const res = await axios.get(apiUrl, {
        timeout: 15000,
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
        }
      });
  
      const data = res.data;
      if (!data.status || !data.result) {
        await m.react("❌");
        return m.reply("⚠️ Simi lagi ngambek, nggak mau balas.");
      }
  
      await m.reply(data.result);
      await m.react("✅");
  
    } catch (error) { globalThis.__vanxoneCatch?.(error);
      console.error("[SimiSimi]", error.message);
      await m.react("☢");
      m.reply("😔 Simi gagal membalas pesanmu.");
    }
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
