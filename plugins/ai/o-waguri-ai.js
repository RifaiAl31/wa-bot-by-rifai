// ai/waguri-ai — satu file: metadata + kode fitur (gabungan dari engine3/plugins/ai/waguri-ai.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "waguri-ai",
  "command": [
    "waguri-ai",
    "waguriai",
    "waguri"
  ],
  "category": "ai",
  "desc": "Chat dengan Waguri-san — Gadis pemalu yang lupa kacamata",
  "usage": ".waguri-ai <pertanyaan>",
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
module.exports = __vx.plugin("ai/waguri-ai", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/waguri-ai.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const { UnlimitedAI } = require("../../lib/ext/src/scraper/unlimitedai.js");
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.js"));
  
  const pluginConfig = {
    name: "waguri-ai",
    alias: ["waguriai", "waguri"],
    category: "ai",
    description: "Chat dengan Waguri-san — Gadis pemalu yang lupa kacamata",
    usage: ".waguri-ai <pertanyaan>",
    example: ".waguri-ai Waguri-san, halo!",
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 10,
    energi: 2,
    isEnabled: true,
  };
  
  async function handler(m, { sock }) {
    const text = m.args.join(" ");
    if (!text) {
      return m.reply(
        `👓 *Waguri-san*\n\n` +
          `> Gadis pemalu dari "The Girl I Like Forgot Her Glasses"\n> Manis, perhatian, dan sering salah tingkah~\n\n` +
          `*PENGGUNAAN:*\n` +
          `> *${m.prefix}waguri-ai <pertanyaan>*\n\n` +
          `*CONTOH:*\n` +
          `> *${m.prefix}waguri-ai Waguri-san, halo!*`
      );
    }
  
    await m.react("🕕");
  
    try {
      const result = await UnlimitedAI(text, "waguri-ai");
  
      if (!result.status) {
        await m.react("☢");
        return m.reply(`❌ *Waguri AI Error*\n\n> ${result.error || "Gagal mendapatkan respons"}`);
      }
  
      await m.react("✅");
      const reply = result.answer;
      await m.reply(reply.length > 4096 ? reply.slice(0, 4096) + "..." : reply);
    } catch (e) { globalThis.__vanxoneCatch?.(e);
      console.error(e);
      await m.react("☢");
      m.reply(te(m.prefix, m.command, m.pushName));
    }
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
