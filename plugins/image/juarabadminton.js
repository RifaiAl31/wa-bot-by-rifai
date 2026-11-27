// canvas/juarabadminton — satu file: metadata + kode fitur (gabungan dari engine7/plugins/canvas/juarabadminton.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "juarabadminton",
  "command": [
    "juarabadminton",
    "sertifikatbadminton",
    "badmintoncert",
    "badminton"
  ],
  "category": "image",
  "desc": "Membuat sertifikat Juara Badminton kustom",
  "usage": ".juarabadminton <nama>",
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
module.exports = __vx.plugin("canvas/juarabadminton", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/juarabadminton.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const axios = __vxDef(require("axios"));
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.e7.js"));
  
  const pluginConfig = {
    name: "juarabadminton",
    alias: ["sertifikatbadminton", "badmintoncert", "badminton"],
    category: "canvas",
    description: "Membuat sertifikat Juara Badminton kustom",
    usage: ".juarabadminton <nama>",
    example: ".juarabadminton Alex",
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 1,
    isEnabled: true,
  };
  
  // 🔑 API Key Theresav
  const THERESAV_KEY = "4ZtwE";
  
  async function handler(m, { sock }) {
    const fullText = (m.text || m.body || "").trim();
    const prefix = m.prefix || ".";
  
    // Parsing nama dari argumen
    const inputName = fullText.replace(/^[\/.!#]?(juarabadminton|sertifikatbadminton|badmintoncert|badminton)\s*/i, "").trim();
  
    if (!inputName) {
      return m.reply(
        `🏸 *ᴊᴜᴀʀᴀ ʙᴀᴅᴍɪɴᴛᴏɴ ᴄᴇʀᴛɪғɪᴄᴀᴛᴇ*\n\n` +
        `> *Penggunaan:* \`${prefix}juarabadminton <Nama>\`\n` +
        `> *Contoh:* \`${prefix}juarabadminton Alex\``
      );
    }
  
    await m.react("🏸");
  
    try {
      const targetUrl = `https://api.theresav.biz.id/canvas/cbadminton`;
  
      const res = await axios.get(targetUrl, {
        params: {
          text: inputName,
          apikey: THERESAV_KEY
        },
        responseType: "arraybuffer",
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
        },
        timeout: 20000
      });
  
      const imageBuffer = Buffer.from(res.data);
  
      await m.react("✅");
  
      // Kirim gambar polosan
      return await sock.sendMessage(m.chat, {
        image: imageBuffer,
        caption: `🏸 *Certificate of Badminton* for *${inputName}*`
      }, { quoted: m });
  
    } catch (error) {
      console.error("[Juara Badminton Error]:", error?.message);
      await m.react("☢");
      m.reply(te(m.prefix, m.command, m.pushName));
    }
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
