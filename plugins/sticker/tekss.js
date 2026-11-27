// sticker/tekss — satu file: metadata + kode fitur (gabungan dari engine4/plugins/sticker/tekss.js)
const __vx = require("../../lib/adapter/e4.js")
const __meta = {
  "name": "tekss",
  "command": [
    "tekss",
    "tekssticker",
    "stikerteks"
  ],
  "category": "sticker",
  "desc": "Membuat sticker Brat dari teks",
  "usage": ".tekss <text>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 10,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/sticker").split('\\').join('/')
module.exports = __vx.plugin("sticker/tekss", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/tekss.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const config = __vxDef(require("../../lib/ext/config.e4.js"));
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.e4.js"));
  
  const pluginConfig = {
    name: "tekss",
    alias: ["tekssticker", "stikerteks"],
    category: "sticker",
    description: "Membuat sticker Brat dari teks",
    usage: ".tekss <text>",
    example: ".tekss Hai semua",
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 10,
    energi: 1,
    isEnabled: true,
  };
  
  async function handler(m, { sock }) {
    const text = (m.args || []).join(" ").trim();
  
    if (!text) {
      return m.reply(
        `🖼️ *TEKSS STICKER*\n\n` +
        `Masukkan teks yang ingin dibuat menjadi sticker.\n\n` +
        `Contoh:\n` +
        `\`${m.prefix}tekss Hai semua\``
      );
    }
  
    await m.react("🕕");
  
    try {
      const url =
        `https://api.nexray.eu.cc/maker/brat?text=${encodeURIComponent(text)}`;
  
      await sock.sendImageAsSticker(
        m.chat,
        url,
        m,
        {
          packname: config.sticker.packname,
          author: config.sticker.author,
        }
      );
  
      await m.react("✅");
    } catch (error) {
      console.error("ERROR TEKSS:", error);
      await m.react("❌");
      return m.reply(te(m.prefix, m.command, m.pushName));
    }
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
