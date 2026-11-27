// search/playtiktok — satu file: metadata + kode fitur (gabungan dari engine3/plugins/search/playtiktok.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "playtiktok",
  "command": [
    "playtiktok",
    "ttplay",
    "tiktokplay"
  ],
  "category": "search",
  "desc": "Cari dan kirim satu video TikTok terbaik",
  "usage": ".playtiktok <query>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 15,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/search").split('\\').join('/')
module.exports = __vx.plugin("search/playtiktok", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/playtiktok.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.js"));
  const { tiktokSearchVideo } = require("../../lib/ext/src/scraper/tiktoksearch.js");
  
  const pluginConfig = {
    name: "playtiktok",
    alias: ["ttplay", "tiktokplay"],
    category: "search",
    description: "Cari dan kirim satu video TikTok terbaik",
    usage: ".playtiktok <query>",
    example: ".playtiktok cewe tiktok",
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 15,
    energi: 1,
    isEnabled: true,
  };
  
  function formatNumber(n) {
    const value = Number(n) || 0;
    if (value >= 1000000) return (value / 1000000).toFixed(1) + "M";
    if (value >= 1000) return (value / 1000).toFixed(1) + "K";
    return value.toString();
  }
  
  async function handler(m, { sock }) {
    const query = m.args.join(" ")?.trim();
  
    if (!query) {
      return m.reply(
        `🎵 *PLAY TIKTOK*\n\n> Contoh:\n\`${m.prefix}playtiktok cewe tiktok\``,
      );
    }
  
    m.react("🔍");
  
    try {
      const videos = await tiktokSearchVideo(query);
      if (!videos || videos.length === 0) {
        m.react("❌");
        return m.reply(`❌ Tidak ditemukan video untuk: ${query}`);
      }
  
      const video = videos[0];
      let caption = "🎵 *PLAY TIKTOK*\n\n";
      caption += `📌 *Judul:* ${video.title || "-"}\n`;
      caption += `👤 *Author:* ${video.author?.nickname || "-"}\n`;
      caption += `👀 *Views:* ${formatNumber(video.stats?.plays)}\n`;
      caption += `❤️ *Likes:* ${formatNumber(video.stats?.likes)}\n`;
      caption += `💬 *Comments:* ${formatNumber(video.stats?.comments)}\n`;
      caption += `🔁 *Shares:* ${formatNumber(video.stats?.shares)}\n`;
      caption += `🎧 *Music:* ${video.music || "-"}\n`;
      caption += `🔗 *Link:* ${video.link}`;
  
      await sock.sendMedia(m.chat, video.link, caption, m, {
        type: "video",
        mimetype: "video/mp4",
        contextInfo: {
          forwardingScore: 99,
          isForwarded: true,
        },
      });
  
      m.react("✅");
    } catch (error) {
      console.log(error);
      m.react("☢");
      m.reply(te(m.prefix, m.command, m.pushName));
    }
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
