// ai/toblack — satu file: metadata + kode fitur (gabungan dari engine3/plugins/ai/toblack.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "toblack",
  "command": [
    "toblack",
    "black",
    "hitamkan",
    "hitam",
    "tohitam"
  ],
  "category": "ai",
  "desc": "Ubah gambar ke skin tone lebih gelap",
  "usage": ".toblack (reply gambar)",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 30,
  "energi": 2,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/ai").split('\\').join('/')
module.exports = __vx.plugin("ai/toblack", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/toblack.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const axios = __vxDef(require("axios"));
  const { uploadImage } = require("../../lib/ext/src/lib/vanxone-uploader.js");
  const { f } = require("../../lib/ext/src/lib/vanxone-http.js");
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.js"));
  const { live3d } = require("../../lib/ext/src/scraper/seaart.e3.js");
  const pluginConfig = {
    name: "toblack",
    alias: ["black", "hitamkan", "hitam", "tohitam"],
    category: "ai",
    description: "Ubah gambar ke skin tone lebih gelap",
    usage: ".toblack (reply gambar)",
    example: ".toblack",
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 30,
    energi: 2,
    isEnabled: true,
  };
  
  async function handler(m, { sock }) {
    const isImage = m.isImage || (m.quoted && m.quoted.type === "imageMessage");
  
    if (!isImage) {
      return m.reply(
        `🖤 *ʙʟᴀᴄᴋ sᴛʏʟᴇ*\n\n> Kirim/reply gambar\n\n\`${m.prefix}toblack\``,
      );
    }
  
    const PROMPT = `Transform skin tone to a darker complexion, maintain facial features, realistic shadows, high detail, natural skin texture, no distortion`;
  
    try {
      let buffer;
      if (m.quoted && m.quoted.isMedia) {
        buffer = await m.quoted.download();
      } else if (m.isMedia) {
        buffer = await m.download();
      }
  
      if (!buffer) {
        m.react("❌");
        return m.reply(`❌ Gagal mendownload gambar`);
      }
  
      const result = await live3d(buffer, PROMPT);
  
      m.react("✅");
  
      await sock.sendMedia(m.chat, result.image, null, m, {
        type: "image",
      });
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
