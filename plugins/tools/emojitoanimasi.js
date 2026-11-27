// tools/emojitoanimasi — satu file: metadata + kode fitur (gabungan dari engine3/plugins/tools/emojitoanimasi.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "emojitoanimasi",
  "command": [
    "emojitoanimasi",
    "emoji2sticker",
    "emojisticker",
    "e2s"
  ],
  "category": "tools",
  "desc": "Konversi emoji ke sticker animasi",
  "usage": ".emojitoanimasi <emoji>",
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
module.exports = __vx.plugin("tools/emojitoanimasi", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/emojitoanimasi.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const axios = __vxDef(require("axios"));
  const config = __vxDef(require("../../lib/ext/config.e3.js"));
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.js"));
  const { saluranCtx } = require("../../lib/ext/src/lib/vanxone-context.js");
  const NEOXR_APIKEY = config.APIkey?.neoxr || '';
  
  const pluginConfig = {
    name: "emojitoanimasi",
    alias: ["emoji2sticker", "emojisticker", "e2s"],
    category: "tools",
    description: "Konversi emoji ke sticker animasi",
    usage: ".emojitoanimasi <emoji>",
    example: ".emojitoanimasi 😳",
    cooldown: 5,
    energi: 1,
    isEnabled: true,
  };
  
  async function handler(m, { sock }) {
    const emoji = m.text?.trim();
  
    if (!emoji) {
      return m.reply(
        `🎭 *ᴇᴍᴏᴊɪ ᴛᴏ ᴀɴɪᴍᴀsɪ*\n\n` +
          `> Konversi emoji ke sticker animasi\n\n` +
          `*Contoh:*\n` +
          `> \`${m.prefix}emojitoanimasi 😳\``,
      );
    }
  
    m.react("🎭");
  
    try {
      const apiUrl = `https://api.neoxr.eu/api/emojito?q=${encodeURIComponent(emoji)}&apikey=${NEOXR_APIKEY}`;
      const { data } = await axios.get(apiUrl, { timeout: 15000 });
  
      if (!data?.status || !data?.data?.url) {
        m.react("❌");
        return m.reply("❌ *ɢᴀɢᴀʟ*\n\n> Emoji tidak ditemukan atau API error");
      }
  
      const webpUrl = data.data.url;
  
      const webpRes = await axios.get(webpUrl, {
        responseType: "arraybuffer",
        timeout: 15000,
      });
      const webpBuffer = Buffer.from(webpRes.data);
  
      await sock.sendMessage(
        m.chat,
        {
          sticker: webpBuffer,
          contextInfo: saluranCtx(),
        },
        { quoted: m },
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
