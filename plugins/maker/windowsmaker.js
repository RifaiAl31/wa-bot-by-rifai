// maker/windowsmaker — satu file: metadata + kode fitur (gabungan dari engine8/plugins/maker/windowsmaker.js)
const __vx = require("../../lib/adapter/e8.js")
const __meta = {
  "name": "windowsmaker",
  "command": [
    "windowsmaker",
    "wm2"
  ],
  "category": "maker",
  "desc": "Fitur Windows Media Player Maker via API",
  "usage": ".wm <teks>",
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
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/maker").split('\\').join('/')
module.exports = __vx.plugin("maker/windowsmaker", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/windowsmaker.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const fetch = __vxDef(require("node-fetch")); 
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.e8.js"));
  
  const pluginConfig = {
    name: "windowsmaker",
    alias: ["wm2"],
    category: "maker",
    description: "Fitur Windows Media Player Maker via API",
    usage: ".wm <teks>",
    example: ".wm Kazs",
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 1,
    isEnabled: true,
  };
  
  const API_KEY = "kyzo_f0e476030972b564";
  const BASE_URL = "https://kyzorohan.web.id/api";
  
  async function handler(m, { sock }) {
    const arg = m.args.join(" ").trim();
  
    if (!arg) {
      return m.reply(
        `❌ *Parameter teks tidak ditemukan.*\n\n` +
        `*Penggunaan:* ${m.prefix}${m.command} <teks>\n` +
        `*Contoh:* ${m.prefix}${m.command} Kazs`
      );
    }
  
    await m.react("🕕");
    try {
      const url = `${BASE_URL}/wmpmaker?text=${encodeURIComponent(arg)}&key=${API_KEY}`;
      const response = await fetch(url);
      const data = await response.json();
  
      if (!data.status || !data.output) throw new Error("Gagal generate gambar WMP Maker");
  
      await sock.sendMessage(
        m.chat,
        { image: { url: data.output } },
        { quoted: m }
      );
      
      await m.react("✅");
    } catch (e) {
      console.error("[WINDOWS_MAKER]", e);
      await m.react("☢");
      m.reply(te(m.prefix, m.command, m.pushName));
    }
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
