// tools/emojitoimage — satu file: metadata + kode fitur (gabungan dari engine3/plugins/tools/emojitoimage.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "emojitoimage",
  "command": [
    "emojitoimage",
    "emoji2img",
    "emojiimg",
    "e2i"
  ],
  "category": "tools",
  "desc": "Konversi emoji ke gambar HD (style Apple)",
  "usage": ".emojitoimage <emoji> [style]",
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
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/tools").split('\\').join('/')
module.exports = __vx.plugin("tools/emojitoimage", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/emojitoimage.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const axios = __vxDef(require("axios"));
  const config = __vxDef(require("../../lib/ext/config.e3.js"));
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.js"));
  const { saluranCtx } = require("../../lib/ext/src/lib/vanxone-context.js");
  const NEOXR_APIKEY = config.APIkey?.neoxr || '';
  
  const pluginConfig = {
    name: "emojitoimage",
    alias: ["emoji2img", "emojiimg", "e2i"],
    category: "tools",
    description: "Konversi emoji ke gambar HD (style Apple)",
    usage: ".emojitoimage <emoji> [style]",
    example: ".emojitoimage 😳 apple",
    cooldown: 5,
    energi: 1,
    isEnabled: true,
  };
  
  const STYLES = [
    "apple",
    "google",
    "microsoft",
    "samsung",
    "whatsapp",
    "twitter",
    "facebook",
  ];
  
  async function handler(m, { sock }) {
    const args = m.args || [];
    const emoji = args[0]?.trim();
    const style = args[1]?.toLowerCase() || "apple";
  
    if (!emoji) {
      return m.reply(
        `🖼️ *ᴇᴍᴏᴊɪ ᴛᴏ ɪᴍᴀɢᴇ*\n\n` +
          `> Konversi emoji ke gambar HD\n\n` +
          `*Format:*\n` +
          `> \`${m.prefix}emojitoimage <emoji> [style]\`\n\n` +
          `*Contoh:*\n` +
          `> \`${m.prefix}emojitoimage 😳 apple\`\n\n` +
          `*Style tersedia:*\n` +
          `> ${STYLES.join(", ")}`,
      );
    }
  
    const validStyle = STYLES.includes(style) ? style : "apple";
  
    m.react("🖼️");
  
    try {
      const apiUrl = `https://api.neoxr.eu/api/emoimg?q=${encodeURIComponent(emoji)}&style=${validStyle}&apikey=${NEOXR_APIKEY}`;
      const { data } = await axios.get(apiUrl, { timeout: 15000 });
  
      if (!data?.status || !data?.data?.url) {
        m.react("❌");
        return m.reply("❌ *ɢᴀɢᴀʟ*\n\n> Emoji tidak ditemukan atau API error");
      }
  
      const imgUrl = data.data.url;
  
      await sock.sendMedia(
        m.chat,
        imgUrl,
        `🖼️ *ᴇᴍᴏᴊɪ ᴛᴏ ɪᴍᴀɢᴇ*\n\n> Emoji: ${emoji}\n> Style: ${validStyle}\n> Code: ${data.data.code || "-"}`,
        m,
        { type: "image", contextInfo: saluranCtx() },
      );
  
      m.react("✅");
    } catch (error) { globalThis.__vanxoneCatch?.(error);
      m.react("☢");
      m.reply(te(m.prefix, m.command, m.pushName));
    }
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
