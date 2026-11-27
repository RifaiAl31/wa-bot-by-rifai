// ai/claudehaiku — satu file: metadata + kode fitur (gabungan dari engine3/plugins/ai/claudehaiku.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "claudehaiku",
  "command": [
    "claudehaiku",
    "claude",
    "haiku",
    "chiku"
  ],
  "category": "ai",
  "desc": "Chat dengan Claude Haiku 4.5 via OverChat",
  "usage": ".claudehaiku <pertanyaan>",
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
      "claudehaiku"
    ],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/ai").split('\\').join('/')
module.exports = __vx.plugin("ai/claudehaiku", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/claudehaiku.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const { ClaudeHaiku } = require("../../lib/ext/src/scraper/claudehaiku.js");
  const { saluranCtx } = require("../../lib/ext/src/lib/vanxone-context.js");
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.js"));
  
  const pluginConfig = {
    name: "claudehaiku",
    alias: ["claude", "haiku", "chiku"],
    category: "ai",
    description: "Chat dengan Claude Haiku 4.5 via OverChat",
    usage: ".claudehaiku <pertanyaan>",
    example: ".claudehaiku Jelaskan teori relativitas",
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
        `🤍 *Claude Haiku 4.5*\n\n` +
          `Tanya apa aja ke AI Claude Haiku — cepat dan ringan, cocok buat pertanyaan sehari-hari.\n\n` +
          `*PENGGUNAAN:*\n` +
          `> *${m.prefix}claudehaiku <pertanyaan>*\n\n` +
          `*CONTOH:*\n` +
          `> *${m.prefix}claudehaiku Jelaskan teori relativitas*\n` +
          `> *${m.prefix}claudehaiku Tips biar produktif*\n\n` +
          `_Respons cepat, tapi tetap cerdas_`
      );
    }
  
    await m.react("🕕");
  
    try {
      const result = await ClaudeHaiku(text);
  
      if (!result.status) {
        await m.react("☢");
        return m.reply(
          `❌ *Claude Haiku Gagal*\n\n> ${result.error || "Gagal mendapatkan respons"}`
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
