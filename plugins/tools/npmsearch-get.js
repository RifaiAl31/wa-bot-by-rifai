// tools/npmsearch-get — satu file: metadata + kode fitur (gabungan dari engine8/plugins/tools/npmsearch-get.js)
const __vx = require("../../lib/adapter/e8.js")
const __meta = {
  "name": "npmsearch-get",
  "command": [
    "npmsearch-get",
    "npmget",
    "getnpm"
  ],
  "category": "tools",
  "desc": "Lihat detail package NPM + link download",
  "usage": ".npmsearch-get <nama package>",
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
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/tools").split('\\').join('/')
module.exports = __vx.plugin("tools/npmsearch-get", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/npmsearch-get.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.e8.js"));
  const { npmPackageInfo } = require("../../lib/ext/src/scraper/npmsearch.js");
  
  const config = {
    name: "npmsearch-get",
    alias: ["npmget", "getnpm"],
    category: "tools",
    description: "Lihat detail package NPM + link download",
    usage: ".npmsearch-get <nama package>",
    example: ".npmsearch-get WhatsApp Bot",
    cooldown: 5,
    energi: 1,
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    isEnabled: true,
  };
  
  function fmtDate(iso) {
    if (!iso) return "-";
    const d = new Date(iso);
    return d.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }
  
  async function handler(m, { sock }) {
    const name = (m.text || m.fullArgs || "").trim();
  
    if (!name) {
      return m.reply(`❌ Format: \`${m.prefix}npmsearch-get <nama package>\``);
    }
  
    m.react("🕕");
  
    try {
      const pkg = await npmPackageInfo(name);
      if (!pkg.status) throw new Error(pkg.mess);
  
      const text =
        `╭─ 📦 *${pkg.package}*\n` +
        `│· Versi     : \`${pkg.version}\`\n` +
        `│· Author    : ${pkg.author}\n` +
        `│· Lisensi   : ${pkg.license}\n` +
        `│· Publish   : ${fmtDate(pkg.publishedAt)}\n` +
        `│· Deskripsi : ${pkg.description || "-"}\n` +
        `╰───────────────────────────\n\n` +
        `_📦 Powered by NPM Registry_`;
  
      const buttons = [
        {
          name: "quick_reply",
          buttonParamsJson: JSON.stringify({
            display_text: "📥 Download .tgz",
            id: `${m.prefix}npmsearch-dl ${pkg.package}`,
          }),
        },
      ];
  
      if (pkg.links.repository) {
        buttons.push({
          name: "cta_url",
          buttonParamsJson: JSON.stringify({
            display_text: "📁 Lihat Repository",
            url: pkg.links.repository,
          }),
        });
      }
  
      if (pkg.links.homepage && pkg.links.homepage !== pkg.links.repository) {
        buttons.push({
          name: "cta_url",
          buttonParamsJson: JSON.stringify({
            display_text: "🌐 Homepage",
            url: pkg.links.homepage,
          }),
        });
      }
  
      await sock.sendMessage(
        m.chat,
        {
          text,
          footer: "NPM Registry",
          interactiveButtons: buttons,
        },
        { quoted: m },
      );
  
      m.react("✅");
    } catch (e) {
      console.error("[npmsearch-get]", e.message);
      m.react("☢");
      m.reply(te(m.prefix, m.command, m.pushName));
    }
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => config });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
