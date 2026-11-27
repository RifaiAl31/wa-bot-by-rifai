// canvas/watercolortext — satu file: metadata + kode fitur (gabungan dari engine3/plugins/canvas/watercolortext.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "watercolortext",
  "command": [
    "watercolortext",
    "watercolor",
    "wctext"
  ],
  "category": "image",
  "desc": "Buat gambar teks dengan efek watercolor",
  "usage": ".watercolortext <teks>",
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
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/canvas").split('\\').join('/')
module.exports = __vx.plugin("canvas/watercolortext", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/watercolortext.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.js"));
  const config = __vxDef(require("../../lib/ext/config.e3.js"));
  const axios = __vxDef(require("axios"));
  
  const pluginConfig = {
    name: "watercolortext",
    alias: ["watercolor", "wctext"],
    category: "canvas",
    description: "Buat gambar teks dengan efek watercolor",
    usage: ".watercolortext <teks>",
    example: ".watercolortext WhatsApp Bot",
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
        `🎨 *ᴡᴀᴛᴇʀᴄᴏʟᴏʀ ᴛᴇxᴛ*\n\n> Masukkan teks yang ingin dijadikan gambar\n\n\`Contoh: ${m.prefix}watercolortext WhatsApp Bot\``,
      );
    }
  
    m.react("🕕");
  
    try {
      const url = `https://api.cuki.biz.id/api/ephoto/watercolortext?apikey=${config.APIkey.cuki}&query=${encodeURIComponent(text)}`;
      
      // Mengunduh gambar langsung (response type image)
      const { data } = await axios.get(url, {
        responseType: 'arraybuffer',
        timeout: 30000
      });
  
      const imageBuffer = Buffer.from(data, 'binary');
  
      m.react("✅");
      await sock.sendMessage(m.chat, { 
        image: imageBuffer, 
        caption: `🎨 *Water Color Text*\n\nTeks: ${text}` 
      }, { quoted: m });
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
