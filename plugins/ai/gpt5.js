// ai/gpt5 — satu file: metadata + kode fitur (gabungan dari engine3/plugins/ai/gpt5.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "gpt5",
  "command": [
    "gpt5",
    "gpt5nano",
    "gpt41"
  ],
  "category": "ai",
  "desc": "Chat dengan GPT-4.1 Nano via OverChat",
  "usage": ".gpt5 <pertanyaan>",
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
      "gpt5"
    ],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/ai").split('\\').join('/')
module.exports = __vx.plugin("ai/gpt5", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/gpt5.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const { GPT5 } = require("../../lib/ext/src/scraper/gpt5.js");
  const { saluranCtx } = require("../../lib/ext/src/lib/vanxone-context.js");
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.js"));
  
  const pluginConfig = {
    name: "gpt5",
    alias: ["gpt5nano", "gpt41"],
    category: "ai",
    description: "Chat dengan GPT-4.1 Nano via OverChat",
    usage: ".gpt5 <pertanyaan>",
    example: ".gpt5 Apa itu quantum computing?",
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
        `🤖 *GPT-4.1 Nano*\n\n` +
          `Tanya apa aja ke AI, nanti dijawab pakai model GPT-4.1 Nano.\n\n` +
          `*PENGGUNAAN:*\n` +
          `> *${m.prefix}gpt5 <pertanyaan>*\n\n` +
          `*CONTOH:*\n` +
          `> *${m.prefix}gpt5 Apa itu quantum computing?*\n` +
          `> *${m.prefix}gpt5 Buat puisi tentang Indonesia*\n\n` +
          `_Jawaban bisa agak lama, sabar ya_`,
      );
    }
  
    await m.react("🕕");
  
    try {
      const result = await GPT5(text);
  
      if (!result.status) {
        await m.react("☢");
        return m.reply(
          `❌ *GPT-5 Gagal*\n\n> ${result.error || "Gagal mendapatkan respons"}`,
        );
      }
  
      await m.react("✅");
  
      const reply = `${result.answer}`;
  
      await m.reply(reply.length > 4096 ? reply.slice(0, 4096) + "..." : reply, {
        contextInfo: saluranCtx(),
      });
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
