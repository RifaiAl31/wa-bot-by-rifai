// ai/text2img — satu file: metadata + kode fitur (gabungan dari engine3/plugins/ai/text2img.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "text2img",
  "command": [
    "text2img"
  ],
  "category": "ai",
  "desc": "Buat gambar dari teks",
  "usage": ".text2img <teks>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 1,
  "needs": {
    "apikeys": [
      "firefly"
    ],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/ai").split('\\').join('/')
module.exports = __vx.plugin("ai/text2img", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/text2img.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const axios = __vxDef(require("axios"));
  const { f } = require("../../lib/ext/src/lib/vanxone-http.js");
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.js"));
  const config = __vxDef(require("../../lib/ext/config.e3.js"));
  const pluginConfig = {
    name: "text2img",
    alias: [],
    category: "ai",
    description: "Buat gambar dari teks",
    usage: ".text2img <teks>",
    example: ".text2img Buat gambar dari teks",
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
        `📿 *ᴛᴇxᴛ ᴛᴏ ɪᴍᴀɢᴇ*\n\n> Masukkan teks\n\n\`Contoh: ${m.prefix}text2img Buat gambar dari teks\``,
      );
    }
  
    m.react("🕕");
  
    try {
      const url = `https://firefly.maiku.my.id/api/deepai?apikey=${config.APIkey.firefly}&prompt=${encodeURIComponent(text)}`;
      const data = await axios.get(url);
  
      const content = data.data.data.output_url;
  
      m.react("✅");
      await sock.sendMedia(m.chat, content, text, m, {
        type: "image",
      });
    } catch (error) { globalThis.__vanxoneCatch?.(error);
      console.error(error);
      m.react("☢");
      m.reply(te(m.prefix, m.command, m.pushName));
    }
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
