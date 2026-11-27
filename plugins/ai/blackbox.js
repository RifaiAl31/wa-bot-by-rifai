// ai/blackbox — satu file: metadata + kode fitur (gabungan dari engine7/plugins/ai/blackbox.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "blackbox",
  "command": [
    "blackbox",
    "bbox"
  ],
  "category": "ai",
  "desc": "Chat dengan Blackbox AI melalui WhatsApp Bot",
  "usage": ".blackbox <pertanyaan>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/ai").split('\\').join('/')
module.exports = __vx.plugin("ai/blackbox", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/blackbox.js'
  const __vxExports = {};
  
  const pluginConfig = {
    name: "blackbox",
    alias: ["blackbox", "bbox"],
    category: "ai",
    description: "Chat dengan Blackbox AI melalui WhatsApp Bot",
    usage: ".blackbox <pertanyaan>",
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 0,
    isEnabled: true,
  };
  
  async function handler(m) {
    const text = m.args.join(" ").trim();
    if (!text) return m.reply(`Contoh: ${m.prefix}blackbox Halo, jelaskan JavaScript`);
    m.react?.("⏳");
    try {
      // API riooApi bawaan tidak pernah dikonfigurasi (config.riooApi kosong) -> pakai AI gratis tanpa key
      const { UnlimitedAI } = require("../../lib/ext/src/scraper/unlimitedai.js");
      const res = await UnlimitedAI(text, "assistant");
      const result = res && (res.answer || res.result);
      if (!res || res.status === false || !result) throw new Error((res && res.error) || "AI tidak mengembalikan hasil.");
      m.react?.("✅");
      return m.reply(String(result).length > 4096 ? String(result).slice(0, 4090) + "..." : String(result));
    } catch (error) {
      m.react?.("❌");
      return m.reply(`❌ Blackbox gagal: ${error.message}`);
    }
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
