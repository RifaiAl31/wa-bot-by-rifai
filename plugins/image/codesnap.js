// canvas/codesnap — satu file: metadata + kode fitur (gabungan dari engine3/plugins/canvas/codesnap.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "codesnap",
  "command": [
    "codesnap"
  ],
  "category": "image",
  "desc": "Bikin gambar cuplikan code",
  "usage": ".codesnap <code>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 2,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/canvas").split('\\').join('/')
module.exports = __vx.plugin("canvas/codesnap", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/codesnap.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.js"));
  const axios = __vxDef(require("axios"));
  const FormData = __vxDef(require("form-data"));
  
  const pluginConfig = {
    name: "codesnap",
    alias: [],
    category: "canvas",
    description: "Bikin gambar cuplikan code",
    usage: ".codesnap <code>",
    example: ".codesnap console.log('hello')",
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 2,
    isEnabled: true,
  };
  
  async function handler(m, { sock }) {
    const code = m.text?.trim() || m.quoted?.text?.trim();
  
    if (!code) {
      return m.reply(`⚠️ Harap masukkan kodenya!\nContoh: \`${m.prefix}${m.command} console.log('hello')\``);
    }
  
    await m.react("🕕");
    
    try {
      const form = new FormData();
      form.append("code", code);
  
      const img = await axios.post(
        "https://carbonara.solopov.dev/api/cook",
        form,
        {
          headers: {
            ...form.getHeaders(),
            Accept: "image/png"
          },
          responseType: "arraybuffer"
        }
      );
  
      const buffer = Buffer.from(img.data);
      await sock.sendMessage(m.chat, { image: buffer, caption: "💻 *CodeSnap*" }, { quoted: m });
      await m.react("✅");
  
    } catch (err) {
      await m.react("☢");
      m.reply(te(m.prefix, m.command, m.pushName));
    }
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
