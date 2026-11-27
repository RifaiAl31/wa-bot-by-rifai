// ai/luffy_ai — satu file: metadata + kode fitur (gabungan dari engine7/plugins/ai/luffy_ai.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "luffyai",
  "command": [
    "luffyai",
    "luffy",
    "monkeydluffy",
    "mugiwara"
  ],
  "category": "ai",
  "desc": "Chat dengan Monkey D. Luffy — Calon Raja Bajak Laut dari Topi Jerami! 🏴‍☠️",
  "usage": ".luffyai <pertanyaan>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 10,
  "energi": 2,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/ai").split('\\').join('/')
module.exports = __vx.plugin("ai/luffy_ai", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/luffy_ai.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const { UnlimitedAI } = require("../../lib/ext/src/scraper/unlimitedai.js");
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.e7.js"));
  
  const pluginConfig = {
    name: "luffyai",
    alias: ["luffy", "monkeydluffy", "mugiwara"],
    category: "ai",
    description: "Chat dengan Monkey D. Luffy — Calon Raja Bajak Laut dari Topi Jerami! 🏴‍☠️",
    usage: ".luffyai <pertanyaan>",
    example: ".luffyai Halo Luffy!",
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 10,
    energi: 2,
    isEnabled: true,
  };
  
  async function handler(m, { sock }) {
    const text = m.args.join(" ");
    if (!text) {
      return m.reply(
        `🏴‍☠️ *ᴍᴏɴᴋᴇʏ ᴅ. ʟᴜꜰꜰʏ* 🏴‍☠️\n\n` +
        `╭━━━━━━━━━━━━━━━━━━━━━⬣\n` +
        `┃ 👒 *Monkey D. Luffy*\n` +
        `┃\n` +
        `┃ > Kapten Bajak Laut Topi Jerami\n` +
        `┃ > Manusia Karet pemakan buah Gomu Gomu\n` +
        `┃ > Suka bilang "Shishishi!" kalau tertawa\n` +
        `┃ > Suka banget makan daging! 🍖\n` +
        `┃ > Impian: jadi Raja Bajak Laut 👑\n` +
        `┃\n` +
        `┃ ✦ *Cara Pakai*\n` +
        `┃\n` +
        `┃   ${m.prefix}luffyai <pertanyaan>\n` +
        `┃\n` +
        `┃ ✦ *Contoh*\n` +
        `┃\n` +
        `┃   ${m.prefix}luffyai Halo Luffy!\n` +
        `┃   ${m.prefix}luffyai Mau makan daging?\n` +
        `┃\n` +
        `┃ 💗 *WhatsApp Bot:* Mau ngobrol sama Luffy darling~?\n` +
        `╰━━━━━━━━━━━━━━━━━━━━━⬣`
      );
    }
  
    await m.react("🍖");
  
    try {
      const result = await UnlimitedAI(text, "luffy-ai");
  
      if (!result.status) {
        await m.react("💔");
        return m.reply(
          `💔 *ʟᴜꜰꜰʏ ᴀɪ ᴇʀʀᴏʀ*\n\n` +
          `> ${result.error || "Gagal mendapatkan respons darling~"}\n\n` +
          `> Coba lagi ya 🥺`
        );
      }
  
      await m.react("✅");
      const reply = result.answer;
      await m.reply(reply.length > 4096 ? reply.slice(0, 4096) + "..." : reply);
    } catch (e) {
      console.error(e);
      await m.react("💔");
      m.reply(te(m.prefix, m.command, m.pushName));
    }
  }
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
