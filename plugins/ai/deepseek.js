// ai/deepseek — satu file: metadata + kode fitur (gabungan dari engine3/plugins/ai/deepseek.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "deepseek",
  "command": [
    "deepseek",
    "ds",
    "dsv4",
    "deepthink"
  ],
  "category": "ai",
  "desc": "Chat dengan DeepSeek V4 (thinking/reasoning)",
  "usage": ".deepseek <pertanyaan>",
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
      "deepseek"
    ],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/ai").split('\\').join('/')
module.exports = __vx.plugin("ai/deepseek", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/deepseek.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const { DeepSeekThinking } = require("../../lib/ext/src/scraper/deepseek.js");
  const { saluranCtx } = require("../../lib/ext/src/lib/vanxone-context.js");
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.js"));
  
  const pluginConfig = {
    name: "deepseek",
    alias: ["ds", "dsv4", "deepthink"],
    category: "ai",
    description: "Chat dengan DeepSeek V4 (thinking/reasoning)",
    usage: ".deepseek <pertanyaan>",
    example: ".deepseek Jelaskan black hole",
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
        `🧠 *DeepSeek V4*\n\n` +
          `AI yang bisa mikir dulu sebelum jawab — cocok buat pertanyaan yang butuh penalaran.\n\n` +
          `*PENGGUNAAN:*\n` +
          `> *${m.prefix}deepseek <pertanyaan>*\n\n` +
          `*CONTOH:*\n` +
          `> *${m.prefix}deepseek Jelaskan black hole*\n` +
          `> *${m.prefix}deepseek Buat kode sorting algorithm*\n\n` +
          `_Bot akan mikir dulu, baru jawab — jadi agak lama sedikit_`,
      );
    }
  
    await m.react("🕕");
  
    try {
      const result = await DeepSeekThinking(text);
  
      if (!result.success) {
        await m.react("☢");
        return m.reply(`❌ *DeepSeek Gagal*\n\n> Gagal mendapatkan respons`);
      }
  
      await m.react("✅");
  
      let reply = ``;
  
      if (result.reasoning) {
        const reasoningPreview =
          result.reasoning.length > 800
            ? result.reasoning.slice(0, 800) + "..."
            : result.reasoning;
        reply += `💭 *Proses Berpikir:*\n${reasoningPreview.replace(/\n/g, "\n> ")}\n\n`;
      }
  
      if (result.answer) {
        reply += `${result.answer}`;
      }
  
      if (reply.length > 4096) {
        reply = reply.slice(0, 4096) + "\n\n... (dipotong)";
      }
  
      await m.reply(reply);
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
