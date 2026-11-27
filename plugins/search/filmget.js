// search/filmget — satu file: metadata + kode fitur (gabungan dari engine3/plugins/search/filmget.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "filmget",
  "command": [
    "filmget",
    "getfilm",
    "filmdetail",
    "filminfo"
  ],
  "category": "search",
  "desc": "Ambil detail film",
  "usage": ".filmget <url>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 10,
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
module.exports = __vx.plugin("search/filmget", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/filmget.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const axios = __vxDef(require("axios"));
  const config = __vxDef(require("../../lib/ext/config.e3.js"));
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.js"));
  const { saluranCtx } = require("../../lib/ext/src/lib/vanxone-context.js");
  const NEOXR_APIKEY = config.APIkey?.neoxr || '';
  
  const pluginConfig = {
    name: "filmget",
    alias: ["getfilm", "filmdetail", "filminfo"],
    category: "search",
    description: "Ambil detail film",
    usage: ".filmget <url>",
    example: ".filmget https://tv.neoxr.eu/film/civil-war-2024",
    cooldown: 10,
    energi: 1,
    isEnabled: true,
  };
  
  
  async function handler(m, { sock }) {
    const args = m.args || [];
    const url = args[0]?.trim();
  
    if (!url || !url.includes("neoxr.eu")) {
      return m.reply(
        `🎬 *ꜰɪʟᴍ ᴅᴇᴛᴀɪʟ*\n\n` +
          `> Ambil detail film dari URL\n\n` +
          `*Format:*\n` +
          `> \`${m.prefix}filmget <url>\`\n\n` +
          `> Gunakan \`${m.prefix}film <judul>\` untuk cari film dulu`,
      );
    }
  
    m.react("🎬");
  
    try {
      const apiUrl = `https://api.neoxr.eu/api/film-get?url=${encodeURIComponent(url)}&apikey=${NEOXR_APIKEY}`;
      const { data } = await axios.get(apiUrl, { timeout: 30000 });
  
      if (!data?.status || !data?.data) {
        m.react("❌");
        return m.reply("❌ *ɢᴀɢᴀʟ*\n\n> Film tidak ditemukan");
      }
  
      const film = data.data;
      const streams = data.stream || [];
      const downloads = data.download || [];
  
      let thumbBuffer = null;
      if (film.thumbnail) {
        try {
          const thumbRes = await axios.get(film.thumbnail, {
            responseType: "arraybuffer",
            timeout: 10000,
          });
          thumbBuffer = Buffer.from(thumbRes.data);
        } catch {}
      }
  
      let text = `🎬 *${film.title || "Film"}*\n\n`;
      text += `╭┈┈⬡「 📋 *ɪɴꜰᴏ* 」\n`;
      text += `┃ ⭐ Rating: ${film.rating || "-"}\n`;
      text += `┃ 📺 Quality: ${film.quality || "-"}\n`;
      text += `┃ ⏱️ Duration: ${film.duration || "-"}\n`;
      text += `┃ 📅 Release: ${film.release || "-"}\n`;
      text += `┃ 🎭 Genre: ${film.tags || "-"}\n`;
      text += `┃ 🎬 Director: ${film.director || "-"}\n`;
      text += `┃ 👥 Actors: ${film.actors || "-"}\n`;
      text += `╰┈┈┈┈┈┈┈┈⬡\n\n`;
  
      text += `📝 *Synopsis:*\n`;
      text += `> ${film.synopsis || "-"}\n\n`;
  
      if (streams.length > 0) {
        text += `▶️ *Streaming:*\n`;
        streams.forEach((s, i) => {
          text += `> ${i + 1}. ${s.server}\n`;
        });
        text += `\n`;
      }
  
      if (downloads.length > 0) {
        text += `📥 *Download:*\n`;
        downloads.forEach((d, i) => {
          text += `> ${i + 1}. ${d.provider}\n`;
        });
      }
  
      const buttons = [];
  
      if (streams.length > 0) {
        buttons.push({
          displayText: `▶️ ${streams[0].server}`,
          url: streams[0].url,
        });
      }
  
      downloads.slice(0, 2).forEach((d) => {
        buttons.push({
          displayText: `📥 ${d.provider}`,
          url: d.url,
        });
      });
  
      const saluranId = config.saluran?.id || "";
      const saluranName = config.saluran?.name || config.bot?.name || "WhatsApp Bot";
  
      const msgContent = {
        text,
        footer: `🎬 Nonton Film Online`,
        contextInfo: saluranCtx(),
      };
  
      if (buttons.length > 0) {
        msgContent.buttons = buttons;
        await sock.sendButtons(m.chat, msgContent, { quoted: m });
      } else {
        await sock.sendMessage(m.chat, msgContent, { quoted: m });
      }
  
      m.react("✅");
    } catch (error) {
      m.react("☢");
      m.reply(te(m.prefix, m.command, m.pushName));
    }
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
