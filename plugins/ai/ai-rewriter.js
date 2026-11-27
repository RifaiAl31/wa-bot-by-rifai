// ai/ai-rewriter — satu file: metadata + kode fitur (gabungan dari engine8/plugins/ai/ai-rewriter.js)
const __vx = require("../../lib/adapter/e8.js")
const __meta = {
  "name": "ai-rewriter",
  "command": [
    "ai-rewriter",
    "airewriter",
    "rewriteai"
  ],
  "category": "ai",
  "desc": "Tulis ulang teks dengan tone tertentu",
  "usage": ".ai-rewriter <text> | <tone>",
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
module.exports = __vx.plugin("ai/ai-rewriter", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/ai-rewriter.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const config = __vxDef(require("../../lib/ext/config.e8.js"));
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.e8.js"));
  const vanxoneApi = __vxDef(require("../../lib/ext/src/lib/vanxone-apimanager.e8.js"));
  
  const pluginConfig = {
    name: "ai-rewriter",
    alias: ["airewriter", "rewriteai"],
    category: "ai",
    description: "Tulis ulang teks dengan tone tertentu",
    usage: ".ai-rewriter <text> | <tone>",
    example: ".ai-rewriter halo semuanya | professional",
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 1,
    isEnabled: true,
  };
  
  function parseRewriteInput(input) {
    const value = String(input || "").trim();
    if (!value) return { text: "", tone: "professional" };
  
    const parts = value
      .split("|")
      .map((item) => item.trim())
      .filter(Boolean);
    if (parts.length === 0) return { text: "", tone: "professional" };
    if (parts.length === 1) return { text: parts[0], tone: "professional" };
  
    return {
      text: parts[0],
      tone: parts.slice(1).join(" | ") || "professional",
    };
  }
  
  async function handler(m) {
    const parsed = parseRewriteInput(m.text);
  
    if (!parsed.text) {
      return m.reply(
        `✍️ *AI REWRITER*\n\n` +
          `> Tulis ulang teks dengan tone tertentu\n\n` +
          `\`Contoh: ${m.prefix}ai-rewriter Halo semuanya | professional\``,
      );
    }
  
    if (!config.APIkey?.covenant) {
      return m.reply("❌ API key covenant tidak dikonfigurasi!");
    }
  
    m.react("🕕");
  
    try {
      const data = await vanxoneApi.covenant.rewrite(
        {
          text: parsed.text,
          tone: parsed.tone,
        },
        {
          timeout: 30000,
        },
      );
  
      if (!data?.status || !data?.data?.result) {
        throw new Error(data?.message || "Gagal rewrite teks");
      }
  
      m.react("✅");
      await m.reply(
        `✍️ *AI REWRITER*\n\n` +
          `> Tone: ${parsed.tone}\n` +
          `> Cost: ${data?.usage?.cost ?? "-"}\n` +
          `> Sisa Credit: ${data?.usage?.remaining ?? "-"}\n\n` +
          `${data.data.result}`,
      );
    } catch (error) {
      m.react("☢");
      const message = error?.response?.data?.message || error?.message;
      if (message) {
        return m.reply(`❌ ${message}`);
      }
      m.reply(te(m.prefix, m.command, m.pushName));
    }
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
