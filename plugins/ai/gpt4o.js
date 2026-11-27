// ai/gpt4o — satu file: metadata + kode fitur (gabungan dari engine3/plugins/ai/gpt4o.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "gpt4o",
  "command": [
    "gpt4o",
    "gpt4"
  ],
  "category": "ai",
  "desc": "Chat dengan GPT-4o",
  "usage": ".gpt4o <pertanyaan>",
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
module.exports = __vx.plugin("ai/gpt4o", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/gpt4o.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.js"));
  const vanxoneApi = __vxDef(require("../../lib/ext/src/lib/vanxone-apimanager.js"));
  const config = __vxDef(require("../../lib/ext/config.e3.js"));
  const pluginConfig = {
    name: "gpt4o",
    alias: ["gpt4"],
    category: "ai",
    description: "Chat dengan GPT-4o",
    usage: ".gpt4o <pertanyaan>",
    example: ".gpt4o Hai apa kabar?",
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 1,
    isEnabled: true,
  };
  
  async function handler(m, { sock }) {
    const text = m.args.join(" ");
    if (!text) {
      return m.reply(
        `🧠 *ɢᴘᴛ-4ᴏ*\n\n> Masukkan pertanyaan\n\n\`Contoh: ${m.prefix}gpt4o Hai apa kabar?\``,
      );
    }
  
    m.react("🕕");
  
    try {
      const data = `https://api.nexray.eu.cc/ai/gpt-3.5-turbo?text=${encodeURIComponent(text)}`
      const res = await fetch(data)
      const json = await res.json()
      if (!json.status || !json.result) throw new Error("Gagal mendapatkan response")
      m.react("✅");
      await m.reply(`${json.result}`);
    } catch (error) { globalThis.__vanxoneCatch?.(error);
      console.log(error);
      m.react("☢");
      m.reply(te(m.prefix, m.command, m.pushName));
    }
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
