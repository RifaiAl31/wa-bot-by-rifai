// tools/sendngl — satu file: metadata + kode fitur (gabungan dari engine3/plugins/tools/sendngl.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "sendngl",
  "command": [
    "sendngl"
  ],
  "category": "tools",
  "desc": "Send NGL",
  "usage": ".sendngl <url> | <text>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/tools").split('\\').join('/')
module.exports = __vx.plugin("tools/sendngl", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/sendngl.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.js"));
  const vanxoneApi = __vxDef(require("../../lib/ext/src/lib/vanxone-apimanager.js"));
  const pluginConfig = {
    name: "sendngl",
    alias: [],
    category: "tools",
    description: "Send NGL",
    usage: ".sendngl <url> | <text>",
    example: ".sendngl https://ngl.link/xxxx | hai",
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 0,
    isEnabled: true,
  };
  
  async function handler(m, { sock }) {
    const text = m.text?.split("|");
    const [link, kata] = text;
    if (!link)
      return m.reply(
        `*LINK NGL NYA MANA ??*\nContoh: \`${m?.prefix}sendngl https://ngl.link/xxxx | hai`,
      );
    if (!kata)
      return m.reply(
        `*KATA KATA NYA MANA ??*\n\nContoh: \`${m?.prefix}sendngl https://ngl.link/xxxx | hai`,
      );
    m.react("🎴");
  
    try {
      await vanxoneApi.cuki.sendNgl(
        {
          link,
          text: kata,
        },
        {
          timeout: 30000,
        },
      );
  
      m.react("✅");
  
      await sock.sendMessage(
        m.chat,
        {
          text: `✅ *DONE*\n\nBerhasil mengirim pesan!\nTarget: ${link}\nPesan: ${kata}`,
        },
        { quoted: m },
      );
    } catch (error) { globalThis.__vanxoneCatch?.(error);
      m.react("☢");
      m.reply(te(m.prefix, m.command, m.pushName));
    }
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
