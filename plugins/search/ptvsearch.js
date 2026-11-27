// search/ptvsearch — satu file: metadata + kode fitur (gabungan dari engine3/plugins/search/ptvsearch.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "ptvsearch",
  "command": [
    "ptvsearch",
    "ptvs"
  ],
  "category": "search",
  "desc": "Cari video TikTok",
  "usage": ".ptvsearch <query>",
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
module.exports = __vx.plugin("search/ptvsearch", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/ptvsearch.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.js"));
  const { tiktokSearchVideo } = require("../../lib/ext/src/scraper/tiktoksearch.js");
  
  const pluginConfig = {
    name: "ptvsearch",
    alias: ["ptvs"],
    category: "search",
    description: "Cari video TikTok",
    usage: ".ptvsearch <query>",
    example: ".ptvsearch jj epep",
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 15,
    energi: 1,
    isEnabled: true,
  };
  
  async function handler(m, { sock }) {
    const query = m.args.join(" ")?.trim();
  
    if (!query) {
      return m.reply(
        `╭┈┈⬡「 🎵 *ᴛɪᴋᴛᴏᴋ sᴇᴀʀᴄʜ* 」
  ┃
  ┃ ㊗ ᴜsᴀɢᴇ: \`${m.prefix}ptvsearch <query>\`
  ┃
  ╰┈┈⬡
  
  > \`Contoh: ${m.prefix}ptvsearch anime\``,
      );
    }
  
    m.react("🔍");
  
    try {
      const videos = await tiktokSearchVideo(query);
  
      if (!videos || videos.length === 0) {
        m.react("❌");
        return m.reply(`❌ Tidak ditemukan video untuk: ${query}`);
      }
  
      const randomVideo = videos[Math.floor(Math.random() * videos.length)];
  
      await sock.sendMessage(m.chat, {
        video: { url: randomVideo.link },
        mimetype: "video/mp4",
        ptv: true,
      });
  
      m.react("✅");
    } catch (error) {
      m.react("☢");
      m.reply(te(m.prefix, m.command, m.pushName));
    }
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  Object.defineProperty(__vxExports, "tiktokSearchVideo", { enumerable: true, get: () => tiktokSearchVideo });
  return __vxExports
})
