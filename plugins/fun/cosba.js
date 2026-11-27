// random/cosba — satu file: metadata + kode fitur (gabungan dari engine7/plugins/random/cosba.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "cosba",
  "command": [
    "cosba",
    "cosplayba"
  ],
  "category": "fun",
  "desc": "Random gambar cosplay Blue Archive",
  "usage": ".cosba",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/random").split('\\').join('/')
module.exports = __vx.plugin("random/cosba", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/cosba.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const axios = __vxDef(require("axios"));
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.e7.js"));
  
  const pluginConfig = {
    name: "cosba",
    alias: ["cosplayba", "cosba"],
    category: "random",
    description: "Random gambar cosplay Blue Archive",
    usage: ".cosba",
    example: ".cosba",
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 1,
    isEnabled: true,
  };
  
  async function handler(m, { sock }) {
    await m.react("🕕");
    try {
      const res = await axios.get("https://api.ryuu-dev.offc.my.id/random/cosplay-ba", {
        responseType: "arraybuffer",
        timeout: 30000,
      });
      if (!res?.data?.length) throw new Error("API tidak mengembalikan gambar");
      await sock.sendMessage(m.chat, {
        image: Buffer.from(res.data),
        caption: "✅ *Random Blue Archive Cosplay*",
      }, { quoted: m });
      await m.react("✅");
    } catch (e) {
      console.error("[CosBA]", e?.message || e);
      await m.react("❌");
      return m.reply(te(m.prefix, m.command, m.pushName));
    }
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
