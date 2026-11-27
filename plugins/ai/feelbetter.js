// ai/feelbetter — satu file: metadata + kode fitur (gabungan dari engine3/plugins/ai/feelbetter.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "feelbetter",
  "command": [
    "feelbetter",
    "feelbetterbot",
    "healing"
  ],
  "category": "ai",
  "desc": "Chat dengan FeelBetterBot — AI yang siap mendengarkan tanpa menghakimi",
  "usage": ".feelbetter <curhat/pertanyaan>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 10,
  "energi": 2,
  "needs": {
    "apikeys": [],
    "scrapers": [
      "feeb"
    ],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/ai").split('\\').join('/')
module.exports = __vx.plugin("ai/feelbetter", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/feelbetter.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const { FeelBetter } = require("../../lib/ext/src/scraper/feeb.js");
  const { saluranCtx } = require("../../lib/ext/src/lib/vanxone-context.js");
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.js"));
  
  const pluginConfig = {
    name: "feelbetter",
    alias: ["fb", "feelbetterbot", "healing"],
    category: "ai",
    description: "Chat dengan FeelBetterBot — AI yang siap mendengarkan tanpa menghakimi",
    usage: ".feelbetter <curhat/pertanyaan>",
    example: ".feelbetter lagi sedih nih",
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
        `💚 *FeelBetterBot*\n\n` +
          `AI yang siap mendengarkan curhatan kamu — tanpa menghakimi, dengan hangat dan empatik.\n\n` +
          `*PENGGUNAAN:*\n` +
          `> *${m.prefix}feelbetter <curhatan>*\n\n` +
          `*CONTOH:*\n` +
          `> *${m.prefix}feelbetter lagi sedih nih*\n` +
          `> *${m.prefix}feelbetter aku capek banget belakangan*\n\n` +
          `_Bot ini bukan pengganti profesional, tapi bisa jadi tempat curhat yang aman_`
      );
    }
  
    await m.react("🕕");
  
    try {
      const result = await FeelBetter(text);
  
      if (!result.status) {
        await m.react("☢");
        return m.reply(
          `❌ *FeelBetter Gagal*\n\n> ${result.error || "Gagal mendapatkan respons"}`
        );
      }
  
      await m.react("✅");
  
      const reply = `${result.answer}`;
      await m.reply(reply.length > 4096 ? reply.slice(0, 4096) + "..." : reply, {
        contextInfo: saluranCtx(),
      });
    } catch (e) { globalThis.__vanxoneCatch?.(e);
      console.error(e);
      await m.react("☢");
      m.reply(te(m.prefix, m.command, m.pushName));
    }
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
