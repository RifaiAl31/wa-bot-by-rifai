// search/pap — satu file: metadata + kode fitur (gabungan dari engine3/plugins/search/pap.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "pap",
  "command": [
    "pap",
    "papcewe",
    "papcowo",
    "papfemboy"
  ],
  "category": "search",
  "desc": "Minta pap cewe, cowo, atau femboy dari Pinterest",
  "usage": ".pap <cewe/cowo/femboy>",
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
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/search").split('\\').join('/')
module.exports = __vx.plugin("search/pap", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/pap.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.js"));
  const { f } = require("../../lib/ext/src/lib/vanxone-http.js");
  
  const pluginConfig = {
    name: "pap",
    alias: ["papcewe", "papcowo", "papfemboy"],
    category: "search",
    description: "Minta pap cewe, cowo, atau femboy dari Pinterest",
    usage: ".pap <cewe/cowo/femboy>",
    example: ".pap cewe",
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 1,
    isEnabled: true,
  };
  
  async function handler(m, { sock }) {
    const arg = m.args[0]?.toLowerCase();
    const validTypes = ["cewe", "cowo", "femboy"];
  
    if (!arg || !validTypes.includes(arg)) {
      return m.reply("❌ Pilih salah satu tipe pap yang tersedia: `cewe`, `cowo`, atau `femboy`.\n\nContoh: `.pap cewe`");
    }
  
    await m.react("🕕");
  
    try {
      const query = arg;
      
      const data = await f(
        `https://api.cuki.biz.id/api/search/pinterest?apikey=${(global.apiKeys && global.apiKeys.cuki) || ''}&query=${encodeURIComponent(query)}&type=image`
      );
  
      const results = data?.data?.results?.filter(item => item.image_url);
      if (!results || results.length === 0) {
        await m.react("❌");
        return m.reply(`❌ Waduh, pap ${query} lagi kosong nih. Coba lagi nanti.`);
      }
  
      const randomItem = results[Math.floor(Math.random() * results.length)];
      const imageUrl = randomItem.image_url;
  
      if (!imageUrl) {
        await m.react("❌");
        return m.reply("⚠️ Gambar tidak tersedia.");
      }
  
      await sock.sendButtons(m.chat, {
        image: { url: imageUrl },
        text: `📸 *PAP ${arg.toUpperCase()}*`,
        footer: "Pilih menu pap lainnya di bawah ini 👇",
        buttons: [
          { displayText: "🔁 Next", id: `${m.prefix}pap ${arg}` },
          { displayText: "👧 Cewe", id: `${m.prefix}pap cewe` },
          { displayText: "👦 Cowo", id: `${m.prefix}pap cowo` },
          { displayText: "⚧ Femboy", id: `${m.prefix}pap femboy` },
        ],
      }, { quoted: m });
  
      await m.react("✅");
  
    } catch (error) {
      console.error("[PAP Search]", error.message);
      await m.react("☢");
      m.reply("😔 Gagal memuat PAP. Server Pinterest mungkin sedang bermasalah.");
    }
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
