// ai/qwen3 — satu file: metadata + kode fitur (gabungan dari engine3/plugins/ai/qwen3.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "qwen3",
  "command": [
    "qwen3",
    "qwen",
    "qw3"
  ],
  "category": "ai",
  "desc": "Chat dengan Qwen3 80B via OverChat",
  "usage": ".qwen3 <pertanyaan>",
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
module.exports = __vx.plugin("ai/qwen3", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/qwen3.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const { Qwen3 } = require("../../lib/ext/src/scraper/qwen3.js");
  const { saluranCtx } = require("../../lib/ext/src/lib/vanxone-context.js");
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.js"));
  
  const pluginConfig = {
    name: "qwen3",
    alias: ["qwen", "qw3"],
    category: "ai",
    description: "Chat dengan Qwen3 80B via OverChat",
    usage: ".qwen3 <pertanyaan>",
    example: ".qwen3 Apa itu machine learning?",
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
        `🔵 *Qwen3 80B*\n\n` +
          `Tanya apa aja ke AI Qwen3 — model besar dari Alibaba yang jago bahasa apa aja.\n\n` +
          `*PENGGUNAAN:*\n` +
          `> *${m.prefix}qwen3 <pertanyaan>*\n\n` +
          `*CONTOH:*\n` +
          `> *${m.prefix}qwen3 Apa itu machine learning?*\n` +
          `> *${m.prefix}qwen3 Buat resep masakan Indonesia*\n\n` +
          `_Model 80B, jadi agak lama tapi jawabannya mantap_`
      );
    }
  
    await m.react("🕕");
  
    try {
      const result = await Qwen3(text);
  
      if (!result.status) {
        await m.react("☢");
        return m.reply(
          `❌ *Qwen3 Gagal*\n\n> ${result.error || "Gagal mendapatkan respons"}`
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
