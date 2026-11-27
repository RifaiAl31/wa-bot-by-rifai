// download/aio — satu file: metadata + kode fitur (gabungan dari engine3/plugins/download/aio.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "aio",
  "command": [
    "allinone"
  ],
  "category": "downloader",
  "desc": "All in one downloader (IG, TikTok, FB, Twitter, YouTube, Pinterest, CapCut, dll)",
  "usage": ".aio <url>",
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
module.exports = __vx.plugin("download/aio", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/aio.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const { aiodl } = require("../../lib/ext/src/scraper/aio.js");
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.js"));
  const { saluranCtx } = require("../../lib/ext/src/lib/vanxone-context.js");
  
  const pluginConfig = {
    name: "aio",
    alias: ["allinone", "download", "dl"],
    category: "downloader",
    description:
      "All in one downloader (IG, TikTok, FB, Twitter, YouTube, Pinterest, CapCut, dll)",
    usage: ".aio <url>",
    example: ".aio https://instagram.com/p/xxx",
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 10,
    energi: 1,
    isEnabled: true,
  };
  
  async function handler(m, { sock }) {
    const url = m.text?.trim();
  
    if (!url) {
      return m.reply(
        `📥 *ᴀʟʟ ɪɴ ᴏɴᴇ ᴅᴏᴡɴʟᴏᴀᴅᴇʀ*\n\n` +
          `> Download dari berbagai platform!\n\n` +
          `╭┈┈⬡「 🌐 *ᴘʟᴀᴛꜰᴏʀᴍ* 」\n` +
          `┃ • Instagram\n` +
          `┃ • TikTok\n` +
          `┃ • Facebook\n` +
          `┃ • Twitter/X\n` +
          `┃ • YouTube\n` +
          `┃ • Pinterest\n` +
          `┃ • CapCut\n` +
          `┃ • Threads / Reddit\n` +
          `╰┈┈┈┈┈┈┈┈⬡\n\n` +
          `> *Contoh:* ${m.prefix}aio https://instagram.com/p/xxx`,
      );
    }
  
    if (!url.startsWith("http")) {
      return m.reply(`❌ URL tidak valid! Harus dimulai dengan http/https`);
    }
  
    await m.react("🕕");
  
    try {
      const result = await aiodl(url);
  
      if (!result?.media?.length) {
        await m.react("❌");
        return m.reply(`❌ Gagal mengambil media. Pastikan URL valid.`);
      }
  
      const ctxInfo = saluranCtx();
  
      for (const item of result.media) {
        if (item.type === "video") {
          await sock.sendMedia(m.chat, item.url, result.title || null, m, {
            type: "video",
            contextInfo: ctxInfo,
          });
        } else if (item.type === "audio") {
          await sock.sendMessage(
            m.chat,
            {
              audio: { url: item.url },
              mimetype: "audio/mpeg",
              contextInfo: ctxInfo,
            },
            { quoted: m },
          );
        } else {
          await sock.sendMedia(m.chat, item.url, result.title || null, m, {
            type: "image",
            contextInfo: ctxInfo,
          });
        }
        break;
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
