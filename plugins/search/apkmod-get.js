// search/apkmod-get — satu file: metadata + kode fitur (gabungan dari engine3/plugins/search/apkmod-get.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "apkmod-get",
  "command": [
    "apkmod-get",
    "apkmodget",
    "getapkmod"
  ],
  "category": "search",
  "desc": "Download APK MOD dari hasil pencarian",
  "usage": ".apkmod-get <no> <query>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 15,
  "energi": 1,
  "needs": {
    "apikeys": [
      "neoxr"
    ],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/search").split('\\').join('/')
module.exports = __vx.plugin("search/apkmod-get", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/apkmod-get.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const axios = __vxDef(require("axios"));
  const config = __vxDef(require("../../lib/ext/config.e3.js"));
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.js"));
  const pluginConfig = {
    name: "apkmod-get",
    alias: ["apkmodget", "getapkmod"],
    category: "search",
    description: "Download APK MOD dari hasil pencarian",
    usage: ".apkmod-get <no> <query>",
    example: ".apkmod-get 1 vpn",
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 15,
    energi: 1,
    isEnabled: true,
  };
  
  const NEOXR_APIKEY = config.APIkey?.neoxr || '';
  
  async function handler(m, { sock }) {
    const args = m.args || [];
    const no = parseInt(args[0]);
    const query = args.slice(1).join(" ");
  
    if (!no || !query) {
      return m.reply(`❌ Format: \`${m.prefix}apkmod-get <no> <query>\``);
    }
  
    m.react("🕕");
  
    try {
      const { data } = await axios.get(
        `https://api.neoxr.eu/api/apkmod?q=${encodeURIComponent(query)}&no=${no}&apikey=${NEOXR_APIKEY}`,
        {
          timeout: 60000,
        },
      );
  
      if (!data?.status || !data?.data) {
        throw new Error("Gagal mengambil detail APK");
      }
  
      const app = data.data;
      const file = data.file;
  
      const saluranId = config.saluran?.id || "";
      const saluranName = config.saluran?.name || config.bot?.name || "WhatsApp Bot";
  
      if (file?.url) {
        await sock.sendMessage(
          m.chat,
          {
            document: { url: file.url?.trim() },
            fileName: file.filename || `${app.name}.apk`,
            mimetype: "application/vnd.android.package-archive",
            contextInfo: {
              forwardingScore: 99,
              isForwarded: true,
            },
          },
          { quoted: m },
        );
  
        m.react("✅");
      } else {
        let caption = `> ⚠️ Download URL tidak tersedia`;
        await sock.sendMessage(
          m.chat,
          {
            text: caption,
            contextInfo: {
              forwardingScore: 9999,
              isForwarded: true,
              forwardedNewsletterMessageInfo: {
                newsletterJid: saluranId,
                newsletterName: saluranName,
                serverMessageId: 127,
              },
            },
          },
          { quoted: m },
        );
  
        m.react("⚠️");
      }
    } catch (err) {
      m.react("☢");
      return m.reply(te(m.prefix, m.command, m.pushName));
    }
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
