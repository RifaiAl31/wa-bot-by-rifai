// search/npm — satu file: metadata + kode fitur (gabungan dari engine3/plugins/search/npm.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "npm",
  "command": [
    "npm",
    "npmsearch",
    "npmjs",
    "npmfind"
  ],
  "category": "search",
  "desc": "Search package di NPM registry",
  "usage": ".npm <query>",
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
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/search").split('\\').join('/')
module.exports = __vx.plugin("search/npm", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/npm.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.js"));
  const pluginConfig = {
    name: "npm",
    alias: ["npmsearch", "npmjs", "npmfind"],
    category: "search",
    description: "Search package di NPM registry",
    usage: ".npm <query>",
    example: ".npm axios",
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 1,
    isEnabled: true,
  };
  
  async function handler(m, { sock }) {
    const query = m.args?.join(" ");
  
    if (!query) {
      return m.reply(
        `⚠️ *ᴄᴀʀᴀ ᴘᴀᴋᴀɪ*\n\n` +
          `> \`${m.prefix}npm <query>\`\n\n` +
          `> Contoh:\n` +
          `> \`${m.prefix}npm axios\``,
      );
    }
  
    await m.react("🕕");
  
    try {
      const res = await fetch(
        `https://registry.npmjs.com/-/v1/search?text=${encodeURIComponent(query)}&size=10`,
      );
      const data = await res.json();
  
      if (!data.objects || data.objects.length === 0) {
        await m.react("❌");
        return m.reply(
          `❌ *ᴛɪᴅᴀᴋ ᴅɪᴛᴇᴍᴜᴋᴀɴ*\n\n> Package "${query}" tidak ditemukan`,
        );
      }
  
      let text = `📦 *ɴᴘᴍ sᴇᴀʀᴄʜ*\n\n`;
      text += `> Query: \`${query}\`\n`;
      text += `> Found: ${data.total} packages\n\n`;
  
      data.objects.slice(0, 8).forEach((item, i) => {
        const pkg = item.package;
        const score = Math.round((item.score?.final || 0) * 100);
  
        text += `${i + 1}. *${pkg.name}*\n`;
        text += `> 📌 v${pkg.version}\n`;
        if (pkg.description) {
          text += `> 📝 ${pkg.description.slice(0, 50)}${pkg.description.length > 50 ? "..." : ""}\n`;
        }
        text += `> 🔗 ${pkg.links?.npm || "-"}\n`;
        if (pkg.author?.name) {
          text += `> 👤 ${pkg.author.name}\n`;
        }
        text += `> ⭐ Score: ${score}%`;
      });
  
      await m.react("✅");
      await m.reply(text);
    } catch (e) {
      await m.react("☢");
      m.reply(te(m.prefix, m.command, m.pushName));
    }
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
