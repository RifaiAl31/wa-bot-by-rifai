// search/film — satu file: metadata + kode fitur (gabungan dari engine3/plugins/search/film.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "film",
  "command": [
    "film",
    "movie",
    "nonton",
    "lk21"
  ],
  "category": "search",
  "desc": "Cari film dan nonton online",
  "usage": ".film <judul>",
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
module.exports = __vx.plugin("search/film", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/film.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const { getAssetBuffer } = require("../../lib/ext/src/lib/vanxone-asset-manager.js");
  const axios = __vxDef(require("axios"));
  const config = __vxDef(require("../../lib/ext/config.e3.js"));
  const fs = __vxDef(require("fs"));
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.js"));
  const NEOXR_APIKEY = config.APIkey?.neoxr || '';
  
  const pluginConfig = {
    name: "film",
    alias: ["movie", "nonton", "lk21"],
    category: "search",
    description: "Cari film dan nonton online",
    usage: ".film <judul>",
    example: ".film civil war",
    cooldown: 10,
    energi: 1,
    isEnabled: true,
  };
  
  const filmSessions = new Map();
  
  async function handler(m, { sock }) {
    const args = m.args || [];
    const query = args.join(" ").trim();
  
    if (!query) {
      return m.reply(
        `🎬 *ꜰɪʟᴍ sᴇᴀʀᴄʜ*\n\n` +
          `> Cari dan nonton film online\n\n` +
          `*Format:*\n` +
          `> \`${m.prefix}film <judul>\`\n\n` +
          `*Contoh:*\n` +
          `> \`${m.prefix}film civil war\``,
      );
    }
  
    m.react("🎬");
  
    try {
      const apiUrl = `https://api.neoxr.eu/api/film?q=${encodeURIComponent(query)}&apikey=${NEOXR_APIKEY}`;
      const { data } = await axios.get(apiUrl, { timeout: 30000 });
  
      if (!data?.status || !data?.data?.length) {
        m.react("❌");
        return m.reply(
          `❌ *ᴛɪᴅᴀᴋ ᴅɪᴛᴇᴍᴜᴋᴀɴ*\n\n> Film "${query}" tidak ditemukan`,
        );
      }
  
      const films = data.data.slice(0, 10);
  
      filmSessions.set(m.sender, {
        films,
        timestamp: Date.now(),
      });
  
      setTimeout(() => {
        filmSessions.delete(m.sender);
      }, 300000);
  
      let text = `🎬 *ʜᴀsɪʟ ᴘᴇɴᴄᴀʀɪᴀɴ*\n\n`;
      text += `> Ditemukan *${films.length}* film untuk "${query}"\n\n`;
  
      films.forEach((f, i) => {
        text += `*${i + 1}. ${f.title}*\n`;
        text += `> ⭐ ${f.rating} | 📺 ${f.quality} | 📅 ${f.release}\n\n`;
      });
  
      text += `> _Pilih film dari list di bawah_`;
  
      const listItems = films.map((f, i) => ({
        header: "",
        title: f.title,
        description: `⭐ ${f.rating} | ${f.quality} | ${f.release}`,
        id: `${m.prefix}filmget ${f.url}`,
      }));
  
      await sock.sendButton(
        m.chat,
        getAssetBuffer("WhatsApp Bot"),
        text,
        m,
        {
          buttons: [
            {
              name: "single_select",
              buttonParamsJson: JSON.stringify({
                title: "🎬 Pilih Film",
                sections: [
                  {
                    title: "Hasil Pencarian",
                    rows: listItems,
                  },
                ],
              }),
            },
          ],
          footer: "🎬 Film Search",
        },
      );
  
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
