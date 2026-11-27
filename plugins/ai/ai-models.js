// ai/ai-models — satu file: metadata + kode fitur (gabungan dari engine7/plugins/ai/ai-models.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "webpilot",
  "command": [
    "webpilot",
    "gpt-oss2b",
    "glm47",
    "meta-ai",
    "deepseek-pro",
    "claude-45"
  ],
  "category": "ai",
  "desc": "Model AI tambahan yang dipindahkan dari Aqua",
  "usage": ".webpilot <pertanyaan>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 10,
  "energi": 2,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/ai").split('\\').join('/')
module.exports = __vx.plugin("ai/ai-models", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/ai-models.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const axios = __vxDef(require("axios"));
  const config = __vxDef(require("../../lib/ext/config.e7.js"));
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.e7.js"));
  
  const pluginConfig = {
    name: "webpilot",
    alias: ["gpt-oss2b", "glm47", "meta-ai", "deepseek-pro", "claude-45"],
    category: "ai",
    description: "Model AI tambahan yang dipindahkan dari Aqua",
    usage: ".webpilot <pertanyaan>",
    example: ".webpilot apa berita terbaru tentang teknologi",
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 10,
    energi: 2,
    isEnabled: true,
  };
  
  const MODELS = {
    webpilot: {
      label: "WebPilot",
      url: "https://free-restapi.biz.id/api/ai/webpilot",
      param: "prompt",
    },
    "gpt-oss2b": {
      label: "GPT-OSS 2B",
      url: "https://free-restapi.biz.id/api/gpt-oss2b",
      param: "prompt",
    },
    glm47: {
      label: "GLM 4.7",
      url: "https://free-restapi.biz.id/api/glm47",
      param: "prompt",
    },
    "meta-ai": {
      label: "Meta AI",
      url: "https://free-restapi.biz.id/api/meta-ai",
      param: "prompt",
    },
    "deepseek-pro": {
      label: "DeepSeek Pro",
      url: "https://free-restapi.biz.id/api/deepseek-pro",
      param: "prompt",
    },
    "claude-45": {
      label: "Claude 4.5",
      url: "https://free-restapi.biz.id/api/claude-4-5",
      param: "prompt",
    },
  };
  
  function getText(data) {
    if (typeof data === "string") return data;
    return data?.result ?? data?.data?.result ?? data?.answer ?? data?.data?.answer ?? null;
  }
  
  async function handler(m) {
    const model = MODELS[m.command?.toLowerCase()];
    if (!model) return;
  
    const text = m.args?.join(" ").trim();
    if (!text) {
      return m.reply(
        `🤖 *${model.label}*\n\n` +
        `Gunakan: *${m.prefix}${m.command} <pertanyaan>*\n` +
        `Contoh: *${m.prefix}${m.command} jelaskan kecerdasan buatan*`
      );
    }
  
    const key = config.aquaApi?.freeRestApiKey || "";
    if (!key) return m.reply("❌ API key Aqua belum diisi di config.js (aquaApi.freeRestApiKey).");
  
    await m.react("🕕");
    try {
      const params = { [model.param]: text, apikey: key };
      const { data } = await axios.get(model.url, { params, timeout: 60000 });
      const result = getText(data);
      if (!result) throw new Error(data?.message || "API tidak mengembalikan hasil");
  
      await m.react("✅");
      return m.reply(String(result).slice(0, 12000));
    } catch (e) {
      console.error(`[AQUA-${m.command}]`, e?.message || e);
      await m.react("❌").catch(() => {});
      return m.reply(te(m.prefix, m.command, m.pushName));
    }
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
