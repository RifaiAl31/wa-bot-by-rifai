// info/jadwalbola — satu file: metadata + kode fitur (gabungan dari engine3/plugins/info/jadwalbola.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "jadwalbola",
  "command": [
    "jadwalbola",
    "bola",
    "football",
    "soccer",
    "jadwalsepakbola"
  ],
  "category": "info",
  "desc": "Lihat jadwal pertandingan sepak bola",
  "usage": ".jadwalbola [liga]",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 10,
  "energi": 0,
  "needs": {
    "apikeys": [
      "neoxr"
    ],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/info").split('\\').join('/')
module.exports = __vx.plugin("info/jadwalbola", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/jadwalbola.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const axios = __vxDef(require("axios"));
  const config = __vxDef(require("../../lib/ext/config.e3.js"));
  const { f } = require("../../lib/ext/src/lib/vanxone-http.js");
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.js"));
  const pluginConfig = {
    name: "jadwalbola",
    alias: ["bola", "football", "soccer", "jadwalsepakbola"],
    category: "info",
    description: "Lihat jadwal pertandingan sepak bola",
    usage: ".jadwalbola [liga]",
    example: ".jadwalbola inggris",
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 10,
    energi: 0,
    isEnabled: true,
  };
  
  const NEOXR_APIKEY = config.APIkey?.neoxr || '';
  
  const LEAGUE_EMOJI = {
    "liga inggris": "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    "liga italia": "🇮🇹",
    "liga spanyol": "🇪🇸",
    "la liga spanyol": "🇪🇸",
    "liga jerman": "🇩🇪",
    "liga prancis": "🇫🇷",
    "liga belanda": "🇳🇱",
    "liga champions": "🏆",
    "bri super league": "🇮🇩",
  };
  
  function getLeagueEmoji(league) {
    const lower = league.toLowerCase();
    for (const [key, emoji] of Object.entries(LEAGUE_EMOJI)) {
      if (lower.includes(key) || key.includes(lower)) {
        return emoji;
      }
    }
    return "⚽";
  }
  
  async function handler(m, { sock }) {
    const filter = m.args.join(" ").toLowerCase().trim();
  
    m.react("🕕");
  
    try {
      const data = await f(
        `https://api.neoxr.eu/api/bola?apikey=${NEOXR_APIKEY}`,
      );
  
      if (!data?.status || !data?.data || data.data.length === 0) {
        throw new Error("Tidak ada jadwal tersedia");
      }
  
      let matches = data.data;
  
      if (filter) {
        matches = matches.filter(
          (m) =>
            m.league?.toLowerCase().includes(filter) ||
            m.home_team?.toLowerCase().includes(filter) ||
            m.away_team?.toLowerCase().includes(filter) ||
            m.date?.toLowerCase().includes(filter),
        );
      }
  
      if (matches.length === 0) {
        m.react("❌");
        return m.reply(`❌ Tidak ditemukan jadwal untuk: \`${filter}\``);
      }
  
      const grouped = {};
      for (const match of matches.slice(0, 50)) {
        const date = match.date || "TBA";
        if (!grouped[date]) grouped[date] = [];
        grouped[date].push(match);
      }
  
      const saluranId = config.saluran?.id || "";
      const saluranName = config.saluran?.name || config.bot?.name || "WhatsApp Bot";
  
      let text = `⚽ *ᴊᴀᴅᴡᴀʟ ᴘᴇʀᴛᴀɴᴅɪɴɢᴀɴ*\n\n`;
      if (filter) text += `> Filter: \`${filter}\`\n\n`;
  
      for (const [date, games] of Object.entries(grouped)) {
        text += `📅 *${date}*\n\n`;
  
        for (const game of games) {
          const emoji = getLeagueEmoji(game.league);
          text += `${emoji} *${game.league}*\n`;
          text += `⏰ ${game.time}\n`;
          text += `🏠 ${game.home_team}\n`;
          text += `🆚 ${game.away_team}\n\n`;
        }
      }
  
      text += `Total: *${matches.length}* pertandingan`;
  
      m.react("✅");
  
      await m.reply(text);
    } catch (err) {
      m.react("☢");
      return m.reply(te(m.prefix, m.command, m.pushName));
    }
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
