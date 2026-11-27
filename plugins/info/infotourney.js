// info/infotourney — satu file: metadata + kode fitur (gabungan dari engine3/plugins/info/infotourney.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "infotourney",
  "command": [
    "infotourney",
    "tourney",
    "turnamen",
    "mltourney"
  ],
  "category": "info",
  "desc": "Info turnamen Mobile Legends terbaru",
  "usage": ".infotourney",
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
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/info").split('\\').join('/')
module.exports = __vx.plugin("info/infotourney", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/infotourney.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxNs = (m) => (m && m.__esModule ? m : (m !== null && (typeof m === 'object' || typeof m === 'function') ? Object.assign(Object.create(null), m, { default: m }) : { default: m }));
  const __vxExports = {};
  const axios = __vxDef(require("axios"));
  const cheerio = __vxNs(require("cheerio"));
  const moment = __vxDef(require("moment-timezone"));
  const config = __vxDef(require("../../lib/ext/config.e3.js"));
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.js"));
  const pluginConfig = {
    name: "infotourney",
    alias: ["tourney", "turnamen", "mltourney"],
    category: "info",
    description: "Info turnamen Mobile Legends terbaru",
    usage: ".infotourney",
    example: ".infotourney",
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 10,
    energi: 1,
    isEnabled: true,
  };
  
  async function getInfoTourney() {
    const url = "https://infotourney.com/tournament/mobile-legends";
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const tournaments = [];
  
    $(".items-row .item").each((_, element) => {
      const item = $(element);
  
      const title = item.find('h2[itemprop="name"] a').text().trim();
      const link = item.find('h2[itemprop="name"] a').attr("href");
      const image = item.find("p img").attr("src");
      let datePublished = item
        .find('time[itemprop="datePublished"]')
        .attr("datetime");
  
      if (datePublished) {
        datePublished = moment(datePublished)
          .tz("Asia/Jakarta")
          .format("DD/MM/YYYY HH:mm");
      }
  
      const descriptionHtml =
        item.find('p[style="text-align: center;"]').html() || "";
      const [rawDescription, rawInfo] = descriptionHtml
        .split("<br>")
        .map((text) => text.trim());
  
      const description = rawDescription
        ? rawDescription.replace(/&nbsp;/g, " ")
        : "";
      const info = rawInfo ? rawInfo.replace(/&nbsp;/g, " ") : "";
  
      tournaments.push({
        title,
        imageUrl: new URL(image, url).href,
        datePublished,
        description,
        info,
        url: new URL(link, url).href,
      });
    });
  
    return tournaments.slice(0, 5);
  }
  
  async function handler(m, { sock }) {
    await m.react("🕕");
  
    try {
      const tournaments = await getInfoTourney();
  
      if (!tournaments || tournaments.length === 0) {
        await m.react("❌");
        return m.reply("❌ Tidak ada turnamen yang ditemukan");
      }
  
      const saluranId = config.saluran?.id || "";
      const saluranName = config.saluran?.name || config.bot?.name || "WhatsApp Bot";
  
      let text = `🏆 *ɪɴꜰᴏ ᴛᴜʀɴᴀᴍᴇɴ ᴍᴏʙɪʟᴇ ʟᴇɢᴇɴᴅs*\n\n`;
      text += `> 5 Turnamen Terbaru\n\n`;
  
      for (let i = 0; i < tournaments.length; i++) {
        const t = tournaments[i];
        text += `${i + 1}. *${t.title}*\n`;
        text += `📅 ${t.datePublished || "N/A"}\n`;
        if (t.description) text += `📝 ${t.description}\n`;
        if (t.info) text += `⚠️ ${t.info}\n`;
        text += `🔗 ${t.url}\n\n`;
      }
  
      const firstImage = tournaments[0]?.imageUrl;
  
      if (firstImage) {
        await sock.sendMedia(m.chat, firstImage, text, m, {
          type: "image",
        });
      } else {
        await m.reply(text);
      }
  
      await m.react("✅");
    } catch (error) {
      await m.react("☢");
      m.reply(te(m.prefix, m.command, m.pushName));
    }
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
