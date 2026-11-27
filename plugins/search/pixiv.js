// search/pixiv — satu file: metadata + kode fitur (gabungan dari engine3/plugins/search/pixiv.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "pixiv",
  "command": [
    "pixiv",
    "pixivsearch",
    "caripixiv"
  ],
  "category": "search",
  "desc": "Cari artwork di Pixiv",
  "usage": ".pixiv <query>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 2,
  "needs": {
    "apikeys": [
      "neoxr"
    ],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/search").split('\\').join('/')
module.exports = __vx.plugin("search/pixiv", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/pixiv.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const axios = __vxDef(require("axios"));
  const config = __vxDef(require("../../lib/ext/config.e3.js"));
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.js"));
  const pluginConfig = {
    name: "pixiv",
    alias: ["pixivsearch", "caripixiv"],
    category: "search",
    description: "Cari artwork di Pixiv",
    usage: ".pixiv <query>",
    example: ".pixiv rem",
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 2,
    isEnabled: true,
  };
  
  async function handler(m, { sock }) {
    try {
      const query = m.args?.join(" ")?.trim();
  
      if (!query) {
        return m.reply(
          `❌ *Masukkan kata kunci pencarian!*\n\n> Contoh: .pixiv rem`,
        );
      }
  
      await m.react("🔍");
  
      const apikey = config.APIkey?.neoxr || '';
      const url = `https://api.neoxr.eu/api/pixiv-search?q=${encodeURIComponent(query)}&apikey=${apikey}`;
  
      const response = await axios.get(url, { timeout: 30000 });
      const data = response.data;
  
      if (!data.status || !data.data || data.data.length === 0) {
        await m.react("❌");
        return m.reply(`❌ *Tidak ditemukan hasil untuk:* ${query}`);
      }
  
      const results = data.data.slice(0, 10);
  
      const saluranId = config.saluran?.id || "";
      const saluranName = config.saluran?.name || config.bot?.name || "WhatsApp Bot";
  
      let caption = `🎨 *ᴘɪxɪᴠ sᴇᴀʀᴄʜ*\n`;
      caption += `📝 *ᴋᴜᴇʀʏ:* ${query}\n`;
      caption += `📊 *ʜᴀsɪʟ:* ${results.length} artwork\n\n`;
  
      results.forEach((art, i) => {
        const aiLabel = art.aiType === 2 ? " 🤖" : "";
        const isNsfw = art.xRestrict > 0 ? " 🔞" : "";
        caption += `*${i + 1}.* ${art.title}${aiLabel}${isNsfw}\n`;
        caption += `   👤 ${art.userName}\n`;
        caption += `   📐 ${art.width}x${art.height} • 📄 ${art.pageCount} page\n`;
        caption += `   🔗 ${art.url}\n\n`;
      });
  
      caption += `> 🎨 Powered by Pixiv`;
  
      const buttons = results.slice(0, 5).map((art, i) => ({
        title: `${art.title.slice(0, 20)}${art.title.length > 20 ? "..." : ""}`,
        description: `by ${art.userName}`,
        id: `.pixivget ${art.url}`,
      }));
  
      await m.react("🎨");
  
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
    } catch (error) {
      await m.react("☢");
      if (error.response?.status === 403) {
        return m.reply(`❌ *API Key tidak valid atau limit tercapai*`);
      }
      m.reply(te(m.prefix, m.command, m.pushName));
    }
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
