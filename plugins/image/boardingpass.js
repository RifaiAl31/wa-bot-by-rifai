// canvas/boardingpass — satu file: metadata + kode fitur (gabungan dari engine7/plugins/canvas/boardingpass.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "boardingpass",
  "command": [
    "boardingpass",
    "nasapass",
    "boarding"
  ],
  "category": "image",
  "desc": "Membuat tiket NASA Boarding Pass kustom",
  "usage": ".boardingpass <nama>",
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
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/canvas").split('\\').join('/')
module.exports = __vx.plugin("canvas/boardingpass", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/boardingpass.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const axios = __vxDef(require("axios"));
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.e7.js"));
  
  const pluginConfig = {
    name: "boardingpass",
    alias: ["nasapass", "boarding"],
    category: "canvas",
    description: "Membuat tiket NASA Boarding Pass kustom",
    usage: ".boardingpass <nama>",
    example: ".boardingpass Alex",
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 1,
    isEnabled: true,
  };
  
  // 🔑 API Key Zelapi
  const ZELAPI_KEY = "zelapi-u43ihyj";
  
  async function handler(m, { sock }) {
    const fullText = (m.text || m.body || "").trim();
    const prefix = m.prefix || ".";
  
    // Parsing nama dari argumen
    const inputName = fullText.replace(/^[\/.!#]?(boardingpass|nasapass|boarding)\s*/i, "").trim();
  
    if (!inputName) {
      return m.reply(
        `🚀 *ɴᴀsᴀ ʙᴏᴀʀᴅɪɴɢ ᴘᴀss*\n\n` +
        `> *Penggunaan:* \`${prefix}boardingpass <Nama>\`\n` +
        `> *Contoh:* \`${prefix}boardingpass Alex\``
      );
    }
  
    await m.react("🎫");
  
    try {
      const targetUrl = `https://zelapi.eu.cc/canvas/boardingpass`;
  
      const res = await axios.get(targetUrl, {
        params: {
          name: inputName,
          apikey: ZELAPI_KEY
        },
        responseType: "arraybuffer",
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
        },
        timeout: 20000
      });
  
      const imageBuffer = Buffer.from(res.data);
  
      await m.react("✅");
  
      // Kirim langsung berupa Gambar Polosan
      return await sock.sendMessage(m.chat, {
        image: imageBuffer,
        caption: `🚀 *NASA Boarding Pass* for *${inputName}*`
      }, { quoted: m });
  
    } catch (error) {
      console.error("[Boarding Pass Error]:", error?.message);
      await m.react("☢");
      m.reply(te(m.prefix, m.command, m.pushName));
    }
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
