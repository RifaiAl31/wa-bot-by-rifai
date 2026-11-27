// search/melolo — satu file: metadata + kode fitur (gabungan dari engine3/plugins/search/melolo.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "melolo",
  "command": [
    "melolo",
    "melolodrama",
    "dramamelolo"
  ],
  "category": "search",
  "desc": "Cari daftar drama pendek berdasarkan kategori dari Melolo",
  "usage": ".melolo <category>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 8,
  "energi": 1,
  "needs": {
    "apikeys": [
      "covenant"
    ],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/search").split('\\').join('/')
module.exports = __vx.plugin("search/melolo", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/melolo.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const config = __vxDef(require("../../lib/ext/config.e3.js"));
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.js"));
  const vanxoneApi = __vxDef(require("../../lib/ext/src/lib/vanxone-apimanager.js"));
  
  const pluginConfig = {
    name: "melolo",
    alias: ["melolodrama", "dramamelolo"],
    category: "search",
    description: "Cari daftar drama pendek berdasarkan kategori dari Melolo",
    usage: ".melolo <category>",
    example: ".melolo fantasy",
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 8,
    energi: 1,
    isEnabled: true,
  };
  
  function trimText(text, max = 90) {
    const value = String(text || "")
      .replace(/\s+/g, " ")
      .trim();
    if (!value) return "-";
    if (value.length <= max) return value;
    return value.slice(0, max) + "...";
  }
  
  function normalizeResults(data) {
    const groups = [];
  
    for (const [section, items] of Object.entries(data || {})) {
      if (!Array.isArray(items)) continue;
      for (const item of items) {
        groups.push({
          section,
          title: item?.title || "-",
          url: item?.url || "-",
          image: item?.image || "",
          rating: item?.rating || "-",
          episodes: item?.episodes || "-",
        });
      }
    }
  
    return groups;
  }
  
  async function fetchMelolo(category) {
    const data = await vanxoneApi.covenant.meloloCategory(category, {
      timeout: 30000,
    });
  
    if (!data?.status || !data?.data) {
      throw new Error(data?.message || "Hasil Melolo tidak ditemukan");
    }
  
    return data;
  }
  
  async function handler(m, { sock }) {
    const category = m.text?.trim();
  
    if (!category) {
      return m.reply(
        `🎭 *MELOLO DRAMA*\n\n> Contoh:\n\`${m.prefix}melolo fantasy\``,
      );
    }
  
    if (!config.APIkey?.covenant) {
      return m.reply("❌ API key covenant tidak dikonfigurasi!");
    }
  
    m.react("🔍");
  
    try {
      const result = await fetchMelolo(category);
      const items = normalizeResults(result.data).slice(0, 10);
  
      if (items.length === 0) {
        m.react("❌");
        return m.reply(
          `❌ Tidak ditemukan hasil Melolo untuk kategori: ${category}`,
        );
      }
  
      let caption = "🎭 *MELOLO DRAMA*\n\n";
      caption += `🌿 *Category:* ${category}\n`;
      caption += `📦 *Total:* ${items.length}\n`;
      caption += `💳 *Cost:* ${result?.usage?.cost ?? "-"}\n`;
      caption += `🔋 *Sisa Credit:* ${result?.usage?.remaining ?? "-"}\n\n`;
  
      items.forEach((item, index) => {
        caption += `*${index + 1}.* ${trimText(item.title, 70)}\n`;
        caption += `   ├ 📂 ${trimText(item.section, 32)}\n`;
        caption += `   ├ ⭐ ${item.rating || "-"}\n`;
        caption += `   ├ 📝 ${trimText(item.episodes, 110)}\n`;
        caption += `   └ ${item.url}\n\n`;
      });
  
      const cover = items.find((item) => item.image)?.image;
      if (cover) {
        await sock.sendMedia(m.chat, cover, caption.trim(), m, {
          type: "image",
        });
      } else {
        await m.reply(caption.trim());
      }
  
      m.react("✅");
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
