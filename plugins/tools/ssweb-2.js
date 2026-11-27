// tools/ssweb — satu file: metadata + kode fitur (gabungan dari engine3/plugins/tools/ssweb.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "ssweb",
  "command": [
    "webss"
  ],
  "category": "tools",
  "desc": "Screenshot website",
  "usage": ".ssweb <url>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 15,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/tools").split('\\').join('/')
module.exports = __vx.plugin("tools/ssweb", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/ssweb.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const axios = __vxDef(require("axios"));
  const config = __vxDef(require("../../lib/ext/config.e3.js"));
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.js"));
  
  const pluginConfig = {
    name: "ssweb",
    alias: ["screenshot", "ss", "webss"],
    category: "tools",
    description: "Screenshot website",
    usage: ".ssweb <url>",
    example: ".ssweb https://google.com",
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 15,
    energi: 1,
    isEnabled: true,
  };
  
  async function ssweb(url, mode = "desktop") {
    const width = mode === "mobile" ? 720 : 1920;
    const apiUrl = `https://image.thum.io/get/width/${width}/crop/1080/noanimate/${url}`;
    const res = await axios.get(apiUrl, {
      responseType: "arraybuffer",
      timeout: 30000,
    });
    return Buffer.from(res.data);
  }
  
  async function handler(m, { sock }) {
    let text = m.text?.trim();
  
    if (!text) {
      return m.reply(
        `📸 *sᴄʀᴇᴇɴsʜᴏᴛ ᴡᴇʙ*\n\n` +
          `> Screenshot halaman website\n\n` +
          `> *Contoh:*\n` +
          `> ${m.prefix}ssweb https://google.com\n` +
          `> ${m.prefix}ss https://github.com --mobile`,
      );
    }
  
    let mode = "desktop";
    if (text.includes("--mobile") || text.includes("--hp")) {
      mode = "mobile";
      text = text.replace(/--mobile|--hp/g, "").trim();
    }
  
    if (!text.startsWith("http")) {
      text = "https://" + text;
    }
  
    await m.react("🕕");
  
    try {
      const imageBuffer = await ssweb(text, mode);
  
      const saluranId = config.saluran?.id || "";
      const saluranName = config.saluran?.name || config.bot?.name || "WhatsApp Bot";
  
      await sock.sendMedia(m.chat, imageBuffer, null, m, {
        type: "image",
      });
  
      await m.react("✅");
    } catch (error) {
      await m.react("☢");
      m.reply(te(m.prefix, m.command, m.pushName));
    }
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  Object.defineProperty(__vxExports, "ssweb", { enumerable: true, get: () => ssweb });
  return __vxExports
})
