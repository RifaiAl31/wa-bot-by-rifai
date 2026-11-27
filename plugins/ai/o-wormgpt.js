// ai/wormgpt — satu file: metadata + kode fitur (gabungan dari engine3/plugins/ai/wormgpt.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "wormgpt",
  "command": [
    "wormgpt",
    "worm"
  ],
  "category": "ai",
  "desc": "Chat dengan WormGPT (uncensored AI)",
  "usage": ".wormgpt <pertanyaan>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/ai").split('\\').join('/')
module.exports = __vx.plugin("ai/wormgpt", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/wormgpt.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.js"));
  const config = __vxDef(require("../../lib/ext/config.e3.js"));
  const axios = __vxDef(require("axios"));
  
  const pluginConfig = {
    name: "wormgpt",
    alias: ["worm"],
    category: "ai",
    description: "Chat dengan WormGPT (uncensored AI)",
    usage: ".wormgpt <pertanyaan>",
    example: ".wormgpt perkenalkan dirimu",
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 1,
    isEnabled: true,
  };
  
  async function handler(m, { sock }) {
    const text = m.args.join(" ");
  
    if (!text) {
      return m.reply(
        `🐛 *ᴡᴏʀᴍ ɢᴘᴛ*\n\n> Masukkan pertanyaan\n\n\`Contoh: ${m.prefix}wormgpt perkenalkan dirimu\``,
      );
    }
  
    m.react("🕕");
  
    try {
      const url = `https://api.cuki.biz.id/api/ai/wormgpt?apikey=${config.APIkey.cuki}&question=${encodeURIComponent(text)}`;
      const { data } = await axios.get(url, { timeout: 30000 });
  
      if (!data.status || !data.data?.response) {
        throw new Error("Gagal mendapatkan response");
      }
  
      m.react("✅");
      await m.reply(`${data.data.response}`);
    } catch (error) { globalThis.__vanxoneCatch?.(error);
      console.log(error);
      m.react("☢");
      m.reply(te(m.prefix, m.command, m.pushName));
    }
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
