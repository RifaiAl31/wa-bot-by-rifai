// search/android1-get — satu file: metadata + kode fitur (gabungan dari engine3/plugins/search/android1-get.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "android1-get",
  "command": [
    "android1-get",
    "an1get",
    "an1dl"
  ],
  "category": "search",
  "desc": "Download APK dari Android1",
  "usage": ".android1-get <url>",
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
module.exports = __vx.plugin("search/android1-get", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/android1-get.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const axios = __vxDef(require("axios"));
  const config = __vxDef(require("../../lib/ext/config.e3.js"));
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.js"));
  const pluginConfig = {
    name: "android1-get",
    alias: ["an1get", "an1dl"],
    category: "search",
    description: "Download APK dari Android1",
    usage: ".android1-get <url>",
    example: ".android1-get https://an1.com/xxx",
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
    const url = m.text?.trim();
  
    if (!url || !url.includes("an1.com")) {
      return m.reply(`❌ URL tidak valid! Harus URL dari an1.com`);
    }
  
    m.react("🕕");
  
    try {
      const { data } = await axios.get(
        `https://api.neoxr.eu/api/an1-get?url=${encodeURIComponent(url)}&apikey=${NEOXR_APIKEY}`,
        {
          timeout: 60000,
        },
      );
  
      if (!data?.status || !data?.data) {
        throw new Error("Gagal mengambil detail APK");
      }
  
      const app = data.data;
      const saluranId = config.saluran?.id || "";
      const saluranName = config.saluran?.name || config.bot?.name || "WhatsApp Bot";
      if (app.url) {
        await sock.sendMessage(
          m.chat,
          {
            document: { url: app.url },
            fileName: app.name,
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
  
        await sock.sendButtons(
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
            buttons: [
              {
                displayText: "🌐 Buka di Browser",
                url: url,
              },
            ],
          },
          { quoted: m },
        );
  
        m.react("⚠️");
      }
    } catch (err) {
      console.log(err);
      m.react("☢");
      return m.reply(te(m.prefix, m.command, m.pushName));
    }
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
