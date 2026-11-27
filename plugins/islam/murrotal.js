// islamic/murrotal — satu file: metadata + kode fitur (gabungan dari engine3/plugins/islamic/murrotal.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "murrotal",
  "command": [
    "murrotal",
    "murottal",
    "audioquran",
    "quraudio"
  ],
  "category": "islam",
  "desc": "Dengarkan audio murottal Al-Quran berdasarkan surah",
  "usage": ".murrotal <nama surah>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 10,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/islamic").split('\\').join('/')
module.exports = __vx.plugin("islamic/murrotal", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/murrotal.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const { load } = require("cheerio");
  const config = __vxDef(require("../../lib/ext/config.e3.js"));
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.js"));
  
  const pluginConfig = {
    name: "murrotal",
    alias: ["murottal", "audioquran", "quraudio"],
    category: "islamic",
    description: "Dengarkan audio murottal Al-Quran berdasarkan surah",
    usage: ".murrotal <nama surah>",
    example: ".murrotal al fatihah",
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 10,
    energi: 1,
    isEnabled: true,
  };
  
  async function handler(m, { sock }) {
    const query = m.args?.join(" ")?.trim();
  
    if (!query) {
      return m.reply(
        `🎧 *MURROTTAL*\n\n` +
          `> Masukkan nama surah\n\n` +
          `\`Contoh: ${m.prefix}murrotal al fatihah\`\n` +
          `\`Contoh: ${m.prefix}murrotal ar rahman\``,
      );
    }
  
    m.react("🔍");
  
    try {
  
      const res = await fetch("https://islamipedia.id/murottal/");
      const html = await res.text();
      const $ = load(html);
  
      const data = $(".surah-item")
        .map((i, el) => ({
          no: parseInt($(el).find("h5").text().split(".")[0]),
          surah: ($(el).attr("data-title") || "").toLowerCase(),
          arti: $(el).find("p").text().trim(),
          audio: $(el).attr("data-audio") || "",
        }))
        .get();
  
      const q = query.toLowerCase();
      const find = data.find((v) =>
        v.surah.replace(/[^a-z0-9]/g, "").includes(q.replace(/[^a-z0-9]/g, "")),
      );
  
      if (!find || !find.audio) {
        m.react("❌");
        return m.reply(`❌ Surah *${query}* tidak ditemukan`);
      }
  
      m.react("✅");
  
      await sock.sendMedia(m.chat, find.audio, null, m, {
        type: "audio",
      });
    } catch (e) {
      m.react("☢");
      m.reply(te(m.prefix, m.command, m.pushName));
    }
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
