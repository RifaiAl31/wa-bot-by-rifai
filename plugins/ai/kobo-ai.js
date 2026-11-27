// ai/kobo-ai — satu file: metadata + kode fitur (gabungan dari engine3/plugins/ai/kobo-ai.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "kobo-ai",
  "command": [
    "kobo-ai",
    "koboai",
    "kobo"
  ],
  "category": "ai",
  "desc": "Chat dengan Kobo Kanaeru — VTuber Hololive ID",
  "usage": ".kobo-ai <pertanyaan>",
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
    "scrapers": [
      "unlimitedai"
    ],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/ai").split('\\').join('/')
module.exports = __vx.plugin("ai/kobo-ai", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/kobo-ai.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const { UnlimitedAI } = require("../../lib/ext/src/scraper/unlimitedai.js");
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.js"));
  
  const pluginConfig = {
    name: "kobo-ai",
    alias: ["koboai", "kobo"],
    category: "ai",
    description: "Chat dengan Kobo Kanaeru — VTuber Hololive ID",
    usage: ".kobo-ai <pertanyaan>",
    example: ".kobo-ai Kobo lagi apa?",
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
        `🌬️ *Kobo Kanaeru*\n\n` +
          `> VTuber Hololive Indonesia Gen 3\n> Wind Shaman yang cheerfull dan suka prank!\n\n` +
          `*PENGGUNAAN:*\n` +
          `> *${m.prefix}kobo-ai <pertanyaan>*\n\n` +
          `*CONTOH:*\n` +
          `> *${m.prefix}kobo-ai Kobo lagi apa?*`
      );
    }
  
    await m.react("🕕");
  
    try {
      const result = await UnlimitedAI(text, "kobo-ai");
  
      if (!result.status) {
        await m.react("☢");
        return m.reply(`❌ *Kobo AI Error*\n\n> ${result.error || "Gagal mendapatkan respons"}`);
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
