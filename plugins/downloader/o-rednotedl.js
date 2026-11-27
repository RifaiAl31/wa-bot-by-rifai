// download/rednotedl — satu file: metadata + kode fitur (gabungan dari engine3/plugins/download/rednotedl.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "rednotedl",
  "command": [
    "rednotedl",
    "rednote",
    "xhsdl",
    "xiaohongshu"
  ],
  "category": "downloader",
  "desc": "Download video/foto dari RedNote (XiaoHongShu)",
  "usage": ".rednotedl <url>",
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
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/download").split('\\').join('/')
module.exports = __vx.plugin("download/rednotedl", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/rednotedl.js'
  const __vxExports = {};
  const { RedNoteDL } = require("../../lib/ext/src/scraper/rednote.js");
  
  const pluginConfig = {
    name: "rednotedl",
    alias: ["rednote", "xhsdl", "xiaohongshu"],
    category: "download",
    description: "Download video/foto dari RedNote (XiaoHongShu)",
    usage: ".rednotedl <url>",
    example: ".rednotedl https://www.xiaohongshu.com/xxx",
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 10,
    energi: 1,
    isEnabled: true,
  };
  
  async function handler(m, { sock }) {
    const text = m.text?.trim();
    if (!text) {
      m.react("❌");
      return m.reply(
        `📕 *RedNote Downloader*\n\n` +
          `Download video atau foto dari XiaoHongShu (RedNote).\n\n` +
          `*PENGGUNAAN:*\n` +
          `> *${m.prefix}rednotedl <link>*\n\n` +
          `*CONTOH:*\n` +
          `> *${m.prefix}rednotedl https://www.xiaohongshu.com/xxx*`,
      );
    }
  
    m.react("🕕");
  
    try {
      const result = await RedNoteDL(text);
  
      if (!result.status) {
        m.react("☢");
        return m.reply(`❌ *RedNote Gagal*\n\n> ${result.error}`);
      }
  
      if (result.type === "video" && result.results?.[0]) {
        await sock.sendMedia(m.chat, result.results[0], result.title, m, {
          type: "video",
        });
      } else if (result.results?.length > 0) {
        for (let i = 0; i < Math.min(result.results.length, 5); i++) {
          await sock.sendMedia(m.chat, result.results[i], "", m, {
            type: "image",
          });
        }
        if (result.results.length > 5) {
          await m.reply(
            `_Masih ada ${result.results.length - 5} foto lagi, maksimal 5_`,
          );
        }
      }
  
      m.react("✅");
    } catch (e) {
      console.error(e);
      m.react("☢");
      m.reply("❌ Gagal mengambil data RedNote, coba lagi nanti");
    }
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
